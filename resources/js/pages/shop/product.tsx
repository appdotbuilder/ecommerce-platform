import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    price: number;
    sale_price: number | null;
    current_price: number;
    stock_quantity: number;
    in_stock: boolean;
    is_featured: boolean;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    images: string[] | null;
}

interface Props {
    product: Product;
    relatedProducts: Product[];
    [key: string]: unknown;
}

export default function ProductShow({ product, relatedProducts }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const addToCart = () => {
        setIsAddingToCart(true);
        router.post('/cart', { product_id: product.id, quantity }, {
            preserveState: true,
            onSuccess: () => {
                // Optionally redirect to cart or show success message
            },
            onFinish: () => {
                setIsAddingToCart(false);
            },
        });
    };

    const ProductCard = ({ product: relatedProduct }: { product: Product }) => (
        <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                </div>
                <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600">
                    <Link href={`/products/${relatedProduct.slug}`}>
                        {relatedProduct.name}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">
                        {formatPrice(relatedProduct.current_price)}
                    </span>
                    {relatedProduct.sale_price && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatPrice(relatedProduct.price)}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AppShell>
            <Head title={`${product.name} - Product Details`} />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span>→</span>
                    {product.category && (
                        <>
                            <Link 
                                href={`/?category=${product.category.slug}`}
                                className="hover:text-blue-600"
                            >
                                {product.category.name}
                            </Link>
                            <span>→</span>
                        </>
                    )}
                    <span className="text-gray-900">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-8xl">📦</span>
                        </div>
                        
                        {/* Thumbnail Gallery (placeholder) */}
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div 
                                    key={i}
                                    className="aspect-square bg-gray-50 rounded border-2 border-transparent hover:border-blue-500 cursor-pointer flex items-center justify-center"
                                >
                                    <span className="text-2xl">📦</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <div className="mb-4">
                            {product.is_featured && (
                                <Badge className="mb-2">⭐ Featured</Badge>
                            )}
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            
                            {product.category && (
                                <Link 
                                    href={`/?category=${product.category.slug}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    📂 {product.category.name}
                                </Link>
                            )}
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-bold text-green-600">
                                    {formatPrice(product.current_price)}
                                </span>
                                {product.sale_price && (
                                    <div className="text-right">
                                        <span className="text-xl text-gray-500 line-through block">
                                            {formatPrice(product.price)}
                                        </span>
                                        <Badge variant="destructive">
                                            {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-xl text-gray-600 mb-6">
                                {product.short_description}
                            </p>
                        )}

                        {/* Stock Status */}
                        <div className="mb-6">
                            {product.in_stock ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✅ In Stock</span>
                                    <span className="text-gray-600">
                                        ({product.stock_quantity} available)
                                    </span>
                                </div>
                            ) : (
                                <span className="text-red-600">❌ Out of Stock</span>
                            )}
                        </div>

                        {/* Add to Cart */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <label className="font-medium">Quantity:</label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </Button>
                                    <span className="w-12 text-center">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        disabled={quantity >= product.stock_quantity}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <Button 
                                    size="lg" 
                                    className="flex-1"
                                    onClick={addToCart}
                                    disabled={!product.in_stock || isAddingToCart}
                                >
                                    {isAddingToCart ? (
                                        '⏳ Adding...'
                                    ) : (
                                        `🛒 Add ${quantity} to Cart - ${formatPrice(product.current_price * quantity)}`
                                    )}
                                </Button>
                                <Link href="/cart">
                                    <Button variant="outline" size="lg">
                                        👁️ View Cart
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">📋 Product Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>SKU:</span>
                                    <span>PROD-{product.id.toString().padStart(6, '0')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Category:</span>
                                    <span>{product.category?.name || 'Uncategorized'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Stock:</span>
                                    <span>{product.stock_quantity} units</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">📝 Description</h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">🔗 Related Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to Shop */}
                <div className="mt-12 text-center">
                    <Link href="/">
                        <Button variant="outline" size="lg">
                            ← Back to Shop
                        </Button>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}