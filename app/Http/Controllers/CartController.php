<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
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
     * Display the cart.
     */
    public function index()
    {
        $cart = $this->cartService->getOrCreateCart();
        $cart->load(['items.product.category']);
        
        return Inertia::render('cart/index', [
            'cart' => $cart,
            'itemCount' => $cart->item_count,
            'total' => $cart->total,
        ]);
    }

    /**
     * Add item to cart.
     */
    public function store(StoreCartItemRequest $request)
    {
        $cart = $this->cartService->getOrCreateCart();
        $product = Product::findOrFail($request->product_id);
        
        if (!$product->in_stock || $product->status !== 'published') {
            return back()->with('error', 'This product is not available.');
        }

        $cartItem = $cart->items()->where('product_id', $product->id)->first();
        
        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->current_price,
            ]);
        }

        return redirect()->route('cart.index')
            ->with('success', 'Item added to cart successfully!');
    }

    /**
     * Update cart item quantity.
     */
    public function update(UpdateCartItemRequest $request, CartItem $cartItem)
    {
        $cart = $this->cartService->getOrCreateCart();
        
        if ($cartItem->cart_id !== $cart->id) {
            return back()->with('error', 'Cart item not found.');
        }

        if ($request->quantity <= 0) {
            $cartItem->delete();
            return back()->with('success', 'Item removed from cart.');
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove item from cart.
     */
    public function destroy(CartItem $cartItem)
    {
        $cart = $this->cartService->getOrCreateCart();
        
        if ($cartItem->cart_id !== $cart->id) {
            return back()->with('error', 'Cart item not found.');
        }

        $cartItem->delete();
        
        return back()->with('success', 'Item removed from cart.');
    }




}