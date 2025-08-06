<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'session_id' => $this->faker->uuid(),
            'user_id' => null,
        ];
    }

    /**
     * Indicate that the cart belongs to a user.
     */
    public function forUser(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => User::factory(),
            'session_id' => null,
        ]);
    }
}