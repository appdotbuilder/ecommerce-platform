<?php

namespace Database\Factories;

use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Voucher>
 */
class VoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['percentage', 'fixed']);
        
        return [
            'code' => strtoupper($this->faker->unique()->bothify('????##')),
            'type' => $type,
            'value' => $type === 'percentage' 
                ? $this->faker->numberBetween(5, 50)
                : $this->faker->numberBetween(5, 100),
            'minimum_amount' => $this->faker->optional(0.7)->randomFloat(2, 50, 200),
            'maximum_discount' => $type === 'percentage' 
                ? $this->faker->optional(0.5)->randomFloat(2, 20, 100)
                : null,
            'usage_limit' => $this->faker->optional(0.6)->numberBetween(1, 100),
            'usage_count' => 0,
            'is_active' => $this->faker->boolean(85),
            'starts_at' => $this->faker->optional(0.3)->dateTimeBetween('-1 month', '+1 month'),
            'expires_at' => $this->faker->optional(0.8)->dateTimeBetween('+1 day', '+6 months'),
        ];
    }

    /**
     * Indicate that the voucher is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }
}