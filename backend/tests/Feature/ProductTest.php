<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        // Authenticate the user for API calls
        $this->actingAs($this->user, 'sanctum'); // or 'api' depending on your guard
    }

    /** @test */
    public function it_lists_products()
    {
        Product::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/products');

        $response->assertOk()
            ->assertJsonStructure(['data' => [['id', 'title']]])
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function it_creates_a_product()
    {
        $payload = [
            'title' => 'API Product',
            'description' => 'This is a product created via API.',
            'price' => 99.99,
            'stock' => 10,
        ];    


        $response = $this->postJson('/api/products', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'API Product');

        $this->assertDatabaseHas('products', ['title' => 'API Product']);
    }

    /** @test */
    public function it_shows_a_product()
    {
        $product = Product::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $product->id);
    }

    /** @test */
    public function it_updates_a_product()
    {
        $product = Product::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'title' => 'Updated API Product',
            'price' => 199.99,
        ];

        $response = $this->putJson("/api/products/{$product->id}", $payload);

        $response->assertOk()
            ->assertJsonPath('data.title', 'Updated API Product');

        $this->assertDatabaseHas('products', ['title' => 'Updated API Product']);
    }

    /** @test */
    public function it_deletes_a_product()
    {
        $product = Product::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    /** @test */
public function it_denies_updating_a_product_that_belongs_to_another_user()
{
    $otherUser = User::factory()->create();
    $product = Product::factory()->for($otherUser)->create();

    $response = $this->putJson("/api/products/{$product->id}", [
        'title' => 'Hacked Product'
    ]);

    $response->assertForbidden();

    $this->assertDatabaseMissing('products', ['title' => 'Hacked Product']);
}

    /** @test */
    public function it_searches_products_by_description()
    {
        Product::factory()->create(['description' => 'This is a great product.', 'user_id' => $this->user->id]);
        Product::factory()->create(['description' => 'This is another product.', 'user_id' => $this->user->id]);

        $response = $this->getJson('/api/products?search=great');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.description', 'This is a great product.');
    }

    /** @test */
    public function it_filters_products_by_category()
    {
        Product::factory()->create(['category' => 'Category A', 'user_id' => $this->user->id]);
        Product::factory()->create(['category' => 'Category B', 'user_id' => $this->user->id]);

        $response = $this->getJson('/api/products?category=Category%20A');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.category', 'Category A');
    }

    /** @test */
    public function it_filters_products_by_brand()
    {
        Product::factory()->create(['brand' => 'Brand A', 'user_id' => $this->user->id]);
        Product::factory()->create(['brand' => 'Brand B', 'user_id' => $this->user->id]);

        $response = $this->getJson('/api/products?brand=Brand%20A');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.brand', 'Brand A');
    }

    /** @test */
    public function it_filters_products_by_price_range()
    {
        Product::factory()->create(['price' => 100, 'user_id' => $this->user->id]);
        Product::factory()->create(['price' => 200, 'user_id' => $this->user->id]);
        Product::factory()->create(['price' => 300, 'user_id' => $this->user->id]);

        $response = $this->getJson('/api/products?min_price=150&max_price=250');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.price', 200);
    }

    /** @test */
    public function it_sorts_products_by_latest()
    {
        Product::factory()->create(['created_at' => now()->subDay(), 'user_id' => $this->user->id]);
        $latestProduct = Product::factory()->create(['created_at' => now(), 'user_id' => $this->user->id]);

        $response = $this->getJson('/api/products?sort_by=latest');

        $response->assertOk()
            ->assertJsonPath('data.0.id', $latestProduct->id);
    }

    /** @test */
    public function it_sorts_products_by_oldest()
    {
        $oldestProduct = Product::factory()->create(['created_at' => now()->subDay(), 'user_id' => $this->user->id]);
        Product::factory()->create(['created_at' => now(), 'user_id' => $this->user->id]);

        $response = $this->getJson('/api/products?sort_by=oldest');

        $response->assertOk()
            ->assertJsonPath('data.0.id', $oldestProduct->id);
    }

    /** @test */
    public function it_sorts_products_by_price_asc()
    {
        Product::factory()->create(['price' => 200, 'user_id' => $this->user->id]);
        $cheapestProduct = Product::factory()->create(['price' => 100, 'user_id' => $this->user->id]);

        $response = $this->getJson('/api/products?sort_by=price_asc');

        $response->assertOk()
            ->assertJsonPath('data.0.id', $cheapestProduct->id);
    }

    /** @test */
    public function it_sorts_products_by_price_desc()
    {
        $mostExpensiveProduct = Product::factory()->create(['price' => 200, 'user_id' => $this->user->id]);
        Product::factory()->create(['price' => 100, 'user_id' => $this->user->id]);

        $response = $this->getJson('/api/products?sort_by=price_desc');

        $response->assertOk()
            ->assertJsonPath('data.0.id', $mostExpensiveProduct->id);
    }

}
