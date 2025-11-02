<?php

namespace App\Services;

use App\DataTransferObjects\CreateTransactionDto;
use App\DataTransferObjects\TransactionData;
use App\DataTransferObjects\TransactionDto;
use App\DataTransferObjects\UpdateTransactionDto;
use App\Enums\TransactionType;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class TransactionService
{
    public function getTransactionsByUser(User $user, array $filters = [])
    {
       $query = $user->role === 'admin'
            ? Transaction::with('product')
            : $user->transactions()->with('product');

        $query->filter($filters);

        // If "page" param not provided → return all
        if (!request()->has('page')) {
            return $query->get();
        }

        // Else paginate
        return $query->paginate(10);
     }

    public function createTransaction(User $user, CreateTransactionDto $data): Transaction
    {
        $product = Product::findOrFail($data->product_id);

        // Ensure the product belongs to the authenticated user
        if ($product->user_id !== $user->id) {
            throw ValidationException::withMessages([
                'product_id' => ['Unauthorized to transact on this product'],
            ]);
        }

        if ($data->type === TransactionType::EXIT && $product->stock < $data->quantity) {
            throw ValidationException::withMessages([
                'quantity' => ['Insufficient stock for EXIT transaction'],
            ]);
        }

        $transaction = $user->transactions()->create([
            'product_id' => $data->product_id,
            'type' => $data->type,
            'quantity' => $data->quantity,
            'date' => $data->date,
            'notes' => $data->notes,
        ]);

        // Update product stock based on transaction type
        if ($transaction->type === TransactionType::ENTRY) {
            $product->increment('stock', $transaction->quantity);
        } elseif ($transaction->type === TransactionType::EXIT) {
            $product->decrement('stock', $transaction->quantity);
        }

        return $transaction;
    }

    public function updateTransaction(Transaction $transaction, UpdateTransactionDto $data): Transaction
    {
        $product = $transaction->product;

        // Store old values for stock adjustment
        $oldQuantity = $transaction->quantity;
        $oldType = $transaction->type;

        // Update transaction attributes
        $transaction->fill([
            'product_id' => $data->product_id ?? $transaction->product_id,
            'type' => $data->type ?? $transaction->type,
            'quantity' => $data->quantity ?? $transaction->quantity,
            'date' => $data->date ?? $transaction->date,
            'notes' => $data->notes ?? $transaction->notes,
        ]);

        // If product_id changed, ensure new product belongs to user
        if ($data->product_id && $data->product_id !== $transaction->product_id) {
            $newProduct = Product::findOrFail($data->product_id);
            if ($newProduct->user_id !== $transaction->user_id) {
                throw ValidationException::withMessages([
                    'product_id' => ['Unauthorized to change product to one not owned by user'],
                ]);
            }
            $product = $newProduct; // Update product reference
        }

        // Revert old stock change
        if ($oldType === TransactionType::ENTRY) {
            $product->decrement('stock', $oldQuantity);
        } elseif ($oldType === TransactionType::EXIT) {
            $product->increment('stock', $oldQuantity);
        }

        // Apply new stock change and check for insufficient stock
        if ($transaction->type === TransactionType::ENTRY) {
            $product->increment('stock', $transaction->quantity);
        } elseif ($transaction->type === TransactionType::EXIT) {
            if ($product->stock < $transaction->quantity) {
                // Revert stock changes before throwing exception
                if ($oldType === TransactionType::ENTRY) {
                    $product->increment('stock', $oldQuantity);
                } elseif ($oldType === TransactionType::EXIT) {
                    $product->decrement('stock', $oldQuantity);
                }
                throw ValidationException::withMessages([
                    'quantity' => ['Insufficient stock for EXIT transaction after update'],
                ]);
            }
            $product->decrement('stock', $transaction->quantity);
        }

        $transaction->save();

        return $transaction;
    }

    public function deleteTransaction(Transaction $transaction): void
    {
        $product = $transaction->product;

        // Revert stock change upon transaction deletion
        if ($transaction->type === TransactionType::ENTRY) {
            $product->decrement('stock', $transaction->quantity);
        } elseif ($transaction->type === TransactionType::EXIT) {
            $product->increment('stock', $transaction->quantity);
        }

        $transaction->delete();
    }
}
