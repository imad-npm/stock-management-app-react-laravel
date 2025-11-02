<?php

namespace Tests\Feature;

use App\Enums\TransactionType;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->product = Product::factory()->create(['user_id' => $this->user->id]);

        // Authenticate the user for API calls
        $this->actingAs($this->user, 'sanctum'); 
    }

    /** @test */
    public function it_lists_transactions()
    {
        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->id,
        ]);

        $response = $this->getJson('/api/transactions');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [[
                    'id',
                    'product',
                    'user_id',
                    'type',
                    'quantity',
                    'date',
                    'notes'
                ]]
            ])
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function it_creates_a_transaction()
    {
        $payload = [
            'product_id' => $this->product->id,
            'user_id' => $this->user->id,
            'type' => TransactionType::ENTRY, // depends on your TransactionType enum
            'quantity' => 5,
            'date' => now()->toDateTimeString(),
            'notes' => 'Initial stock',
        ];

        $response = $this->postJson('/api/transactions', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.quantity', 5);

        $this->assertDatabaseHas('transactions', [
            'product_id' => $this->product->id,
            'quantity' => 5,
        ]);
    }

    /** @test */
    public function it_shows_a_transaction()
    {
        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->id,
        ]);

        $response = $this->getJson("/api/transactions/{$transaction->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $transaction->id);
    }

    /** @test */
    public function it_updates_a_transaction()
    {
        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->id,
            'quantity' => 5,
        ]);

        $payload = ['quantity' => 15];

        $response = $this->putJson("/api/transactions/{$transaction->id}", $payload);

        $response->assertOk()
            ->assertJsonPath('data.quantity', 15);

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'quantity' => 15,
        ]);
    }

    /** @test */
    public function it_deletes_a_transaction()
    {
        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->id,
        ]);

        $response = $this->deleteJson("/api/transactions/{$transaction->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
    }
}
