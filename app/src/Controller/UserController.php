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

class UserController extends AbstractController
{
    #[Route('/api/user', name: 'user', methods: ['GET'])]
    public function index(LoggerInterface $logger, JWTTokenManagerInterface $jwtManager, Request $request): Response
    {
        $logger->info('Entering the index method.');

        // Get the current user
        $user = $this->getUser();

        $logger->info('Got the user from the security context.');

        // If a user is authenticated, return their data
        if ($user) {
            $logger->info('User is authenticated, returning their data.');

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