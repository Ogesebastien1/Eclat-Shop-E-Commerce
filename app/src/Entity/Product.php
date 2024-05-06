<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: "text")]
    private ?string $description = null;

    #[ORM\Column(type: "string", length: 255)]
    private ?string $photo = null;

    #[ORM\Column(type: "decimal", precision: 10, scale: 2)]
    private ?float $price = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(string $photo): self
    {
        $this->photo = $photo;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function addToCart(int $productId, int $quantity = 1, \Symfony\Component\HttpFoundation\Request $request): void
    {
        $product = $entityManager->getRepository(Product::class)->find($productId);
        $cart = $request->getSession()->get('cart', []);
        $cart[] = ['product' => $product, 'quantity' => $quantity];
        $request->getSession()->set('cart', $cart);
    }


    public function removeFromCart(Cart $cart): void
    {
        foreach ($cart->getItems() as $item) {
            if ($item->getProduct() === $this) {
                $cart->removeItem($item);
                return;
            }
        }
    }
}