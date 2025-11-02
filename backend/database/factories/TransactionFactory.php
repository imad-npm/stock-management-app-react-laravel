<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => null,
            'user_id' => null,
            'type' => $this->faker->randomElement(['ENTRY', 'EXIT']),
            'quantity' => $this->faker->numberBetween(1, 10),
            'date' => $this->faker->dateTimeThisYear(),
            'notes' => $this->faker->sentence,
        ];
    }
}
