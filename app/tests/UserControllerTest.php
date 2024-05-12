<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class UserControllerTest extends WebTestCase
{
    public function testIndex(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/user');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
    }

    public function testUpdate(): void
    {
        $client = static::createClient();
        $client->request('PUT', '/api/user');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
    }

    public function testUpdateAvatar(): void
    {
        $client = static::createClient();
        $client->request('PUT', '/api/user/avatar');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
    }

    public function testDelete(): void
    {
        $client = static::createClient();
        $client->request('DELETE', '/api/user');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
    }
}