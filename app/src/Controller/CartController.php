<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Product;

class CartController extends AbstractController
{
    #[Route('/api/cart/add/{productId}', name: 'cart_add', methods: ['POST'])]
    public function addToCart(int $productId, Request $request, EntityManagerInterface $entityManager): Response
    {
        $product = $entityManager->getRepository(Product::class)->find($productId);
        $product->addToCart($productId, 1, $request); // Pass the Request object here

        return new JsonResponse(['status' => 'Product added to cart successfully'], Response::HTTP_OK);
    }

    // route pour supprimer un produit du panier
    #[Route('/api/cart/remove/{productId}', name: 'cart_remove', methods: ['DELETE'])]
    public function removeFromCart(int $productId, EntityManagerInterface $entityManager): Response
    {
        $product = $entityManager->getRepository(Product::class)->find($productId);
        $cart = $this->getUser()->getCart();

        if (!$product || !$cart) {
            return new JsonResponse(['status' => 'Error', 'message' => 'Product or cart not found'], Response::HTTP_NOT_FOUND);
        }

        $product->removeFromCart($cart);

        $entityManager->flush();

        return new JsonResponse(['status' => 'Product removed from cart successfully'], Response::HTTP_OK);
    }
}
