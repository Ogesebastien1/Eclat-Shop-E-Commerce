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
use Psr\Log\LoggerInterface;
use Firebase\JWT\JWT;
use App\Repository\UserRepository;
use Firebase\JWT\Key;


class CartController extends AbstractController
{
    #[Route('/api/carts/validate', name: 'cart_checkout', methods: ['POST'])]
    public function checkoutCart(Request $request, EntityManagerInterface $entityManager, ProductRepository $productRepository, UserRepository $userRepository): Response
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

        // Get the JWT from the request
        $jwt = str_replace('Bearer ', '', $request->headers->get('Authorization'));

        // Define the decoding key and the allowed algorithms
        $publicKey = file_get_contents(__DIR__ . '/../../config/jwt/public.pem');

        // Decode the JWT
        $decodedJwt = JWT::decode($jwt, new Key($publicKey, 'RS256'));

        // Get the current user
        $user = $userRepository->findOneByEmail($decodedJwt->username);

        $orders->setUser($user);

        $entityManager->persist($orders);
        $entityManager->flush();

        $response = $this->json(['message' => 'Order created successfully', 'ordersId' => $orders->getUuid()]);
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

    #[Route('/api/carts/remove/{id}', name: 'cart_remove', methods: ['DELETE'])]
    public function removeFromCart(int $id, ProductRepository $productRepository, Request $request): Response
    {
        $cart = json_decode($request->cookies->get('cart', '{}'), true);
        $product = $productRepository->findProductById($id);
        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        $productId = $product->getId();
        if (!isset($cart[$productId])) {
            return $this->json(['message' => 'Product not found in cart'], 404);
        }
        
        $cart[$productId]['quantity']--;
        if ($cart[$productId]['quantity'] <= 0) {
            unset($cart[$productId]);
        }
        
        $response = $this->json(['message' => 'Product removed from cart successfully']);
        $cookie = Cookie::create('cart', json_encode($cart), time() + 3600, '/', null, false, false);
        $response->headers->setCookie($cookie);
        return $response;
    }

    #[Route('/api/carts/purge/{id}', name: 'cart_delete', methods: ['DELETE'])]
    public function deleteFromCart(int $id, ProductRepository $productRepository, Request $request): Response
    {
        $cart = json_decode($request->cookies->get('cart', '{}'), true);
        $product = $productRepository->findProductById($id);
        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        $productId = $product->getId();
        if (!isset($cart[$productId])) {
            return $this->json(['message' => 'Product not found in cart'], 404);
        }
        
        unset($cart[$productId]);
        
        $response = $this->json(['message' => 'Product deleted from cart successfully']);
        $cookie = Cookie::create('cart', json_encode($cart), time() + 3600, '/', null, false, false);
        $response->headers->setCookie($cookie);
        return $response;
    }


    #[Route('/api/carts', name: 'cart_show')]
    public function showCart(Request $request, ProductRepository $productRepository): Response
    {
        $cart = json_decode($request->cookies->get('cart', '{}'), true);
        $cartData = array_map(function ($item) use ($productRepository) {
            $product = $productRepository->findProductById($item['product']);
            if ($product) {
                return [
                    'product_id' => $product->getId(),
                    'name' => $product->getName(),
                    'quantity' => $item['quantity'],
                    'price' => $product->getPrice(),
                ];
            }
        }, $cart);

        $cartData = array_filter($cartData);

        $total = array_reduce($cartData, function ($carry, $item) {
            return $carry + ($item['quantity'] * $item['price']);
        }, 0);

        return $this->json([
            'cart' => $cartData,
            'total' => $total
        ]);
    }
}