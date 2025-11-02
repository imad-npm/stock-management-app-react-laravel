<?php

namespace App\Http\Requests;

use App\DataTransferObjects\CreateProductDto;
use App\DataTransferObjects\ProductDto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check(); // Only authenticated users can create products
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => ['nullable', 'integer', 'exists:categories,id', function ($attribute, $value, $fail) {
                if ($value && !Auth::user()->categories()->where('id', $value)->exists()) {
                    $fail('The selected category is invalid or does not belong to the authenticated user.');
                }
            }],
            'brand' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|string', // Expecting base64 string from frontend
        ];
    }

    public function toDto(): CreateProductDto
    {
        return CreateProductDto::fromArray($this->validated() + ['user_id' => Auth::id()]);
    }
}