<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use App\Entity\User;

class UserController extends AbstractController
{
    #[Route('/api/user', name: 'user', methods: ['GET'])]
    public function index(): Response
    {
        // Get the current user
        $user = $this->getUser();

        // If a user is authenticated, return their data
        if ($user) {
            return $this->json([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'login' => $user->getLogin(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'roles' => $user->getRoles(),
            ]);
        }

        // If no user is authenticated, throw an exception
        throw new AuthenticationException('No user is authenticated.');
    }
}
?>