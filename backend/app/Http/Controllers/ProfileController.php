<?php

namespace App\Http\Controllers;

use App\DataTransferObjects\UpdateProfileDto;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(private readonly UserService $userService)
    {
    }

    public function show(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function update(UpdateProfileRequest $request): UserResource
    {
        $user = $this->userService->updateProfile($request->user(), UpdateProfileDto::fromRequest($request));

        return new UserResource($user);
    }

    public function destroy(Request $request): \Illuminate\Http\JsonResponse
    {
        $this->userService->deleteUser($request->user());

        return response()->json(['message' => 'User deleted successfully']);
    }
}
