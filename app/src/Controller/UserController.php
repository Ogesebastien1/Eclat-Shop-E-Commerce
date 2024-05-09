<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Aws\S3\S3Client;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UserController extends AbstractController
{

    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    #[Route('/api/user', name: 'user', methods: ['GET'])]
    public function index(LoggerInterface $logger, JWTTokenManagerInterface $jwtManager, Request $request): Response
    {
        $logger->info('Entering the index method.');

        $logger->info('Got the user from the security context.');
        // Get the JWT from the request
        $jwt = $request->headers->get('Authorization');

        // Define the decoding key and the allowed algorithms
        $publicKey = file_get_contents(__DIR__ . '/../../config/jwt/public.pem');

        // Decode the JWT
        $decodedJwt = JWT::decode($jwt, new Key($publicKey, 'RS256'));

        // Get the current user
        $user = $this->userRepository->findOneByEmail($decodedJwt->username);
        
        // Log the decoded JWT
        $logger->info('Decoded JWT: ' . json_encode((array) $decodedJwt));
        // If a user is authenticated, return their data
        if ($user) {
            $logger->info('User is authenticated, returning their data.');

            // Log the user's data
            $logger->info('User data: ' . json_encode([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'login' => $user->getLogin(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'roles' => $user->getRoles(),
                'avaatar' => $user->getAvatar()
            ]));

            return $this->json([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'login' => $user->getLogin(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'roles' => $user->getRoles(),
                'avatar' => $user->getAvatar()
            ]);
        }

        $logger->info('No user is authenticated, throwing an exception.');

        // If no user is authenticated, throw an exception
        throw new AuthenticationException('No user is authenticated.');
    }

    #[Route('/api/user', name: 'update_user', methods: ['PUT'])]
    public function update(Request $request, LoggerInterface $logger, JWTTokenManagerInterface $jwtManager, EntityManagerInterface $entityManager): Response
    {
        $logger->info('Entering the update method.');

        // Get the JWT from the request
        $jwt = $request->headers->get('Authorization');

        // Define the decoding key and the allowed algorithms
        $publicKey = file_get_contents(__DIR__ . '/../../config/jwt/public.pem');

        // Decode the JWT
        $decodedJwt = JWT::decode($jwt, new Key($publicKey, 'RS256'));

        // Get the current user
        $user = $this->userRepository->findOneByEmail($decodedJwt->username);

        // If the user does not exist, return a 404 response
        if (!$user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Get the request data
        $data = json_decode($request->getContent(), true);

        // Update the user fields
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['login'])) {
            $user->setLogin($data['login']);
        }
        if (isset($data['firstname'])) {
            $user->setFirstname($data['firstname']);
        }
        if (isset($data['lastname'])) {
            $user->setLastname($data['lastname']);
        }

        if (isset($data['avatar'])) {
            $user->setAvatar($data['avatar']);
        }

        // Save the updated user to the database
        $entityManager->persist($user);
        $entityManager->flush();

        // Return a successful response
        return $this->json(['message' => 'User updated successfully']);
    }

    #[Route('/api/user/avatar', name: 'user_avatar_update', methods: ['PUT'])]
    public function updateAvatar(Request $request, EntityManagerInterface $entityManager, LoggerInterface $logger, JWTTokenManagerInterface $jwtManager): Response
    {
        $logger->info('Entering the updateAvatar method.');

        // Get the JWT from the request
        $jwt = $request->headers->get('Authorization');

        // Define the decoding key and the allowed algorithms
        $publicKey = file_get_contents(__DIR__ . '/../../config/jwt/public.pem');

        // Decode the JWT
        $decodedJwt = JWT::decode($jwt, new Key($publicKey, 'RS256'));

        // Get the current user
        $user = $this->userRepository->findOneByEmail($decodedJwt->username);

        if (!$user) {
            return new JsonResponse(['status' => 'Error', 'message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $logger->info('Updating user avatar', ['id' => $user->getId()]);
        // Decode the base64 image and save it to a temporary file
        $avatarData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['avatar']));
        $tempPath = tempnam(sys_get_temp_dir(), 'avatar');
        file_put_contents($tempPath, $avatarData);

        // Create an instance of UploadedFile
        $avatarFile = new UploadedFile($tempPath, 'avatar.png', 'image/png', null, true);

        if (isset($data['avatar'])) {
            $logger->info('Received new avatar');

            // Delete the old avatar from S3
            $oldAvatarKey = basename($user->getAvatar());
            $s3Client = new S3Client([
                'version' => 'latest',
                'region'  => $_SERVER['AWS_REGION'],
                'credentials' => [
                    'key'    => $_SERVER['ACCESS_KEY_ID'],
                    'secret' => $_SERVER['SECRET_ACCESS_KEY'],
                ],
            ]);
            $s3Client->deleteObject([
                'Bucket' => $_SERVER['AWS_BUCKET'],
                'Key' => $oldAvatarKey,
            ]);

            $logger->info('Deleted old avatar from S3', ['key' => $oldAvatarKey]);

            // Upload the new avatar to S3
            $result = $s3Client->putObject([
                'Bucket' => $_SERVER['AWS_BUCKET'],
                'Key' => $avatarFile->getClientOriginalName(),
                'Body' => fopen($avatarFile->getPathname(), 'rb'),
                'ACL' => 'public-read', // Make the avatar publicly accessible
                'ContentType' => $avatarFile->getMimeType(), // Add this line
            ]);

            $logger->info('Uploaded new avatar to S3', ['result' => $result]);

            $user->setAvatar($result['ObjectURL']); // Store the S3 URL of the new avatar
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'User avatar updated successfully',
            'user' => $user
        ]);
    }

    #[Route('/api/user', name: 'delete_user', methods: ['DELETE'])]
    public function delete(Request $request, LoggerInterface $logger, JWTTokenManagerInterface $jwtManager, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        $logger->info('Entering the delete method.');

        // Get the JWT from the request
        $jwt = $request->headers->get('Authorization');

        // Define the decoding key and the allowed algorithms
        $publicKey = file_get_contents(__DIR__ . '/../../config/jwt/public.pem');

        // Decode the JWT
        $decodedJwt = JWT::decode($jwt, new Key($publicKey, 'RS256'));

        // Get the current user
        $user = $this->userRepository->findOneByEmail($decodedJwt->username);

        // If the user does not exist, return a 404 response
        if (!$user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Delete the user
        $entityManager->remove($user);
        $entityManager->flush();

        // Send a confirmation email
        $email = (new TemplatedEmail())
            ->from(new Address('MS_xofncP@trial-jy7zpl93p2pl5vx6.mlsender.net', 'STG_16 team'))
            ->to($user->getEmail())
            ->subject('Your account has been deleted')
            ->htmlTemplate('account_deleted.html.twig')
            ->context([
                'user' => $user,
            ]);

        $mailer->send($email);

        // Return a successful response
        return $this->json(['message' => 'User deleted successfully']);
    }
}
?>