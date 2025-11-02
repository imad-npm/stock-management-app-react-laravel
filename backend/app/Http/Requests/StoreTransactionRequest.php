<?php

namespace App\Http\Requests;

use App\DataTransferObjects\CreateTransactionDto;
use App\DataTransferObjects\TransactionData;
use App\DataTransferObjects\TransactionDto;
use App\Enums\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        // Ensure the product belongs to the authenticated user
        $product = Product::find($this->product_id);
        return $product && $product->user_id === Auth::id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:ENTRY,EXIT',
            'quantity' => 'required|integer|min:1',
            'date' => 'required|date',
            'notes' => 'nullable|string',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->type === 'EXIT') {
                $product = Product::find($this->product_id);
                if ($product && $product->stock < $this->quantity) {
                    $validator->errors()->add('quantity', 'Insufficient stock for EXIT transaction.');
                }
            }
        });
    }

    public function toDto(): CreateTransactionDto
    {
        return CreateTransactionDto::fromArray($this->validated() + ['user_id' => Auth::id()]);
    }
}