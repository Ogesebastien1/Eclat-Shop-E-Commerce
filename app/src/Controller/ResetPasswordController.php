<?php
namespace App\Controller;

use App\Entity\User;
use App\Form\ResetPasswordRequestFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\ResetPassword\Controller\ResetPasswordControllerTrait;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Psr\Log\LoggerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

#[Route('/api/reset-password')]
class ResetPasswordController extends AbstractController
{
    use ResetPasswordControllerTrait;

    private $logger;
    private $form;

    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private EntityManagerInterface $entityManager,
        LoggerInterface $logger  // Injectez le service LoggerInterface
    ) {
        $this->logger = $logger;
    }

    #[Route('', name: 'app_forgot_password_request')]
    public function request(Request $request, MailerInterface $mailer, TranslatorInterface $translator): Response
    {
        try {
            $form = $this->createForm(ResetPasswordRequestFormType::class);
            $this->logger->info('Creating form for password reset request.');

            // Log the content of the request
            $this->logger->info('Request content: ' . $request->getContent());

            $form->handleRequest($request);

            $this->logger->info('form content' . $form->get('email')->getData());

            if ($form->get('email')->getData() !== "") {
                $this->logger->info('Form is submitted and valid. Processing password reset email.');
                return $this->processSendingPasswordResetEmail(
                    $form->get('email')->getData(),
                    $mailer,
                    $translator
                );
            }
        } catch (\Exception $e) {
            $this->logger->error('An error occurred while processing the form: ' . $e->getMessage());
            return new JsonResponse(['message' => 'An error occurred while processing the form: ' . $e->getMessage(), 'error_code' => 500], 500);
        }

        return new JsonResponse(['message' => 'Invalid form data.', 'error_code' => 400], 400);
    }

    #[Route('/check-email', name: 'app_check_email')]
    public function checkEmail(): Response
    {
        try {
            if (null === ($resetToken = $this->getTokenObjectFromSession())) {
                $resetToken = $this->resetPasswordHelper->generateFakeResetToken();
            }
        } catch (\Exception $e) {
            $this->logger->error('An error occurred while getting the reset token: ' . $e->getMessage());
            return new JsonResponse(['message' => 'An error occurred while getting the reset token: ' . $e->getMessage(), 'error_code' => 500], 500);
        }

        return new JsonResponse(['resetToken' => $resetToken]);
    }

    #[Route('/reset', name: 'app_reset_password')]
    public function reset(Request $request, UserPasswordHasherInterface $passwordHasher, TranslatorInterface $translator, MailerInterface $mailer, ?string $token = null): Response
    {
        try {
            $data = json_decode($request->getContent(), true);
            if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON: ' . json_last_error_msg());
            }
        } catch (\Exception $e) {
            $this->logger->error('An error occurred while decoding the request content: ' . $e->getMessage());
            return new JsonResponse(['message' => 'An error occurred while decoding the request content: ' . $e->getMessage(), 'error_code' => 500], 500);
        }

        $token = $data["content"]['token'] ?? null;
        $plainPassword = $data["content"]['plainPassword'] ?? null;
        $email = $data["content"]['email'] ?? null;

        if ($plainPassword) {
            $this->logger->info("password: ". $plainPassword);
        } else {
            $this->logger->info('No password provided.');
        }

        if (null === $token) {
            $this->logger->error('No reset password token found in the URL or in the session.');
            return new JsonResponse(['message' => 'No reset password token found in the URL or in the session.', 'error_code' => 400], 400);
        }

        try {
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface $e) {
            $this->logger->error('An error occurred while validating the reset token: ' . $e->getMessage());
            return new JsonResponse(['message' => 'An error occurred while validating the reset token: ' . $e->getMessage(), 'error_code' => 500], 500);
        }

        if ($email !== "") {
            $this->resetPasswordHelper->removeResetRequest($token);

            try {
                $encodedPassword = $passwordHasher->hashPassword(
                    $user,
                    $plainPassword
                );

                $user->setPassword($encodedPassword);
                $this->entityManager->flush();
            } catch (\Exception $e) {
                $this->logger->error('An error occurred while updating the user password: ' . $e->getMessage());
                return new JsonResponse(['message' => 'An error occurred while updating the user password: ' . $e->getMessage(), 'error_code' => 500], 500);
            }

            $this->cleanSessionAfterReset();

            try {
                $email = (new TemplatedEmail())
                ->from(new Address('MS_xofncP@trial-jy7zpl93p2pl5vx6.mlsender.net', 'STG_16 team'))
                ->to($user->getEmail())
                ->subject('Your password reset request')
                ->htmlTemplate('reset_password/email.html.twig');

                $mailer->send($email);
            } catch (\Exception $e) {
                $this->logger->error('An error occurred while sending the password reset email: ' . $e->getMessage());
                return new JsonResponse(['message' => 'An error occurred while sending the password reset email: ' . $e->getMessage(), 'error_code' => 500], 500);
            }

            $this->logger->info('Password reset email sent.', ['email' => $user->getEmail()]);

            return new JsonResponse(['message' => 'Password reset successful.']);
        }

        return new JsonResponse(['message' => 'Invalid form data.', 'error_code' => 400], 400);
    }

    private function processSendingPasswordResetEmail(string $emailFormData, MailerInterface $mailer, TranslatorInterface $translator): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'email' => $emailFormData,
        ]);

        $this->logger->info('Searching for user with email: ' . $emailFormData);

        if (!$user) {
            $this->logger->info('No user found with the provided email.');
            return new JsonResponse(['message' => 'An error as occurred']);
        }

        $this->logger->info("going to create the reset token");
        
        try {
            $resetToken = $this->resetPasswordHelper->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface $e) {
            $this->logger->error('An error occurred while generating the reset token: ' . $e->getMessage() . ', Reason: ' . $e->getReason());
            $this->addFlash('reset_password_error', sprintf(
                '%s - %s',
                $translator->trans(ResetPasswordExceptionInterface::MESSAGE_PROBLEM_HANDLE, [], 'ResetPasswordBundle'),
                $translator->trans($e->getReason(), [], 'ResetPasswordBundle')
            ));

            return new JsonResponse(['message' => 'An error occurred while generating the reset token : ' . $e, 'error_code' => 500], 500);
        }

        $email = $data["content"]['email'] ?? null;

        $email = (new TemplatedEmail())
            ->from(new Address('MS_xofncP@trial-jy7zpl93p2pl5vx6.mlsender.net', 'STG_16 team'))
            ->to($user->getEmail())
            ->subject('Your password reset request')
            ->htmlTemplate('reset_password/link.html.twig')
            ->context([
                'resetToken' => $resetToken,
            ]);


        $mailer->send($email);

        $this->logger->info('Password reset email sent.', ['email' => $user->getEmail()]);

        return new JsonResponse(['message' => 'Password reset email sent.'], 200);
        // Store the token object in session for retrieval in check-email route.
        $this->setTokenObjectInSession($resetToken);
    }

    #[Route('/update', name: 'app_reset_with_jwt', methods: ['POST'])]
    public function resetWithJwt(Request $request, JWTTokenManagerInterface $jwtManager, MailerInterface $mailer, TranslatorInterface $translator, ResetPasswordHelperInterface $resetPasswordHelper, EntityManagerInterface $entityManager): Response
    {
        try {
            $data = json_decode($request->getContent(), true);
            if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON: ' . json_last_error_msg());
            }
        } catch (\Exception $e) {
            $this->logger->error('An error occurred while decoding the request content: ' . $e->getMessage());
            return new JsonResponse(['message' => 'An error occurred while decoding the request content: ' . $e->getMessage(), 'error_code' => 500], 500);
        }

        $email = $data["content"]['email'] ?? null;

        $this->logger->info('Received password reset request.', ['email' => $email]);

        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'email' => $email,
        ]);

        if (!$user) {
            $this->logger->info('No user found with the provided email.');
            return new JsonResponse(['message' => 'An error as occurred']);
        }

        try {
            $resetToken = $resetPasswordHelper->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface $e) {
            $this->logger->error('An error occurred while generating the reset token: ' . $e->getMessage() . ', Reason: ' . $e->getReason());
            return new JsonResponse(['message' => 'An error occurred while generating the reset token : ' . $e, 'error_code' => 500], 500);
        }

        try {
            $email = (new TemplatedEmail())
                ->from(new Address('MS_xofncP@trial-jy7zpl93p2pl5vx6.mlsender.net', 'STG_16 team'))
                ->to($user->getEmail())
                ->subject('Your password reset request')
                ->htmlTemplate('reset_password/link.html.twig')
                ->context([
                    'resetToken' => $resetToken,
                ]);

            $mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->error('An error occurred while sending the password reset email: ' . $e->getMessage());
            return new JsonResponse(['message' => 'An error occurred while sending the password reset email: ' . $e->getMessage(), 'error_code' => 500], 500);
        }

        $this->logger->info('Password reset email sent.', ['email' => $user->getEmail()]);

        return new JsonResponse(['message' => 'Password reset email sent.'], 200);
    }
}