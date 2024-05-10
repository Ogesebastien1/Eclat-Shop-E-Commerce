<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Orders;
use App\Entity\OrdersItem;
use Symfony\Component\HttpFoundation\Cookie;

class CartController extends AbstractController
{
    #[Route('/api/carts/validate', name: 'cart_checkout', methods: ['POST'])]
    public function checkoutCart(Request $request, EntityManagerInterface $entityManager, ProductRepository $productRepository): Response
    {
        $cart = json_decode($request->cookies->get('cart', '{}'), true);
        if (empty($cart)) {
            return $this->json(['message' => 'Cart is empty'], Response::HTTP_BAD_REQUEST);
        }

        $orders = new Orders();
        $totalPrice = 0;
        foreach ($cart as $productId => $item) {
            $product = $productRepository->findProductById($productId);
            if (!$product) {
                continue;
            }

            $ordersItem = new OrdersItem();
            $ordersItem->setProduct($product);
            $ordersItem->setQuantity($item['quantity']);
            $ordersItem->setOrders($orders);

            $orders->addItems($ordersItem);

            $entityManager->persist($ordersItem);

            $totalPrice += $product->getPrice() * $item['quantity'];
        }
        $orders->setUuid(uniqid());
        $orders->setTotalPrice($totalPrice);

        $user = $this->getUser();
        $orders->setUser($user);

        $entityManager->persist($orders);
        $entityManager->flush();

        $response = $this->json(['message' => 'Order created successfully', 'ordersId' => $orders->getId()]);
        $response->headers->clearCookie('cart');
        return $response;
    }

    #[Route('/api/carts/{id}', name: 'cart_add')]
    public function addToCart(int $id, ProductRepository $productRepository, Request $request): Response
    {
        $cart = json_decode($request->cookies->get('cart', '{}'), true);

        $product = $productRepository->findProductById($id);
        if (!$product) {
            return $this->redirectToRoute('product_list');
        }

        $productId = $product->getId();
        if (!isset($cart[$productId])) {
            $cart[$productId] = ['product' => $productId, 'quantity' => 0];
        }
        $cart[$productId]['quantity']++;

        $response = $this->json(['message' => 'Product added to cart successfully']);
        $cookie = Cookie::create('cart', json_encode($cart), time() + 3600, '/', null, false, false);
        $response->headers->setCookie($cookie);
        return $response;
    }

    #[Route('/api/carts/{id}', name: 'cart_remove', methods: ['DELETE'])]
    public function removeFromCart(int $id, Request $request): Response
    {
        $cart = json_decode($request->cookies->get('cart', '{}'), true);

        if (isset($cart[$id])) {
            unset($cart[$id]);
        }

        $response = $this->json(['message' => 'Product removed from cart successfully']);
        $response->headers->setCookie(new Cookie('cart', json_encode($cart), time() + 3600));
        return $response;
    }

    #[Route('/api/carts', name: 'cart_show')]
    public function showCart(Request $request, ProductRepository $productRepository): Response
    {
        $cart = json_decode($request->cookies->get('cart', '{}'), true);
        $cartData = array_map(function ($item) use ($productRepository) {
            $product = $productRepository->findProductById($item['product']);
            return [
                'product_id' => $product->getId(),
                'name' => $product->getName(),
                'quantity' => $item['quantity'],
                'price' => $product->getPrice(),
            ];
        }, $cart);

        $total = array_reduce($cartData, function ($carry, $item) {
            return $carry + ($item['quantity'] * $item['price']);
        }, 0);

        return $this->json([
            'cart' => $cartData,
            'total' => $total
        ]);
    }
}