<?php

namespace App\Services;

use App\Models\Cart;

class CartService
{
    /**
     * Get or create cart for current session/user.
     *
     * @return \App\Models\Cart|null
     */
    public function getOrCreateCart(): ?Cart
    {
        if (auth()->check()) {
            return Cart::firstOrCreate([
                'user_id' => auth()->id(),
            ]);
        }

        return Cart::firstOrCreate([
            'session_id' => session()->getId(),
        ]);
    }

    /**
     * Get current user's cart without creating.
     *
     * @return \App\Models\Cart|null
     */
    public function getCurrentCart(): ?Cart
    {
        if (auth()->check()) {
            return Cart::where('user_id', auth()->id())->first();
        }

        return Cart::where('session_id', session()->getId())->first();
    }
}