<?php

namespace App\Http\Controllers;

use App\Enums\TransactionType;
use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            $totalProducts = Product::count();
            $totalTransactions = Transaction::count();
            $totalStock = Product::sum('stock');
            $totalCategories = Category::count();

            $top5Products = Product::withCount('transactions')
                ->orderByDesc('transactions_count')
                ->limit(5)
                ->get();

            $transactionTypeCounts = Transaction::query()
                ->select('type', DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->type->value => $item->count];
                });
        } else {
            $totalProducts = Product::where('user_id', $user->id)->count();
            $totalTransactions = Transaction::where('user_id', $user->id)->count();
            $totalStock = Product::where('user_id', $user->id)->sum('stock');
            // For categories, we need to count unique categories associated with the user's products
            $totalCategories = Product::where('user_id', $user->id)
                ->distinct('category_id')
                ->count('category_id');

            $top5Products = Product::where('user_id', $user->id)
                ->withCount('transactions')
                ->orderByDesc('transactions_count')
                ->limit(5)
                ->get();

            $transactionTypeCounts = Transaction::query()
                ->where('user_id', $user->id)
                ->select('type', DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->type->value => $item->count];
                });
        }

        // Ensure all transaction types are present in the result
        foreach (TransactionType::cases() as $case) {
            if (!isset($transactionTypeCounts[$case->value])) {
                $transactionTypeCounts[$case->value] = 0;
            }
        }

        return response()->json([
            'totalProducts' => $totalProducts,
            'totalTransactions' => $totalTransactions,
            'totalStock' => (int) $totalStock,
            'totalCategories' => $totalCategories,
            'top5Products' => $top5Products,
            'transactionTypeCounts' => $transactionTypeCounts,
        ]);
    }
}
