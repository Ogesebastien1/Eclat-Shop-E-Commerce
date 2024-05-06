<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Orders;
use App\Entity\OrdersItem;


class CartController extends AbstractController
{

    #[Route('/api/carts/validate', name: 'cart_checkout', methods: ['POST'])]
    public function checkoutCart(Request $request, EntityManagerInterface $entityManager, ProductRepository $productRepository): Response
    {
        $cart = $request->getSession()->get('cart', []);
        if (empty($cart)) {
            return $this->json(['message' => 'Cart is empty'], Response::HTTP_BAD_REQUEST);
        }

        $orders = new Orders();
        $totalPrice = 0;
        $productId=0;
        foreach ($cart as $productId => $item) {
            $product = $productRepository->findProductById($productId);
            if (!$product) {
                continue;
            }

            $ordersItem = new OrdersItem();
            $ordersItem->setProduct($product);
            $ordersItem->setQuantity($item['quantity']);
            $ordersItem->setOrders($orders);

            $orders->addProduct($ordersItem);

            $entityManager->persist($ordersItem);

            $totalPrice += $product->getPrice() * $item['quantity'];
        }

        $orders->setTotalPrice($totalPrice);
        $entityManager->persist($orders);
        $entityManager->flush();

        $request->getSession()->set('cart', []);

        return $this->json(['message' => 'Order created successfully', 'ordersId' => $orders->getId()]);
    }

    #[Route('/api/carts/{id<\d+>}', name: 'cart_add')]
    public function addToCart(int $id, ProductRepository $productRepository, Request $request): Response
    {
        $session = $request->getSession();
        $cart = $session->get('cart', []);

        /** @var Product $product */
        $product = $productRepository->find($id);

        if (!$product) {
            return $this->redirectToRoute('product_list');
        }

        $productId = $product->getId();
        if (!isset($cart[$productId])) {
            $cart[$productId] = ['product' => $product, 'quantity' => 0];
        }
        $cart[$productId]['quantity']++;

        $session->set('cart', $cart);

        return $this->json(['message' => 'Product added to cart successfully']);
    }

    #[Route('/api/carts/{id}', name: 'cart_remove' , methods: ['DELETE'])]
    public function removeFromCart(int $id, Request $request): Response
    {
        $session = $request->getSession();
        $cart = $session->get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
        }

        $session->set('cart', $cart);

        return $this->json(['message' => 'Product removed to cart successfully']);
    }

    #[Route('/api/carts', name: 'cart_show')]
    public function showCart(Request $request): Response
    {
        $cart = $request->getSession()->get('cart', []);
        $cartData = array_map(function ($item) {
            return [
                'product_id' => $item['product']->getId(),
                'name' => $item['product']->getName(),
                'quantity' => $item['quantity'],
                'price' => $item['product']->getPrice(),
            ];
        }, $cart);

        return $this->json([
            'cart' => $cartData,
            'total' => array_reduce($cart, function ($carry, $item) {
                return $carry + ($item['quantity'] * $item['product']->getPrice());
            }, 0)
        ]);
    }
}