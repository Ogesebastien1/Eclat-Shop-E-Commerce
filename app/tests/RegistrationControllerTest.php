<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class RegistrationControllerTest extends WebTestCase
{
    public function testRegister(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/register', [
            'login' => 'testuser',
            'email' => 'testuser@example.com',
            'firstname' => 'Test',
            'lastname' => 'User',
            'password' => 'testpassword',
            'roles' => 'ROLE_USER'
        ]);

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
    }

    public function testLogin(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/login', [
            'login' => 'testuser',
            'password' => 'testpassword',
        ]);

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
    }
}