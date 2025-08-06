import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    price: number;
    sale_price: number | null;
    current_price: number;
    is_featured: boolean;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    images: string[] | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PaginationLinks {
    data: Product[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    products: PaginationLinks;
    featuredProducts: Product[];
    categories: Category[];
    filters: {
        category?: string;
        search?: string;
        sort?: string;
    };
    [key: string]: unknown;
}

export default function ShopIndex({ products, featuredProducts, categories, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [cartItems, setCartItems] = useState<Record<number, number>>({});

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { ...filters, search: searchTerm }, { preserveState: true });
    };

    const handleCategoryFilter = (category: string) => {
        router.get('/', { ...filters, category }, { preserveState: true });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get('/', { ...filters, sort: e.target.value }, { preserveState: true });
    };

    const addToCart = (productId: number, quantity: number = 1) => {
        router.post('/cart', { product_id: productId, quantity }, {
            preserveState: true,
            onSuccess: () => {
                setCartItems(prev => ({ ...prev, [productId]: quantity }));
            }
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                </div>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600">
                        <Link href={`/products/${product.slug}`}>
                            {product.name}
                        </Link>
                    </CardTitle>
                    {product.is_featured && (
                        <Badge variant="secondary" className="ml-2">⭐ Featured</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {product.short_description}
                </p>
                {product.category && (
                    <Badge variant="outline" className="mb-4">
                        {product.category.name}
                    </Badge>
                )}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                        {formatPrice(product.current_price)}
                    </span>
                    {product.sale_price && (
                        <span className="text-lg text-gray-500 line-through">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button 
                    onClick={() => addToCart(product.id)}
                    className="w-full"
                    disabled={cartItems[product.id] > 0}
                >
                    {cartItems[product.id] > 0 ? '✓ Added to Cart' : '🛒 Add to Cart'}
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <AppShell>
            <Head title="🛍️ E-Commerce Store" />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">🛍️ Welcome to Our Store</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Discover amazing products at unbeatable prices
                    </p>
                </div>

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">⭐ Featured Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                            <Input
                                type="text"
                                placeholder="🔍 Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit">Search</Button>
                        </form>

                        {/* Category Filter */}
                        <select
                            value={filters.category || ''}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">📂 All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={filters.sort || 'name'}
                            onChange={handleSortChange}
                            className="h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="name">📊 Name A-Z</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>

                    {/* Active Filters */}
                    {(filters.category || filters.search) && (
                        <div className="flex gap-2 mt-4">
                            {filters.search && (
                                <Badge variant="secondary">
                                    🔍 "{filters.search}"
                                    <button
                                        onClick={() => router.get('/', { ...filters, search: undefined })}
                                        className="ml-2 hover:text-red-600"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {filters.category && (
                                <Badge variant="secondary">
                                    📂 {categories.find(c => c.slug === filters.category)?.name}
                                    <button
                                        onClick={() => router.get('/', { ...filters, category: undefined })}
                                        className="ml-2 hover:text-red-600"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">
                        🛍️ All Products ({products.data.length} items)
                    </h2>
                    
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 block">😕</span>
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-gray-600">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {products.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {products.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="fixed bottom-6 right-6 flex flex-col gap-3">
                    <Link href="/cart">
                        <Button size="lg" className="rounded-full shadow-lg">
                            🛒 Cart
                        </Button>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}