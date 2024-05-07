<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Entity\Payment;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;


class PaymentController extends AbstractController
{
    #[Route('/api/payment/create-checkout-session', name: 'create_checkout_session', methods: ['POST'])]
    public function createCheckoutSession(Request $request, LoggerInterface $logger): Response
    {
        $data = json_decode($request->getContent(), true);

        $logger->info('Creating a checkout session with the following data: ' . json_encode($data));

        $lineItems = array_map(function($item) {
            return [
                'price_data' => [
                    'currency' => $item['currency'],
                    'product_data' => [
                        'name' => $item['productName'],
                    ],
                    'unit_amount' => $item['unitAmount'],
                ],
                'quantity' => $item['quantity'],
            ];
        }, $data['items']);

        // Set the Stripe API key
        $stripeSecretKey = $this->getParameter('STRIPE_SECRET_KEY');
        Stripe::setApiKey($stripeSecretKey);

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => 'http://localhost:3010/success',
            'cancel_url' => 'http://localhost:3010/shop',
        ]);

        return $this->json(['id' => $session->id]);
    }

    #[Route('/api/payment', name: 'create_payment', methods: ['POST'])]
    public function createPayment(Request $request, EntityManagerInterface $em): Response
    {
        $data = json_decode($request->getContent(), true);

        $payment = new Payment();
        $payment->setProductList($data['productList']);
        $payment->setProductPrices($data['productPrices']);

        // Generate a unique command ID
        $commandId = uniqid('cmd_', true);
        $payment->setCommandId($commandId);

        $em->persist($payment);
        $em->flush();

        // Return the command ID along with the payment ID
        return $this->json(['id' => $payment->getId(), 'commandId' => $commandId]);
    }

    #[Route('/api/payment/{id}', name: 'get_payment', methods: ['GET'])]
    public function getPaymentById(Payment $payment): Response
    {
        return $this->json($payment);
    }

    #[Route('/api/payment/{id}', name: 'update_payment', methods: ['PUT'])]
    public function updatePaymentById(Request $request, Payment $payment, EntityManagerInterface $em): Response
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['deliveryPrice'])) {
            $payment->setDeliveryPrice($data['deliveryPrice']);
        }

        if (isset($data['productList'])) {
            $payment->setProductList($data['productList']);
        }

        if (isset($data['productPrices'])) {
            $payment->setProductPrices($data['productPrices']);
        }

        if (isset($data['commandId'])) {
            $payment->setCommandId($data['commandId']);
        }

        $em->flush();

        return $this->json(['id' => $payment->getId()]);
    }

    #[Route('/api/payment/{commandId}', name: 'get_payment', methods: ['GET'])]
    public function getPaymentByCommandId(string $commandId, EntityManagerInterface $em): Response
    {
        $payment = $em->getRepository(Payment::class)->findOneBy(['commandId' => $commandId]);

        if (!$payment) {
            throw $this->createNotFoundException('No payment found for command ID '.$commandId);
        }

        return $this->json($payment);
    }

    #[Route('/api/payment/{commandId}', name: 'update_payment', methods: ['PUT'])]
    public function updatePaymentByCommandId(string $commandId, Request $request, EntityManagerInterface $em): Response
    {
        $payment = $em->getRepository(Payment::class)->findOneBy(['commandId' => $commandId]);

        if (!$payment) {
            throw $this->createNotFoundException('No payment found for command ID '.$commandId);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['deliveryPrice'])) {
            $payment->setDeliveryPrice($data['deliveryPrice']);
        }

        if (isset($data['productList'])) {
            $payment->setProductList($data['productList']);
        }

        if (isset($data['productPrices'])) {
            $payment->setProductPrices($data['productPrices']);
        }

        if (isset($data['commandId'])) {
            $payment->setCommandId($data['commandId']);
        }

        $em->flush();

        return $this->json(['id' => $payment->getId()]);
    }
}
?>