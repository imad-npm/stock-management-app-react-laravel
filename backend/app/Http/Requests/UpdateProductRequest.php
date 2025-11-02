<?php

namespace App\Http\Requests;

use App\DataTransferObjects\ProductDto;
use App\DataTransferObjects\UpdateProductDto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Authorization will be handled by ProductPolicy later
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => ['nullable', 'integer', 'exists:categories,id', function ($attribute, $value, $fail) {
                if ($value && !Auth::user()->categories()->where('id', $value)->exists()) {
                    $fail('The selected category is invalid or does not belong to the authenticated user.');
                }
            }],
            'brand' => 'nullable|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|string', // Expecting base64 string from frontend
        ];
    }

    public function toDto(): UpdateProductDto
    {
        return UpdateProductDto::fromArray($this->validated());
    }
}