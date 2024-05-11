<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class OrdersControllerTest extends WebTestCase
{
    public function testShowOrder(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/orders/1');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
    }
}