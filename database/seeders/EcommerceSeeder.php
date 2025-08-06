<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Database\Seeder;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Latest gadgets and electronic devices',
            ],
            [
                'name' => 'Clothing',
                'description' => 'Fashion and apparel for all occasions',
            ],
            [
                'name' => 'Books',
                'description' => 'Educational and entertainment reading materials',
            ],
            [
                'name' => 'Home & Garden',
                'description' => 'Everything for your home and garden needs',
            ],
            [
                'name' => 'Sports & Outdoors',
                'description' => 'Sports equipment and outdoor gear',
            ],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::factory()->active()->create($categoryData);
            
            // Create 8-12 products per category
            Product::factory()
                ->count(random_int(8, 12))
                ->published()
                ->inStock()
                ->create(['category_id' => $category->id]);
        }

        // Create some featured products
        Product::published()
            ->inStock()
            ->inRandomOrder()
            ->limit(6)
            ->update(['is_featured' => true]);

        // Create vouchers
        Voucher::factory()->count(10)->active()->create();
        
        // Create some specific vouchers
        Voucher::factory()->active()->create([
            'code' => 'WELCOME10',
            'type' => 'percentage',
            'value' => 10,
            'minimum_amount' => 50,
        ]);

        Voucher::factory()->active()->create([
            'code' => 'SAVE20',
            'type' => 'fixed',
            'value' => 20,
            'minimum_amount' => 100,
        ]);

        Voucher::factory()->active()->create([
            'code' => 'FREESHIP',
            'type' => 'fixed',
            'value' => 10,
            'minimum_amount' => 75,
        ]);
    }
}