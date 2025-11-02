<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Builder;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'type',
        'quantity',
        'date',
        'notes',
    ];

    protected $casts = [
        'date' => 'datetime',
        'type' => \App\Enums\TransactionType::class,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeFilter(Builder $query, array $data): void
    {
        $query->when($data['search'] ?? null, function (Builder $query, string $search): void {
            $query->where(function (Builder $query) use ($search): void {
                $query->where('notes', 'like', '%' . $search . '%')
                    ->orWhereHas('product', function (Builder $query) use ($search) {
                        $query->where('title', 'like', '%' . $search . '%');
                    });
            });
        })
        ->when($data['type'] ?? null, function (Builder $query, string $type): void {
            $query->where('type', $type);
        })
        ->when($data['from_date'] ?? null, function (Builder $query, string $date): void {
            $query->whereDate('date', '>=', $date);
        })
        ->when($data['to_date'] ?? null, function (Builder $query, string $date): void {
            $query->whereDate('date', '<=', $date);
        });
    }
}
