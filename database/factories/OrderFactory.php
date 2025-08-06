<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 50, 500);
        $discountAmount = $this->faker->randomFloat(2, 0, $subtotal * 0.3);
        $taxAmount = ($subtotal - $discountAmount) * 0.08;
        $shippingAmount = $this->faker->randomFloat(2, 0, 20);
        $totalAmount = $subtotal - $discountAmount + $taxAmount + $shippingAmount;
        
        return [
            'order_number' => Order::generateOrderNumber(),
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'total_amount' => $totalAmount,
            'currency' => 'USD',
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'stripe', 'bank_transfer']),
            'payment_status' => $this->faker->randomElement(['pending', 'paid', 'failed']),
            'billing_address' => [
                'first_name' => $this->faker->firstName(),
                'last_name' => $this->faker->lastName(),
                'company' => $this->faker->optional()->company(),
                'address_1' => $this->faker->streetAddress(),
                'address_2' => $this->faker->optional()->streetName(),
                'city' => $this->faker->city(),
                'state' => $this->faker->randomElement(['CA', 'NY', 'TX', 'FL', 'IL']),
                'postcode' => $this->faker->postcode(),
                'country' => 'US',
                'email' => $this->faker->email(),
                'phone' => $this->faker->phoneNumber(),
            ],
            'shipping_address' => [
                'first_name' => $this->faker->firstName(),
                'last_name' => $this->faker->lastName(),
                'company' => $this->faker->optional()->company(),
                'address_1' => $this->faker->streetAddress(),
                'address_2' => $this->faker->optional()->streetName(),
                'city' => $this->faker->city(),
                'state' => $this->faker->randomElement(['CA', 'NY', 'TX', 'FL', 'IL']),
                'postcode' => $this->faker->postcode(),
                'country' => 'US',
            ],
            'notes' => $this->faker->optional()->paragraph(),
            'voucher_id' => $discountAmount > 0 ? Voucher::factory() : null,
            'shipped_at' => $this->faker->optional(0.4)->dateTimeBetween('-1 month', 'now'),
            'delivered_at' => $this->faker->optional(0.2)->dateTimeBetween('-1 month', 'now'),
        ];
    }
}