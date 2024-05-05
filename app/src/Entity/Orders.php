<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity]
class Orders
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private ?float $totalPrice = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $creationDate = null;

    #[ORM\OneToMany(mappedBy: 'order', targetEntity: OrdersItem::class, cascade: ['persist'])]
    private $products;

    public function __construct()
    {
        $this->products = new ArrayCollection();
        $this->creationDate = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTotalPrice(): ?float
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(float $totalPrice): self
    {
        $this->totalPrice = $totalPrice;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(\DateTimeInterface $creationDate): self
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function getProducts()
    {
        return $this->products;
    }

    public function addProduct(OrdersItem $product): self
    {
        if (!$this->products->contains($product)) {
            $this->products[] = $product;
            $product->setOrders($this);
        }

        return $this;
    }

    public function removeProduct(OrdersItem $product): self
    {
        if ($this->products->removeElement($product)) {
            if ($product->getOrder() === $this) {
                $product->setOrders(null);
            }
        }

        return $this;
    }

    public function calculateTotalPrice(): void
    {
        $totalPrice = 0;
        foreach ($this->products as $product) {
            $totalPrice += $product->getPrice();
        }

        $this->totalPrice = $totalPrice;
    }
}