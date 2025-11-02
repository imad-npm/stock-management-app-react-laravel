<?php

namespace App\DataTransferObjects;

use App\Http\Requests\StoreCategoryRequest;

class CreateCategoryDto
{
    public function __construct(
        public readonly string $name,
    ) {
    }

    public static function fromRequest(StoreCategoryRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
        );
    }
}
