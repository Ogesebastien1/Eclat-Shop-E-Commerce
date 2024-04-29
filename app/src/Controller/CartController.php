<?php
namespace App\Controller;

use App\Entity\CartItem;
use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class CartController extends AbstractController
{
    private $productRepository;
    private $entityManager;

    public function __construct(ProductRepository $productRepository, EntityManagerInterface $entityManager)
    {
        $this->productRepository = $productRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/api/cart/add/{productId}", name="add_product_to_cart", methods={"POST"})
     */
    public function addProductToCart(int $productId): Response
    {
        $product = $this->productRepository->find($productId);

        if (!$product) {
            return $this->json([
                'message' => 'Product not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'message' => 'You must be logged in to add products to the cart'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $cart = $user->getCart();

        $cartItem = new CartItem();
        $cartItem->setProduct($product);
        $cart->addItem($cartItem);

        $this->entityManager->persist($cartItem);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Product added to cart',
            'product' => $product
        ], Response::HTTP_CREATED);
    }
}
?>