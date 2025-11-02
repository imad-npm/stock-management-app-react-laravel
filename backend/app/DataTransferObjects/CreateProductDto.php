<?php

namespace App\DataTransferObjects;

class CreateProductDto
{
    public function __construct(
        public readonly int $user_id,
        public readonly string $title,
        public readonly float $price,
        public readonly int $stock,
        public readonly ?string $description,
        public readonly ?int $category_id,
        public readonly ?string $brand,
        public readonly ?string $image,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            user_id: $data['user_id'],
            title: $data['title'],
            price: (float) $data['price'],
            stock: (int) $data['stock'],
            description: $data['description'] ?? null,
            category_id: $data['category_id'] ?? null,
            brand: $data['brand'] ?? null,
            image: $data['image'] ?? null,
        );
    }
}
