<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::all()->each(function (Category $category) {
            Product::factory()->count(3)->create([
                'user_id' => $category->user_id,
                'category_id' => $category->id,
            ]);
        });
    }
}
