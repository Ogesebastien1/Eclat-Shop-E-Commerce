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

        // Log the request headers
        $logger->info('Request headers: ' . json_encode($request->headers->all()));

                
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
                'avaatar' => $user->getAvatar() ? 'yes' : 'no',
            ]));

            return $this->json([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'login' => $user->getLogin(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'roles' => $user->getRoles(),
                'avatar' => $user->getAvatar() ? 'yes' : 'no',
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
}
?>