<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::factory()->create(['role' => 'admin']);
        $this->regularUser = User::factory()->create(['role' => 'user']);
    }

    /** @test */
    public function admin_can_list_users()
    {
        $this->actingAs($this->adminUser, 'sanctum');
        User::factory()->count(5)->create();

        $response = $this->getJson('/api/users');

        $response->assertOk()
            ->assertJsonStructure(['data' => [['id', 'name', 'email', 'role']]])
            ->assertJsonCount(7, 'data'); // 5 created + admin + regular
    }

    /** @test */
    public function admin_can_create_a_user()
    {
        $this->actingAs($this->adminUser, 'sanctum');

        $payload = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'user',
        ];

        $response = $this->postJson('/api/users', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.email', 'newuser@example.com')
            ->assertJsonPath('data.role', 'user');

        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com', 'role' => 'user']);
    }

    /** @test */
    public function admin_can_view_a_user()
    {
        $this->actingAs($this->adminUser, 'sanctum');

        $response = $this->getJson("/api/users/{$this->regularUser->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $this->regularUser->id)
            ->assertJsonPath('data.email', $this->regularUser->email);
    }

    /** @test */
    public function admin_can_update_a_user()
    {
        $this->actingAs($this->adminUser, 'sanctum');

        $payload = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'admin',
        ];

        $response = $this->putJson("/api/users/{$this->regularUser->id}", $payload);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Name')
            ->assertJsonPath('data.email', 'updated@example.com')
            ->assertJsonPath('data.role', 'admin');

        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'admin',
        ]);
    }

    /** @test */
    public function admin_can_delete_a_user()
    {
        $this->actingAs($this->adminUser, 'sanctum');

        $response = $this->deleteJson("/api/users/{$this->regularUser->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('users', ['id' => $this->regularUser->id]);
    }

    /** @test */
    public function non_admin_cannot_list_users()
    {
        $this->actingAs($this->regularUser, 'sanctum');

        $response = $this->getJson('/api/users');

        $response->assertForbidden();
    }

    /** @test */
    public function non_admin_cannot_create_a_user()
    {
        $this->actingAs($this->regularUser, 'sanctum');

        $payload = [
            'name' => 'Unauthorized User',
            'email' => 'unauthorized@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'user',
        ];

        $response = $this->postJson('/api/users', $payload);

        $response->assertForbidden();
        $this->assertDatabaseMissing('users', ['email' => 'unauthorized@example.com']);
    }

    /** @test */
    public function non_admin_cannot_view_another_user()
    {
        $this->actingAs($this->regularUser, 'sanctum');
        $anotherUser = User::factory()->create();

        $response = $this->getJson("/api/users/{$anotherUser->id}");

        $response->assertForbidden();
    }

    /** @test */
    public function non_admin_can_view_their_own_profile()
    {
        $this->actingAs($this->regularUser, 'sanctum');

        $response = $this->getJson("/api/users/{$this->regularUser->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $this->regularUser->id);
    }

    /** @test */
    public function non_admin_cannot_update_another_user()
    {
        $this->actingAs($this->regularUser, 'sanctum');
        $anotherUser = User::factory()->create();

        $payload = [
            'name' => 'Attempted Update',
        ];

        $response = $this->putJson("/api/users/{$anotherUser->id}", $payload);

        $response->assertForbidden();
        $this->assertDatabaseMissing('users', ['name' => 'Attempted Update']);
    }

    /** @test */
    public function non_admin_cannot_delete_another_user()
    {
        $this->actingAs($this->regularUser, 'sanctum');
        $anotherUser = User::factory()->create();

        $response = $this->deleteJson("/api/users/{$anotherUser->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('users', ['id' => $anotherUser->id]);
    }

    /** @test */
    public function user_cannot_update_their_own_role()
    {
        $this->actingAs($this->regularUser, 'sanctum');

        $payload = [
            'role' => 'admin',
        ];

        $response = $this->putJson("/api/users/{$this->regularUser->id}", $payload);

        $response->assertForbidden(); // Policy should prevent this
        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'role' => 'user',
        ]);
    }

    /** @test */
    public function admin_can_update_their_own_profile_without_changing_role_if_not_specified()
    {
        $this->actingAs($this->adminUser, 'sanctum');

        $payload = [
            'name' => 'Admin New Name',
            'email' => 'admin_new@example.com',
        ];

        $response = $this->putJson("/api/users/{$this->adminUser->id}", $payload);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Admin New Name')
            ->assertJsonPath('data.email', 'admin_new@example.com')
            ->assertJsonPath('data.role', 'admin'); // Role should remain admin

        $this->assertDatabaseHas('users', [
            'id' => $this->adminUser->id,
            'name' => 'Admin New Name',
            'email' => 'admin_new@example.com',
            'role' => 'admin',
        ]);
    }
}
