<?php

namespace App\DataTransferObjects;

class UpdateUserDto
{
    public function __construct(
        public readonly ?string $name,
        public readonly ?string $email,
        public readonly ?string $password,
        public readonly ?string $role,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'] ?? null,
            email: $data['email'] ?? null,
            password: $data['password'] ?? null,
            role: $data['role'] ?? null,
        );
    }
}
