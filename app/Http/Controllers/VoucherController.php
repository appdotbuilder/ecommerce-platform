<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Voucher;
use App\Services\CartService;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    /**
     * The cart service instance.
     *
     * @var CartService
     */
    protected $cartService;

    /**
     * Create a new controller instance.
     *
     * @param  CartService  $cartService
     * @return void
     */
    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Apply voucher to cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'voucher_code' => 'required|string',
        ]);

        $cart = $this->cartService->getOrCreateCart();
        $voucher = Voucher::where('code', $request->voucher_code)->first();

        if (!$voucher || !$voucher->is_valid) {
            return back()->with('error', 'Invalid or expired voucher code.');
        }

        $discount = $voucher->calculateDiscount($cart->total);
        
        if ($discount <= 0) {
            return back()->with('error', 'This voucher cannot be applied to your cart.');
        }

        session(['applied_voucher' => [
            'id' => $voucher->id,
            'code' => $voucher->code,
            'discount' => $discount,
        ]]);

        return back()->with('success', "Voucher applied! You saved $" . number_format($discount, 2));
    }

    /**
     * Remove applied voucher.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy()
    {
        session()->forget('applied_voucher');
        
        return back()->with('success', 'Voucher removed.');
    }


}