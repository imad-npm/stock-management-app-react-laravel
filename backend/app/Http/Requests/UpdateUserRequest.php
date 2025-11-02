<?php

namespace App\Http\Requests;

use App\DataTransferObjects\UpdateUserDto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->isAdmin(); // Only admins can update users
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:users,email,' . $this->route('user')->id],
            'password' => ['sometimes', 'required', 'string', Password::defaults()],
            'role' => ['sometimes', 'nullable', 'string', 'in:admin,user'],
        ];
    }

    public function toDto(): UpdateUserDto
    {
        return UpdateUserDto::fromArray($this->validated());
    }
}
