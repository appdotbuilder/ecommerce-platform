import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Welcome() {
    const features = [
        {
            icon: '🛍️',
            title: 'Browse Products',
            description: 'Explore thousands of products across multiple categories with advanced search and filtering.',
        },
        {
            icon: '🛒',
            title: 'Shopping Cart',
            description: 'Add products to your cart, manage quantities, and apply discount vouchers.',
        },
        {
            icon: '🎫',
            title: 'Voucher System',
            description: 'Use discount codes and vouchers to save money on your purchases.',
        },
        {
            icon: '💳',
            title: 'Secure Checkout',
            description: 'Multiple payment methods with secure processing and order tracking.',
        },
        {
            icon: '📦',
            title: 'Order Management',
            description: 'Track your orders from processing to delivery with real-time updates.',
        },
        {
            icon: '📊',
            title: 'Admin Dashboard',
            description: 'Comprehensive admin tools for managing products, orders, and analytics.',
        },
    ];

    const sampleProducts = [
        { name: 'Premium Headphones', price: '$199.99', category: 'Electronics' },
        { name: 'Designer T-Shirt', price: '$49.99', category: 'Clothing' },
        { name: 'Smart Home Device', price: '$299.99', category: 'Electronics' },
        { name: 'Bestseller Novel', price: '$24.99', category: 'Books' },
    ];

    return (
        <AppShell>
            <Head title="🛍️ E-Commerce Platform" />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        🛍️ Complete E-Commerce Platform
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Experience the future of online shopping with our full-featured e-commerce platform. 
                        Browse products, manage your cart, apply vouchers, and complete secure purchases with ease.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/">
                            <Button size="lg" className="text-lg px-8 py-4">
                                🛍️ Start Shopping
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                👤 Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                                ✨ Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Product Preview */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8">📦 Sample Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sampleProducts.map((product, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-4">📦</div>
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                                    <p className="text-2xl font-bold text-green-600">{product.price}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">✨ Platform Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                                    <CardTitle className="text-xl text-center">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-center">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Key Benefits */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">🚀 Why Choose Our Platform?</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">💎</span>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                                        <p className="text-gray-600">Curated selection of high-quality products from trusted brands.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">🎯</span>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                                        <p className="text-gray-600">Advanced filtering and search to find exactly what you're looking for.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">🔒</span>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
                                        <p className="text-gray-600">Bank-level security for all transactions and data protection.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">⚡</span>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
                                        <p className="text-gray-600">Quick loading times and reliable service for the best shopping experience.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg">
                            <div className="text-center">
                                <span className="text-6xl block mb-4">🛒</span>
                                <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
                                <p className="text-gray-600 mb-6">
                                    Join thousands of happy customers and start your shopping journey today!
                                </p>
                                <Link href="/">
                                    <Button size="lg" className="w-full">
                                        🛍️ Explore Products Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sample Vouchers */}
                <div className="mb-16 bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
                    <h2 className="text-3xl font-bold text-center mb-8">🎫 Available Vouchers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader className="text-center">
                                <div className="text-3xl mb-2">🎉</div>
                                <CardTitle className="text-green-700">WELCOME10</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-2xl font-bold text-green-600 mb-2">10% OFF</p>
                                <p className="text-sm text-green-700">New customer discount</p>
                                <p className="text-xs text-green-600">Min. order $50</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader className="text-center">
                                <div className="text-3xl mb-2">💰</div>
                                <CardTitle className="text-blue-700">SAVE20</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-2xl font-bold text-blue-600 mb-2">$20 OFF</p>
                                <p className="text-sm text-blue-700">Fixed discount</p>
                                <p className="text-xs text-blue-600">Min. order $100</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-purple-200 bg-purple-50">
                            <CardHeader className="text-center">
                                <div className="text-3xl mb-2">🚚</div>
                                <CardTitle className="text-purple-700">FREESHIP</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-2xl font-bold text-purple-600 mb-2">Free Shipping</p>
                                <p className="text-sm text-purple-700">No delivery fees</p>
                                <p className="text-xs text-purple-600">Min. order $75</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-gray-50 p-12 rounded-lg">
                    <h2 className="text-3xl font-bold mb-6">🚀 Ready to Transform Your Shopping Experience?</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join our platform today and discover a new way to shop online with advanced features, 
                        secure payments, and unbeatable customer service.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/register">
                            <Button size="lg" className="text-lg px-8 py-4">
                                🎯 Create Account
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                🛍️ Browse Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}