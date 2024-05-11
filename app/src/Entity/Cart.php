<?php
namespace App\Entity;

class Cart
{
    private $items = [];

    public function addProduct(Product $product, int $quantity = 1): void
    {
        $productId = $product->getId();
        if (!isset($this->items[$productId])) {
            $this->items[$productId] = ['product' => $product, 'quantity' => 0];
        }
        $this->items[$productId]['quantity'] += $quantity;
    }

    public function removeProduct(Product $product): void
    {
        $productId = $product->getId();
        if (isset($this->items[$productId])) {
            unset($this->items[$productId]);
        }
    }

    public function getItems(): array
    {
        return $this->items;
    }
}