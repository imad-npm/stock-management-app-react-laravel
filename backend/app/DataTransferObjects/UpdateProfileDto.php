<?php

namespace App\DataTransferObjects;

use App\Http\Requests\UpdateProfileRequest;

class UpdateProfileDto
{
    public function __construct(
        public readonly ?string $name,
        public readonly ?string $email,
    ) {
    }

    public static function fromRequest(UpdateProfileRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            email: $request->validated('email'),
        );
    }
}
