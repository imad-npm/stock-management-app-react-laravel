<?php

namespace App\Services;

use App\Models\Category;
use App\Models\User;
use App\DataTransferObjects\CreateCategoryDto;
use App\DataTransferObjects\UpdateCategoryDto;

class CategoryService
{
    public function getAllCategoriesByUser(User $user)
    {
        return $user->categories;
    }

    public function getById(Category $category)
    {
        return $category;
    }

    public function createCategory(User $user, CreateCategoryDto $dto)
    {
        $category = new Category();
        $category->name = $dto->name;
        $category->user_id = $user->id;
        $category->save();

        return $category;
    }

    public function updateCategory(Category $category, UpdateCategoryDto $dto)
    {
        $category->name = $dto->name;
        $category->save();

        return $category;
    }

    public function deleteCategory(Category $category)
    {
        $category->delete();
    }
}
