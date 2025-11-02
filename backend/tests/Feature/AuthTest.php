<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_user_can_register()
    {
        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token'])
            ->assertJsonPath('user.email', 'test@example.com');

        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    /** @test */
    public function a_user_cannot_register_with_invalid_data()
    {
        $payload = [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'short',
            'password_confirmation' => 'not-matching',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    /** @test */
    public function a_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('password'),
        ]);

        $payload = [
            'email' => 'login@example.com',
            'password' => 'password',
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertOk()
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token'])
            ->assertJsonPath('user.email', 'login@example.com');
    }

    /** @test */
    public function a_user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'wrong@example.com',
            'password' => Hash::make('password'),
        ]);

        $payload = [
            'email' => 'wrong@example.com',
            'password' => 'wrong-password',
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertUnauthorized()
            ->assertJsonPath('message', 'Invalid credentials');
    }

    /** @test */
    public function an_authenticated_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertOk()
            ->assertJsonPath('message', 'Logged out successfully');

        $this->assertCount(0, $user->tokens);
    }

    /** @test */
    public function an_unauthenticated_user_cannot_logout()
    {
        $response = $this->postJson('/api/logout');

        $response->assertUnauthorized();
    }
}