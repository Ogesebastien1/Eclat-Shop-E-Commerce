<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use App\Entity\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Repository\UserRepository;

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
            ]));

            return $this->json([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'login' => $user->getLogin(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'roles' => $user->getRoles(),
            ]);
        }

        $logger->info('No user is authenticated, throwing an exception.');

        // If no user is authenticated, throw an exception
        throw new AuthenticationException('No user is authenticated.');
    }
}
?>