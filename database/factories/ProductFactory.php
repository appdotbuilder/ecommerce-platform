<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(random_int(2, 4), true);
        $price = $this->faker->randomFloat(2, 10, 1000);
        $hasSalePrice = $this->faker->boolean(30);
        
        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraphs(3, true),
            'short_description' => $this->faker->sentence(),
            'sku' => strtoupper($this->faker->unique()->bothify('???-####')),
            'price' => $price,
            'sale_price' => $hasSalePrice ? $price * 0.8 : null,
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'manage_stock' => true,
            'in_stock' => $this->faker->boolean(85),
            'images' => null,
            'weight' => $this->faker->randomFloat(2, 0.1, 10),
            'status' => $this->faker->randomElement(['published', 'draft']),
            'is_featured' => $this->faker->boolean(20),
            'category_id' => Category::factory(),
        ];
    }

    /**
     * Indicate that the product is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is in stock.
     */
    public function inStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'in_stock' => true,
            'stock_quantity' => $this->faker->numberBetween(1, 100),
        ]);
    }
}