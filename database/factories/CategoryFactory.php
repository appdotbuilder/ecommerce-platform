<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->randomElement([
            'Electronics',
            'Clothing',
            'Books',
            'Home & Garden',
            'Sports & Outdoors',
            'Toys & Games',
            'Beauty & Personal Care',
            'Health & Wellness',
            'Food & Beverage',
            'Automotive'
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'image' => null,
            'is_active' => $this->faker->boolean(90),
        ];
    }

    /**
     * Indicate that the category is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }
}