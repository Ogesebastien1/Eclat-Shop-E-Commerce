<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CartRepository")
 */
class Cart
{
    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CartItem", mappedBy="cart", orphanRemoval=true)
     */
    private $items;

    public function __construct()
    {
        $this->items = new ArrayCollection();
    }

    public function getItems(): Collection
    {
        return $this->items;
    }

    public function addItem(CartItem $item): self
    {
        if (!$this->items->contains($item)) {
            $this->items[] = $item;
            $item->setCart($this);
        }

        return $this;
    }

    public function removeItem(CartItem $item): self
    {
        if ($this->items->contains($item)) {
            $this->items->removeElement($item);
            
            if ($item->getCart() === $this) {
                $item->setCart(null);
            }
        }

        return $this;
    }

    public function getTotal(): float
    {
        $total = 0;
        foreach ($this->items as $item) {
            $total += $item->getProduct()->getPrice();
        }

        return $total;
    }
}