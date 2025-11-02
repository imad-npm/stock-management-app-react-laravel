<?php

namespace App\DataTransferObjects;

use App\Enums\TransactionType;
use Carbon\Carbon;

class CreateTransactionDto
{
    public function __construct(
        public readonly int $product_id,
        public readonly int $user_id,
        public readonly TransactionType $type,
        public readonly int $quantity,
        public readonly Carbon $date,
        public readonly ?string $notes,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            product_id: $data['product_id'],
            user_id: $data['user_id'],
            type: TransactionType::from($data['type']),
            quantity: (int) $data['quantity'],
            date: Carbon::parse($data['date']),
            notes: $data['notes'] ?? null,
        );
    }
}
