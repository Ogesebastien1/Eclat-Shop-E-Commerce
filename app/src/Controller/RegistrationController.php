<?php
// src/Controller/RegistrationController.php
namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Doctrine\ORM\EntityManagerInterface;


class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function index(Request $request, UserPasswordHasherInterface $passwordHasher, LoggerInterface $logger, EntityManagerInterface $em): Response
    {
        $data = json_decode($request->getContent(), true);
        $login = $data['login'] ?? null;
        $email = $data['email'] ?? null;
        $firstname = $data['firstname'] ?? null;
        $lastname = $data['lastname'] ?? null;
        $plaintextPassword = $data['password'] ?? null;

        $logger->info('Request data', ['data' => $request->request->all()]);

        // Check if password is not null
        if ($plaintextPassword === null) {
            return new Response('Password cannot be null.', 400);
        }

        // Log the user data
        $logger->info('User registration request received', [
            'login' => $login,
            'email' => $email,
            'firstname' => $firstname,
            'lastname' => $lastname,
        ]);

        $user = new User($login, $plaintextPassword, $email, $firstname, $lastname);

        // hash the password (based on the security.yaml config for the $user class)
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $plaintextPassword
        );
        $user->setPassword($hashedPassword);

        // // Save the user to the database
        try {
            // Save the user to the database
            $em->persist($user);
            $em->flush();
        } catch (\Exception $e) {
            $logger->error('Failed to save user', ['exception' => $e->getMessage()]);
            return new Response('Failed to save user: ' . $e->getMessage(), 500);
        }

        return new Response('User registered successfully.');
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $JWTManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $login = $data['login'] ?? null;
        $plaintextPassword = $data['password'] ?? null;

        // Retrieve the user from the database
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['login' => $login]);

        if (!$user || !$passwordHasher->isPasswordValid($user, $plaintextPassword)) {
            return new Response('Invalid credentials.', 401);
        }

        $token = $JWTManager->create($user);

        return new JsonResponse(['token' => $token]);
    }
}
?>