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
use Aws\S3\S3Client;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ProductController extends AbstractController
{

    // This method handles GET requests to /api/product/{id} and returns the product with the specified ID
    // test done !
    #[Route('/api/products/{id}', name: 'product_get', methods: ['GET'])]
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

    // This method handles GET requests to /api/product and returns all products

    #[Route('/api/products', name: 'product_list', methods: ['GET'])]
    public function list(ProductRepository $productRepository): Response
    {
        $products = $productRepository->findAll();

        $data = [];
        foreach ($products as $product) {
            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'photo' => $product->getPhoto()
            ];
        }

        return new JsonResponse([
            'status' => 'Success',
            'products' => $data
        ], Response::HTTP_OK);
    }

    // This method handles POST requests to /api/product and creates a new product 
    // test done !
    #[Route('/api/products', name: 'product_add', methods: ['POST'])]
    public function add(Request $request, EntityManagerInterface $entityManager): Response
    {
        $name = $request->request->get('name');
        $description = $request->request->get('description');
        $price = $request->request->get('price');
        /** @var UploadedFile $image */
        $image = $request->files->get('photo');

        if (!$name || !$description || !$price || !$image) {
            return new JsonResponse(['status' => 'Error', 'message' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        $s3Client = new S3Client([
            'version' => 'latest',
            'region'  => $_SERVER['AWS_REGION'],
            'credentials' => [
                'key'    => $_SERVER['ACCESS_KEY_ID'],
                'secret' => $_SERVER['SECRET_ACCESS_KEY'],
            ],
        ]);

        // Upload the image to S3
        try {
            $result = $s3Client->putObject([
                'Bucket' => $_SERVER['AWS_BUCKET'],
                'Key' => $image->getClientOriginalName(),
                'Body' => fopen($image->getPathname(), 'rb'),
                'ACL' => 'public-read', // Make the image publicly accessible
                'ContentType' => $image->getMimeType(), // Add this line
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'Error', 'message' => 'Failed to upload image to S3, the error is ' . $e], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $product = new Product();
        $product->setName($name);
        $product->setDescription($description);
        $product->setPrice($price);
        $product->setPhoto($result['ObjectURL']); // Store the S3 URL of the image

        $entityManager->persist($product);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Product created successfully'], Response::HTTP_CREATED);
    }

    // This method handles DELETE requests to /api/product/{id} and deletes the product with the given id
    #[Route('/api/products/{id}', name: 'product_delete', methods: ['DELETE'])]
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
    #[Route('/api/products/{id}', name: 'product_update', methods: ['PUT'])]
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
}