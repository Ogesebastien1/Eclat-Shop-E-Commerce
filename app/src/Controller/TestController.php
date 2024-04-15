<?php
// src/Controller/TestController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TestController extends AbstractController
{
    #[Route('/test', name: 'test', methods: ['GET'])]
    public function index(): Response
    {
        return new Response('Hello, this is a test route!');
    }
}
?>