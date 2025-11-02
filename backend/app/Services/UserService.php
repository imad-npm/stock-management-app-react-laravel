<?php

namespace App\Services;

use App\DataTransferObjects\CreateUserDto;
use App\DataTransferObjects\UpdateProfileDto;
use App\DataTransferObjects\UpdateUserDto;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getUsers(array $data = [])
    {
        $query = User::query();

        // Add any filtering or sorting logic here if needed
        // Example: if (isset($data['role'])) { $query->where('role', $data['role']); }

        return $query->paginate(10);
    }

    public function createUser(CreateUserDto $dto): User
    {
        $userData = (
            [
                'name' => $dto->name,
                'email' => $dto->email,
                'password' => Hash::make($dto->password),
            ]
        );

        if ($dto->role) {
            $userData['role'] = $dto->role;
        }

        return User::create($userData);
    }

    public function updateUser(User $user, UpdateUserDto $dto): User
    {
        $userData = array_filter((array) $dto);

        if (isset($userData['password'])) {
            $userData['password'] = Hash::make($userData['password']);
        }

        $user->update($userData);

        return $user;
    }

    public function updateProfile(User $user, UpdateProfileDto $dto): User
    {
        $user->update(array_filter((array) $dto));

        return $user;
    }

    public function deleteUser(User $user): void
    {
        $user->delete();
    }
}
