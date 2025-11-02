<?php

namespace App\Services;

use App\DataTransferObjects\CreateProductDto;
use App\DataTransferObjects\ProductData;
use App\DataTransferObjects\ProductDto;
use App\DataTransferObjects\UpdateProductDto;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use function Illuminate\Log\log;

class ProductService
{
    public function getProductsByUser(User $user, array $data = [])
    {
$query = ($user->role === 'admin')
    ? Product::with(['user', 'category'])
    : $user->products()->with('category');

        $query->filter($data);

        return isset($data['page']) ? $query->paginate(10) : $query->get();
    }

    public function createProduct(User $user, CreateProductDto $data): Product
    {
        $imagePath = $this->handleImageUpload($data->image);

        return $user->products()->create([
            'title' => $data->title,
            'description' => $data->description,
            'category_id' => $data->category_id,
            'brand' => $data->brand,
            'price' => $data->price,
            'stock' => $data->stock,
            'image' => $imagePath,
        ]);
    }

    public function updateProduct(Product $product, UpdateProductDto $data): Product
    {
        $imagePath = $product->image; // Default to existing image

        if ($data->image !== null) {
            // If a new image is provided, handle it
            $newImagePath = $this->handleImageUpload($data->image, $product->image);
            if ($newImagePath) {
                $imagePath = $newImagePath;
            }
        }

        $product->update([
            'title' => $data->title ?? $product->title,
            'description' => $data->description ?? $product->description,
            'category_id' => $data->category_id ?? $product->category_id,
            'brand' => $data->brand ?? $product->brand,
            'price' => $data->price ?? $product->price,
            'stock' => $data->stock ?? $product->stock,
            'image' => $imagePath,
        ]);

        return $product;
    }

    public function deleteProduct(Product $product): void
    {
        // Delete associated image if it exists
        if ($product->image && Str::startsWith($product->image, 'products/')) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
    }

    /**
     * Handles base64 image upload and returns the path.
     *
     * @param string|null $base64Image
     * @param string|null $oldImagePath
     * @return string|null
     */
    protected function handleImageUpload(?string $base64Image, ?string $oldImagePath = null): ?string
    {
        if ($base64Image === null) {
            return null;
        }

        // Check if it's a new base64 image
        if (Str::startsWith($base64Image, 'data:image')) {
            // Delete old image if it exists and is a stored file
            if ($oldImagePath && Str::startsWith($oldImagePath, 'products/')) {
                Storage::disk('public')->delete($oldImagePath);
            }

            $extension = explode('/', explode(';', $base64Image)[0])[1];
            $image = str_replace('data:image/' . $extension . ';base64,', '', $base64Image);
            $image = str_replace(' ', '+', $image);
            $imageName = 'products/' . Str::random(40) . '.' . $extension;

            Storage::disk('public')->put($imageName, base64_decode($image));

            return $imageName;
        } elseif (Str::startsWith($base64Image, 'products/')) {
            // If it's an existing image path, return it as is
            return $base64Image;
        }

        // If it's neither a new base64 image nor an existing path, return null or handle as error
        return null;
    }
}
