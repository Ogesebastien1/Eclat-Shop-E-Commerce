<?php
// src/Controller/RegistrationController.php
namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{
    public function index(Request $request, UserPasswordHasherInterface $passwordHasher): Response
    {
        // get the user data from a registration form
        $login = $request->request->get('login');
        $email = $request->request->get('email');
        $firstname = $request->request->get('firstname');
        $lastname = $request->request->get('lastname');
        $plaintextPassword = $request->request->get('password');

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
}
?>