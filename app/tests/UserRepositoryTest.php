<?php

namespace App\Tests\Repository;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class UserRepositoryTest extends KernelTestCase
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

    public function testFindOneByEmail(): void
    {
        $user = $this->entityManager
            ->getRepository(User::class)
            ->findOneByEmail('test@example.com');

        $this->assertInstanceOf(User::class, $user);
    }

    public function testFindByExampleField(): void
    {
        $users = $this->entityManager
            ->getRepository(User::class)
            ->findByExampleField('test_value');

        $this->assertIsArray($users);
    }

    public function testFindOneBySomeField(): void
    {
        $user = $this->entityManager
            ->getRepository(User::class)
            ->findOneBySomeField('test_value');

        $this->assertInstanceOf(User::class, $user);
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