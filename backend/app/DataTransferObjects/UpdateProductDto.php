<?php

namespace App\DataTransferObjects;

class UpdateProductDto
{
    public function __construct(
        public readonly ?int $user_id,
        public readonly ?string $title,
        public readonly ?float $price,
        public readonly ?int $stock,
        public readonly ?string $description,
        public readonly ?int $category_id,
        public readonly ?string $brand,
        public readonly ?string $image,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            user_id: $data['user_id'] ?? null,
            title: $data['title'] ?? null,
            price: isset($data['price']) ? (float) $data['price'] : null,
            stock: isset($data['stock']) ? (int) $data['stock'] : null,
            description: $data['description'] ?? null,
            category_id: $data['category_id'] ?? null,
            brand: $data['brand'] ?? null,
            image: $data['image'] ?? null,
        );
    }
}
