<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Transaction;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::all()->each(function (Product $product) {
            $product->transactions()->saveMany(Transaction::factory()->count(3)->make([
                'user_id' => $product->user_id,
            ]));
        });
    }
}
