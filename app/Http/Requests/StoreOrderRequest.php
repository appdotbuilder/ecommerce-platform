<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payment_method' => 'required|in:credit_card,paypal,stripe,bank_transfer',
            'billing_address.first_name' => 'required|string|max:255',
            'billing_address.last_name' => 'required|string|max:255',
            'billing_address.company' => 'nullable|string|max:255',
            'billing_address.address_1' => 'required|string|max:255',
            'billing_address.address_2' => 'nullable|string|max:255',
            'billing_address.city' => 'required|string|max:255',
            'billing_address.state' => 'required|string|max:255',
            'billing_address.postcode' => 'required|string|max:20',
            'billing_address.country' => 'required|string|max:2',
            'billing_address.email' => 'required|email|max:255',
            'billing_address.phone' => 'required|string|max:20',
            'shipping_address.first_name' => 'required|string|max:255',
            'shipping_address.last_name' => 'required|string|max:255',
            'shipping_address.company' => 'nullable|string|max:255',
            'shipping_address.address_1' => 'required|string|max:255',
            'shipping_address.address_2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.state' => 'required|string|max:255',
            'shipping_address.postcode' => 'required|string|max:20',
            'shipping_address.country' => 'required|string|max:2',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'Invalid payment method selected.',
            'billing_address.first_name.required' => 'Billing first name is required.',
            'billing_address.last_name.required' => 'Billing last name is required.',
            'billing_address.address_1.required' => 'Billing address is required.',
            'billing_address.city.required' => 'Billing city is required.',
            'billing_address.state.required' => 'Billing state is required.',
            'billing_address.postcode.required' => 'Billing postal code is required.',
            'billing_address.country.required' => 'Billing country is required.',
            'billing_address.email.required' => 'Billing email is required.',
            'billing_address.phone.required' => 'Billing phone is required.',
            'shipping_address.first_name.required' => 'Shipping first name is required.',
            'shipping_address.last_name.required' => 'Shipping last name is required.',
            'shipping_address.address_1.required' => 'Shipping address is required.',
            'shipping_address.city.required' => 'Shipping city is required.',
            'shipping_address.state.required' => 'Shipping state is required.',
            'shipping_address.postcode.required' => 'Shipping postal code is required.',
            'shipping_address.country.required' => 'Shipping country is required.',
        ];
    }
}