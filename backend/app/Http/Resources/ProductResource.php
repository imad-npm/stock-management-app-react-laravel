<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => $this->user,

            'title' => $this->title,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'brand' => $this->brand,
            'price' => $this->price,
            'stock' => $this->stock,
            'image' => $this->image ? asset('storage/' . $this->image) : 
            asset('images/default.png'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}