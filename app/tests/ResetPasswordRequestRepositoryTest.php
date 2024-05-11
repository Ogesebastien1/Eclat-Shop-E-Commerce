<?php

namespace App\Tests\Repository;

use App\Entity\ResetPasswordRequest;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ResetPasswordRequestRepositoryTest extends KernelTestCase
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

    public function testCreateResetPasswordRequest(): void
    {
        $user = $this->entityManager
            ->getRepository(User::class)
            ->findOneByEmail('test@example.com'); // Assuming there is a user with this email in the database

        $expiresAt = new \DateTime('+1 day');
        $selector = 'test_selector';
        $hashedToken = 'test_hashed_token';

        $resetPasswordRequest = $this->entityManager
            ->getRepository(ResetPasswordRequest::class)
            ->createResetPasswordRequest($user, $expiresAt, $selector, $hashedToken);

        $this->assertInstanceOf(ResetPasswordRequest::class, $resetPasswordRequest);
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