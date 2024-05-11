<?php

namespace App\Tests\Repository;

use App\Entity\Orders;
use App\Repository\OrdersRepository;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class OrdersRepositoryTest extends KernelTestCase
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $entityManager;

    /**
     * {@inheritDoc}
     */
    protected function setUp(): void
    {
        $kernel = self::bootKernel();

        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
    }

    public function testFindAllOrders(): void
    {
        $orders = $this->entityManager
            ->getRepository(Orders::class)
            ->findAllOrders();

        $this->assertIsArray($orders);
    }

    public function testFindOneByUuid(): void
    {
        $order = $this->entityManager
            ->getRepository(Orders::class)
            ->findOneByUuid(['uuid' => 'test_uuid']);

        $this->assertInstanceOf(Orders::class, $order);
    }

    public function testFindOrdersByUuid(): void
    {
        $order = $this->entityManager
            ->getRepository(Orders::class)
            ->findOrdersByUuid('test_uuid');

        $this->assertInstanceOf(Orders::class, $order);
    }

    /**
     * {@inheritDoc}
     */
    protected function tearDown(): void
    {
        parent::tearDown();

        $this->entityManager->close();
        $this->entityManager = null;
    }
}