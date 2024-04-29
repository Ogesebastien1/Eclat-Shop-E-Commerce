<?php

namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Product;
use App\Repository\ProductRepository;

class ProductController extends AbstractController
{

    // This method handles GET requests to /api/product/{id} and returns the product with the specified ID
    // test done !
    #[Route('/api/product/{id}', name: 'product_get', methods: ['GET'])]
    public function get(int $id, ProductRepository $productRepository): Response
    {
        $product = $productRepository->findProductById($id);

        if (!$product) {
            return new JsonResponse(['status' => 'Error', 'message' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'status' => 'Success',
            'product' => [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'photo' => $product->getPhoto()
            ]
        ], Response::HTTP_OK);
    }

    // This method handles POST requests to /api/product and creates a new product 
    // test done !
    #[Route('/api/product', name: 'product_add', methods: ['POST'])]
    public function add(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null || !isset($data['name']) || !isset($data['description']) || !isset($data['price']) || !isset($data['photo'])) {
            return new JsonResponse(['status' => 'Error', 'message' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        $product = new Product();
        $product->setName($data['name']);
        $product->setDescription($data['description']);
        $product->setPrice($data['price']);
        $product->setPhoto($data['photo']);

        $entityManager->persist($product);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Product created successfully'], Response::HTTP_CREATED);
    }

    // This method handles DELETE requests to /api/product/{id} and deletes the product with the given id
    #[Route('/api/product/{id}', name: 'product_delete', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, Product $product): Response
    {
        $entityManager->remove($product);
        $entityManager->flush();

        return $this->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    // This method handles PUT requests to /api/product/{id} and updates the product with the given id
    // test done !
    #[Route('/api/product/{id}', name: 'product_update', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $entityManager, Product $product): Response
    {
        $product->setName($request->request->get('name', $product->getName()));
        $product->setDescription($request->request->get('description', $product->getDescription()));
        $product->setPrice($request->request->get('price', $product->getPrice()));

        $entityManager->flush();

        return $this->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    // #[Route('/api/carts/{productId}', name: 'add_product_to_cart', methods: ['POST'])]
    // public function addProductToCart(int $productId, EntityManagerInterface $entityManager, UserRepository $userRepository, ProductRepository $productRepository): Response
    // {
    //     // Get the authenticated user
    //     $user = $this->getUser();

    //     // Find the product by id
    //     $product = $productRepository->find($productId);

    //     if (!$product) {
    //         return new JsonResponse(['message' => 'Product not found'], 404);
    //     }

    //     // Add the product to the user's cart
    //     $user->addProductToCart($product);

    //     // Save changes to the database
    //     $entityManager->persist($user);
    //     $entityManager->flush();

    //     return new JsonResponse(['message' => 'Product added to cart successfully']);
    // }


    // #[Route('/api/carts/{productId}', name: 'remove_product_from_cart', methods: ['DELETE'])]
    // public function removeProductFromCart(int $productId, EntityManagerInterface $entityManager, UserRepository $userRepository, ProductRepository $productRepository): Response
    // {
    //     // Get the authenticated user
    //     $user = $this->getUser();

    //     // Find the product by id
    //     $product = $productRepository->find($productId);

    //     if (!$product) {
    //         return new JsonResponse(['message' => 'Product not found'], 404);
    //     }

    //     // Remove the product from the user's cart
    //     $user->removeProductFromCart($product);

    //     // Save changes to the database
    //     $entityManager->persist($user);
    //     $entityManager->flush();

    //     return new JsonResponse(['message' => 'Product removed from cart successfully']);
    // }


    
    // #[Route('/api/carts', name: 'get_cart', methods: ['GET'])]
    // public function getCart(): Response
    // {
    //     // Get the authenticated user
    //     $user = $this->getUser();

    //     // Get the products in the user's cart
    //     $cart = $user->getCart();

    //     // Convert the cart to an array of product data
    //     $cartData = array_map(function ($product) {
    //         return [
    //             'id' => $product->getId(),
    //             'name' => $product->getName(),
    //             'description' => $product->getDescription(),
    //             'price' => $product->getPrice(),
    //         ];
    //     }, $cart);

    //     return new JsonResponse($cartData);
    // }

    // // Validation of the cart: This method will convert the authenticated user's shopping cart to an order.
    // #[Route('/api/carts/validate', name: 'validate_cart', methods: ['POST'])]
    // public function validateCart(EntityManagerInterface $entityManager): Response
    // {
    //     // Get the authenticated user
    //     $user = $this->getUser();

    //     // Create a new order from the user's cart
    //     $order = new Order();
    //     foreach ($user->getCart() as $product) {
    //         $order->addProduct($product);
    //     }

    //     // Clear the user's cart
    //     $user->clearCart();

    //     // Save the order and the updated user to the database
    //     $entityManager->persist($order);
    //     $entityManager->persist($user);
    //     $entityManager->flush();

    //     return new JsonResponse(['message' => 'Cart validated successfully', 'order_id' => $order->getId()]);
    // }

}