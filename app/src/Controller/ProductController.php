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
use Psr\Log\LoggerInterface;

use function PHPUnit\Framework\isEmpty;

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
                'photo' => $product->getPhoto(),
                'stock' => $product->getStock(),
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
    public function add(Request $request, EntityManagerInterface $entityManager, LoggerInterface $logger): Response
    {
        $name = $request->request->get('name');
        $description = $request->request->get('description');
        $logger->info('description', ['description' => $description]);
        $price = $request->request->get('price');
        $logger->info('price', ['price' => $price]);
        /** @var UploadedFile $image */
        $image = $request->files->get('photo');
        $logger->info('Image', ['image' => $image->getPath()]);
        $stock = $request->request->get('stock');
        $logger->info('stock', ['stock' => $stock]);

        if (!$name || !$description || !$price || !$image || !$stock) {
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

        $stock = $stock !== null ? $stock : 0; // If stock is null, set it to 0

        $product = new Product();
        $product->setName($name);
        $product->setDescription($description);
        $product->setPrice($price);
        $product->setPhoto($result['ObjectURL']); // Store the S3 URL of the image
        $product->setStock($stock);

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
    #[Route('/api/products/{id}', name: 'product_update', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $entityManager, Product $product, LoggerInterface $logger): Response
    {
        $data = json_decode($request->getContent(), true);
        $logger->info('Updating product', ['id' => $product->getId()]);

        if (isset($data['name'])) {
            $product->setName($data['name']);
            $logger->info('Updated name', ['name' => $product->getName()]);
        }
        if (isset($data['description'])) {
            $product->setDescription($data['description']);
            $logger->info('Updated description', ['description' => $product->getDescription()]);
        }
        if (isset($data['price'])) {
            $product->setPrice($data['price']);
            $logger->info('Updated price', ['price' => $product->getPrice()]);
        }
        if (isset($data['stock'])) {
            $product->setStock($data['stock']);
            $logger->info('Updated stock', ['stock' => $product->getStock()]);
        }

        if (isset($data['photo'])) {
            $logger->info('Received new image');

            // Delete the old image from S3
            $oldImageKey = basename($product->getPhoto());
            $s3Client = new S3Client([
                'version' => 'latest',
                'region'  => $_SERVER['AWS_REGION'],
                'credentials' => [
                    'key'    => $_SERVER['ACCESS_KEY_ID'],
                    'secret' => $_SERVER['SECRET_ACCESS_KEY'],
                ],
            ]);
            $s3Client->deleteObject([
                'Bucket' => $_SERVER['AWS_BUCKET'],
                'Key' => $oldImageKey,
            ]);

            $logger->info('Deleted old image from S3', ['key' => $oldImageKey]);

            // Decode the Base64 image
            $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['photo']));
            $imageName = uniqid() . '.png'; // Generate a unique name for the image
            file_put_contents($imageName, $imageData);

            // Upload the new image to S3
            $result = $s3Client->putObject([
                'Bucket' => $_SERVER['AWS_BUCKET'],
                'Key' => $imageName,
                'Body' => fopen($imageName, 'rb'),
                'ACL' => 'public-read', // Make the image publicly accessible
                'ContentType' => 'image/png', // Set the content type to image/png
            ]);

            $logger->info('Uploaded new image to S3', ['result' => $result]);

            $product->setPhoto($result['ObjectURL']); // Store the S3 URL of the new image

            // Delete the temporary image file
            unlink($imageName);
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }
}