<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\OrdersRepository;
use Psr\Log\LoggerInterface;

class OrdersController extends AbstractController
{
    #[Route('/api/orders/{uuid}', name: 'order_show', methods: ['GET'])]
    public function showOrder(string $uuid, OrdersRepository $ordersRepository, LoggerInterface $logger): JsonResponse
    {
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
                // Add other user fields as needed
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
    }
}
?>