<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Voucher;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
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
     * Display the checkout form.
     */
    public function index()
    {
        $cart = $this->cartService->getCurrentCart();
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('shop.index')
                ->with('error', 'Your cart is empty.');
        }

        $cart->load(['items.product']);
        $appliedVoucher = session('applied_voucher');
        
        $subtotal = $cart->total;
        $discountAmount = $appliedVoucher['discount'] ?? 0;
        $taxAmount = ($subtotal - $discountAmount) * 0.08; // 8% tax
        $shippingAmount = $subtotal > 100 ? 0 : 10; // Free shipping over $100
        $totalAmount = $subtotal - $discountAmount + $taxAmount + $shippingAmount;

        return Inertia::render('checkout/index', [
            'cart' => $cart,
            'appliedVoucher' => $appliedVoucher,
            'orderSummary' => [
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'tax_amount' => $taxAmount,
                'shipping_amount' => $shippingAmount,
                'total_amount' => $totalAmount,
            ],
        ]);
    }

    /**
     * Process the checkout and create order.
     */
    public function store(StoreOrderRequest $request)
    {
        $cart = $this->cartService->getCurrentCart();
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('shop.index')
                ->with('error', 'Your cart is empty.');
        }

        return DB::transaction(function () use ($request, $cart) {
            $appliedVoucher = session('applied_voucher');
            $voucher = null;
            
            if ($appliedVoucher) {
                $voucher = Voucher::find($appliedVoucher['id']);
            }

            $subtotal = $cart->total;
            $discountAmount = $appliedVoucher['discount'] ?? 0;
            $taxAmount = ($subtotal - $discountAmount) * 0.08;
            $shippingAmount = $subtotal > 100 ? 0 : 10;
            $totalAmount = $subtotal - $discountAmount + $taxAmount + $shippingAmount;

            // Create order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => auth()->id(),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'tax_amount' => $taxAmount,
                'shipping_amount' => $shippingAmount,
                'total_amount' => $totalAmount,
                'currency' => 'USD',
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'billing_address' => $request->billing_address,
                'shipping_address' => $request->shipping_address,
                'notes' => $request->notes,
                'voucher_id' => $voucher?->id,
            ]);

            // Create order items
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_sku' => $item->product->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->price,
                    'total_price' => $item->price * $item->quantity,
                ]);
            }

            // Update voucher usage
            if ($voucher) {
                $voucher->increment('usage_count');
            }

            // Clear cart and voucher session
            $cart->items()->delete();
            $cart->delete();
            session()->forget('applied_voucher');

            return redirect()->route('orders.show', $order)
                ->with('success', 'Order placed successfully!');
        });
    }


}