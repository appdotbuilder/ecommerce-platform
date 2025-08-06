<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\VoucherController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - Main e-commerce shop
Route::get('/', [ShopController::class, 'index'])->name('home');

// Shop routes
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/products/{product:slug}', [ShopController::class, 'show'])->name('products.show');

// Cart routes (guest and authenticated users)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::post('/cart/voucher', [VoucherController::class, 'store'])->name('cart.voucher.apply');
Route::delete('/cart/voucher', [VoucherController::class, 'destroy'])->name('cart.voucher.remove');

// Welcome page for unauthenticated users
Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Checkout routes (require authentication)
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    
    // Order routes (require authentication)
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
