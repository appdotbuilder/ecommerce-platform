import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    current_price: number;
    category: {
        id: number;
        name: string;
    } | null;
}

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: Product;
}

interface Cart {
    id: number;
    items: CartItem[];
    total: number;
    item_count: number;
}

interface Props {
    cart: Cart;
    itemCount: number;
    total: number;
    [key: string]: unknown;
}

export default function CartIndex({ cart, itemCount, total }: Props) {
    const [voucherCode, setVoucherCode] = useState('');
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const updateQuantity = (cartItemId: number, quantity: number) => {
        router.patch(`/cart/${cartItemId}`, { quantity }, {
            preserveState: true,
        });
    };

    const removeItem = (cartItemId: number) => {
        router.delete(`/cart/${cartItemId}`, {
            preserveState: true,
        });
    };

    const applyVoucher = (e: React.FormEvent) => {
        e.preventDefault();
        if (!voucherCode.trim()) return;
        
        setIsApplyingVoucher(true);
        router.post('/cart/voucher', { voucher_code: voucherCode }, {
            preserveState: true,
            onFinish: () => {
                setIsApplyingVoucher(false);
                setVoucherCode('');
            },
        });
    };



    if (!cart || cart.items.length === 0) {
        return (
            <AppShell>
                <Head title="🛒 Shopping Cart" />
                
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <span className="text-8xl block mb-6">🛒</span>
                        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Looks like you haven't added any products to your cart yet.
                        </p>
                        <Link href="/">
                            <Button size="lg">
                                🛍️ Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <Head title="🛒 Shopping Cart" />
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">🛒 Shopping Cart</h1>
                    <p className="text-gray-600">
                        {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <Card key={item.id} className="p-6">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-3xl">📦</span>
                                        </div>
                                        
                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">
                                                <Link 
                                                    href={`/products/${item.product.slug}`}
                                                    className="hover:text-blue-600"
                                                >
                                                    {item.product.name}
                                                </Link>
                                            </h3>
                                            
                                            {item.product.category && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Category: {item.product.category.name}
                                                </p>
                                            )}
                                            
                                            <p className="text-lg font-semibold text-green-600">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </Button>
                                                <span className="w-12 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= 10}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            
                                            <div className="text-right min-w-[80px]">
                                                <p className="text-lg font-semibold">
                                                    {formatPrice(item.subtotal)}
                                                </p>
                                            </div>
                                            
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                🗑️
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        
                        {/* Continue Shopping */}
                        <div className="mt-8">
                            <Link href="/">
                                <Button variant="outline">
                                    ← Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle>📋 Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Voucher Code */}
                                <div>
                                    <form onSubmit={applyVoucher} className="space-y-2">
                                        <label className="text-sm font-medium">
                                            🎫 Voucher Code
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Enter code..."
                                                value={voucherCode}
                                                onChange={(e) => setVoucherCode(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button 
                                                type="submit" 
                                                size="sm"
                                                disabled={isApplyingVoucher || !voucherCode.trim()}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                                
                                <div className="border-t pt-4">
                                    <div className="flex justify-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Tax (8%):</span>
                                        <span>{formatPrice(total * 0.08)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Shipping:</span>
                                        <span>
                                            {total > 100 ? (
                                                <span className="text-green-600">FREE</span>
                                            ) : (
                                                formatPrice(10)
                                            )}
                                        </span>
                                    </div>
                                    
                                    <div className="border-t pt-2 mt-4">
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total:</span>
                                            <span>
                                                {formatPrice(
                                                    total + 
                                                    (total * 0.08) + 
                                                    (total > 100 ? 0 : 10)
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <Link href="/checkout">
                                    <Button size="lg" className="w-full">
                                        🚀 Proceed to Checkout
                                    </Button>
                                </Link>
                                
                                {total > 75 && total <= 100 && (
                                    <p className="text-sm text-green-600 text-center">
                                        💡 Add {formatPrice(100 - total)} more for free shipping!
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}