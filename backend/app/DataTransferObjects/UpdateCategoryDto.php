<?php

namespace App\DataTransferObjects;

use App\Http\Requests\UpdateCategoryRequest;

class UpdateCategoryDto
{
    public function __construct(
        public readonly string $name,
    ) {
    }

    public static function fromRequest(UpdateCategoryRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
        );
    }
}
