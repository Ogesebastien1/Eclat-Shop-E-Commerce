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
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class RegistrationController extends AbstractController
{
    #[Route('/user', name: 'user', methods: ['POST'])]
    public function index(Request $request, UserPasswordHasherInterface $passwordHasher, LoggerInterface $logger): Response
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

        // TODO: Save the user to the database and return a response

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