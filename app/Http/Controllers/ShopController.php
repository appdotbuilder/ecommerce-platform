<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    /**
     * Display the main shop page.
     */
    public function index(Request $request)
    {
        $categories = Category::active()->get();
        
        $query = Product::with('category')
            ->published()
            ->inStock();

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Sort products
        $sort = $request->get('sort', 'name');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('name', 'asc');
                break;
        }

        $products = $query->paginate(12)->withQueryString();
        
        $featuredProducts = Product::with('category')
            ->published()
            ->featured()
            ->inStock()
            ->limit(6)
            ->get();

        return Inertia::render('shop/index', [
            'products' => $products,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search', 'sort']),
        ]);
    }

    /**
     * Display a specific product.
     */
    public function show(Product $product)
    {
        $product->load('category');
        
        // Get related products from the same category
        $relatedProducts = Product::with('category')
            ->published()
            ->inStock()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return Inertia::render('shop/product', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}