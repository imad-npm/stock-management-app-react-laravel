<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_their_profile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/profile');

        $response->assertSuccessful();
        $response->assertJson([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function test_user_can_update_their_profile(): void
    {
        $user = User::factory()->create();

        $response =  $this->actingAs($user, 'sanctum')->putJson('/api/profile', [
            'name' => 'New Name',
            'email' => 'newemail@example.com',
        ]);

        $response->assertSuccessful();
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'email' => 'newemail@example.com',
        ]);
    }

    public function test_user_cannot_update_profile_with_existing_email(): void
    {
        $user = User::factory()->create();
        User::factory()->create(['email' => 'test@test.com']);

        $response =  $this->actingAs($user, 'sanctum')->putJson('/api/profile', [
            'email' => 'test@test.com',
        ]);

        $response->assertStatus(422);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/profile');

        $response->assertSuccessful();
        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_profile_routes(): void
    {
        $this->getJson('/api/profile')->assertUnauthorized();
        $this->putJson('/api/profile')->assertUnauthorized();
        $this->deleteJson('/api/profile')->assertUnauthorized();
    }
}