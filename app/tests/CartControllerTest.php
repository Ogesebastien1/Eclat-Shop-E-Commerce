<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use Firebase\JWT\JWT;

class CartControllerTest extends WebTestCase
{
    private $client;
    private $container;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->container = $this->client->getContainer();
    }

    public function testAddToCart()
    {
        $productRepository = $this->container->get(ProductRepository::class);
        $product = $productRepository->findOneBy([]);
        $this->client->request('POST', '/api/carts/'.$product->getId());
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testRemoveFromCart()
    {
        $productRepository = $this->container->get(ProductRepository::class);
        $product = $productRepository->findOneBy([]);
        $this->client->request('DELETE', '/api/carts/remove/'.$product->getId());
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testDeleteFromCart()
    {
        $productRepository = $this->container->get(ProductRepository::class);
        $product = $productRepository->findOneBy([]);
        $this->client->request('DELETE', '/api/carts/purge/'.$product->getId());
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }
}