<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category_id',
        'brand',
        'price',
        'stock',
        'image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function scopeFilter(Builder $query, array $data): void
    {
        $query->when($data['search'] ?? null, function (Builder $query, string $search): void {
            $query->where(function (Builder $query) use ($search): void {
                $query->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        })
        ->when($data['category_id'] ?? null, function (Builder $query, string $categoryId): void {
            $query->where('category_id', $categoryId);
        })
        ->when($data['brand'] ?? null, function (Builder $query, string $brand): void {
            $query->where('brand', $brand);
        })
        ->when($data['min_price'] ?? null, function (Builder $query, string $minPrice): void {
            $query->where('price', '>=', $minPrice);
        })
        ->when($data['max_price'] ?? null, function (Builder $query, string $maxPrice): void {
            $query->where('price', '<=', $maxPrice);
        })
          ->when($data['min_stock'] ?? null, function (Builder $query, string $minstock): void {
            $query->where('stock', '>=', $minstock);
        })
        ->when($data['max_stock'] ?? null, function (Builder $query, string $maxstock): void {
            $query->where('stock', '<=', $maxstock);
        })
        ->when($data['sort_by'] ?? 'latest', function (Builder $query, string $sortBy): void {
            if ($sortBy === 'latest') {
                $query->latest();
            } elseif ($sortBy === 'oldest') {
                $query->oldest();
            } elseif ($sortBy === 'price_asc') {
                $query->orderBy('price', 'asc');
            } elseif ($sortBy === 'price_desc') {
                $query->orderBy('price', 'desc');
            }
        });
    }
}
