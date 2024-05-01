<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends AbstractController
{
    #[Route('/api/payment/create-checkout-session', name: 'create_checkout_session', methods: ['POST'])]
    public function createCheckoutSession(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

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
            'success_url' => 'http://localhost:3010/payment-success',
            'cancel_url' => 'http://localhost:3010/payment-cancel',
        ]);

        return $this->json(['id' => $session->id]);
    }
}
?>