<?php

namespace App\DataTransferObjects;

use App\Enums\TransactionType;
use Carbon\Carbon;

class UpdateTransactionDto
{
    public function __construct(
        public readonly ?int $product_id = null,
        public readonly ?int $user_id = null,
        public readonly ?TransactionType $type = null,
        public readonly ?int $quantity = null,
        public readonly ?Carbon $date = null,
        public readonly ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            product_id: $data['product_id'] ?? null,
            user_id: $data['user_id'] ?? null,
            type: isset($data['type']) ? TransactionType::from($data['type']) : null,
            quantity: isset($data['quantity']) ? (int) $data['quantity'] : null,
            date: isset($data['date']) ? Carbon::parse($data['date']) : null,
            notes: $data['notes'] ?? null,
        );
    }
}
