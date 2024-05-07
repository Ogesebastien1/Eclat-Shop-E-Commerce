<?php

namespace App\Repository;

use App\Entity\Orders;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Orders|null find($id, $lockMode = null, $lockVersion = null)
 * @method Orders|null findOneBy(array $criteria, array $orderBy = null)
 * @method Orders[]    findAll()
 * @method Orders[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */

class OrdersRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Orders::class);
    }

    //findAll()
    public function findAllOrders(): array
    {
        return $this->createQueryBuilder('o')
            ->getQuery()
            ->getResult();
    }


    public function findOneByUuid(array $criteria): ?object
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.uuid = :uuid')
            ->setParameter('uuid', $criteria['uuid'])
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOrdersByUuid(string $uuid): ?Orders
    {
        return $this->findOneBy(['uuid' => $uuid]);
    }

}