<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        App\Models\Product::class => App\Policies\ProductPolicy::class,
        App\Models\Transaction::class => App\Policies\TransactionPolicy::class,
        App\Models\User::class => App\Policies\UserPolicy::class,
        App\Models\Category::class => App\Policies\CategoryPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
