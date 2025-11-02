<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\ProductResource;
use App\Services\TransactionService;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Transaction::class);

        $filters = request()->only(['search', 'type', 'from_date', 'to_date']);

        $transactions = $this->transactionService->getTransactionsByUser(Auth::user(), $filters);
        return TransactionResource::collection($transactions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        $this->authorize('create', Transaction::class);
        $transaction = $this->transactionService->createTransaction(Auth::user(), $request->toDto());

        return new TransactionResource($transaction);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
            $transaction->load('product');

        $this->authorize('view', $transaction);
        return new TransactionResource($transaction);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);
        $transaction = $this->transactionService->updateTransaction($transaction, $request->toDto());

        return new TransactionResource($transaction);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);
        $this->transactionService->deleteTransaction($transaction);

        return response()->json(null, 204);
    }
}
