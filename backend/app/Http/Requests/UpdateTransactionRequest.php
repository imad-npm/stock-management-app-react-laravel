<?php

namespace App\Http\Requests;

use App\DataTransferObjects\UpdateTransactionDto;
use App\DataTransferObjects\TransactionData;
use App\DataTransferObjects\TransactionDto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;

class UpdateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Authorization will be handled by TransactionPolicy later
        if (!Auth::check()) {
            return false;
        }

        // Ensure the transaction belongs to the authenticated user
        return $this->transaction->user_id === Auth::id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => 'sometimes|required|exists:products,id',
            'type' => 'sometimes|required|in:ENTRY,EXIT',
            'quantity' => 'sometimes|required|integer|min:1',
            'date' => 'sometimes|required|date',
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
            if ($this->has('type') || $this->has('quantity')) {
                $product = Product::find($this->product_id ?: $this->transaction->product_id);
                $newQuantity = $this->quantity ?: $this->transaction->quantity;
                $newType = $this->type ?: $this->transaction->type;

                // Calculate potential stock after update
                $currentStock = $product->stock;
                $oldQuantity = $this->transaction->quantity;
                $oldType = $this->transaction->type;

                // Revert old transaction's effect on stock
                if ($oldType === 'ENTRY') {
                    $currentStock -= $oldQuantity;
                } elseif ($oldType === 'EXIT') {
                    $currentStock += $oldQuantity;
                }

                // Apply new transaction's effect on stock
                if ($newType === 'EXIT') {
                    if ($currentStock < $newQuantity) {
                        $validator->errors()->add('quantity', 'Insufficient stock for EXIT transaction after update.');
                    }
                }
            }
        });
    }

    public function toDto(): UpdateTransactionDto
    {
        return UpdateTransactionDto::fromArray($this->validated());
    }
}