<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\PaymentRepository;


#[ORM\Entity(repositoryClass: PaymentRepository::class)]
class Payment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "float", nullable: true)]
    private ?float $deliveryPrice = null;

    #[ORM\Column(type: "json")]
    private ?array $productList = null;

    #[ORM\Column(type: "json")]
    private ?array $productPrices = null;

    #[ORM\Column(type: "string", length: 255, unique: true)]
    private ?string $commandId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDeliveryPrice(): ?float
    {
        return $this->deliveryPrice;
    }

    public function setDeliveryPrice(float $deliveryPrice): self
    {
        $this->deliveryPrice = $deliveryPrice;

        return $this;
    }

    public function getProductList(): ?array
    {
        return $this->productList;
    }

    public function setProductList(array $productList): self
    {
        $this->productList = $productList;

        return $this;
    }

    public function getProductPrices(): ?array
    {
        return $this->productPrices;
    }

    public function setProductPrices(array $productPrices): self
    {
        $this->productPrices = $productPrices;

        return $this;
    }

    public function getCommandId(): ?string
    {
        return $this->commandId;
    }

    public function setCommandId(string $commandId): self
    {
        $this->commandId = $commandId;

        return $this;
    }
}