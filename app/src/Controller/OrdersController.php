<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\OrdersRepository;
use Psr\Log\LoggerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;

class OrdersController extends AbstractController
{
    #[Route('/api/orders/{uuid}', name: 'order_show', methods: ['GET'])]
    public function showOrder(string $uuid, OrdersRepository $ordersRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            // Utilisation de la méthode personnalisée findOneByUuid
            $order = $ordersRepository->findOrdersByUuid($uuid);
            $logger->info("Order with UUID $uuid found.");

            if (!$order) {
                $logger->info("Order with UUID $uuid not found.");
                return new JsonResponse(['message' => 'Order not found'], Response::HTTP_NOT_FOUND);
            }

            $user = $order->getUser();

            $data = [
                'id' => $order->getId(),
                'totalPrice' => $order->getTotalPrice(),
                'creationDate' => $order->getCreationDate()->format('Y-m-d H:i'),
                'uuid' => $order->getUuid(),
                'user' => [
                    'id' => $user->getId(),
                    'username' => $user->getLogin(),
                    'email' => $user->getEmail(),
                ],
                "item" => $order -> getItems() -> map(function($item){
                    return [
                        'id' => $item -> getId(),
                        'product' => $item -> getProduct() -> getName(),
                        'quantity' => $item -> getQuantity(),
                        'description' => $item -> getProduct() -> getDescription(),
                        'photo' => $item -> getProduct() -> getPhoto(),
                        'price' => $item -> getProduct() -> getPrice()
                    ];
                }) -> toArray()
            ];

            return new JsonResponse($data, Response::HTTP_OK);
        } catch (\Exception $e) {
            $logger->error('Failed to fetch order', ['exception' => $e]);
            return new JsonResponse(['status' => 'Error', 'message' => 'Failed to fetch order'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/orders/', name: 'user_orders', methods: ['GET'])]
    public function showUserOrders(UserRepository $userRepository, OrdersRepository $ordersRepository, LoggerInterface $logger, Request $request): JsonResponse
    {
        try {
            // Get the JWT from the request
            $jwt = $request->headers->get('Authorization');

            // Define the decoding key and the allowed algorithms
            $publicKey = file_get_contents(__DIR__ . '/../../config/jwt/public.pem');

            // Decode the JWT
            $decodedJwt = JWT::decode($jwt, new Key($publicKey, 'RS256'));

            // Get the current user
            $user = $userRepository->findOneByEmail($decodedJwt->username);

            if (!$user) {
                $logger->info("No user found with email {$decodedJwt->username}.");
                return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            $orders = $ordersRepository->findByUser($user->getId());

            if (!$orders) {
                $logger->info("No orders found for user with ID {$user->getId()}.");
                return new JsonResponse(['message' => 'No orders found'], Response::HTTP_NOT_FOUND);
            }

            $data = array_map(function($order) {
                $user = $order->getUser();
                return [
                    'id' => $order->getId(),
                    'totalPrice' => $order->getTotalPrice(),
                    'creationDate' => $order->getCreationDate()->format('Y-m-d H:i'),
                    'uuid' => $order->getUuid(),
                    'user' => [
                        'id' => $user->getId(),
                        'username' => $user->getUsername(),
                        'email' => $user->getEmail(),
                    ],
                    "item" => $order -> getItems() -> map(function($item){
                        return [
                            'id' => $item -> getId(),
                            'product' => $item -> getProduct() -> getName(),
                            'quantity' => $item -> getQuantity(),
                            'description' => $item -> getProduct() -> getDescription(),
                            'photo' => $item -> getProduct() -> getPhoto(),
                            'price' => $item -> getProduct() -> getPrice()
                        ];
                    }) -> toArray()
                ];
            }, $orders);

            return new JsonResponse($data, Response::HTTP_OK);
        } catch (\Exception $e) {
            $logger->error('Failed to fetch user orders', ['exception' => $e]);
            return new JsonResponse(['status' => 'Error', 'message' => 'Failed to fetch user orders'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
?>