import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import toast from 'react-hot-toast';

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock wishlist data
  const mockWishlistItems: Product[] = [
    {
      id: '1',
      name: 'Premium Dog Food',
      description: 'High-quality nutrition for adult dogs',
      price: 49.99,
      originalPrice: 59.99,
      images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'],
      category: 'food',
      brand: 'PetNutrition',
      stock: 25,
      rating: 4.5,
      reviewCount: 128,
      reviews: [],
      petType: ['dog'],
      tags: ['premium', 'adult', 'nutrition'],
      specifications: { 'Weight': '15kg', 'Age': 'Adult' },
      isOnSale: true,
      isFeatured: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '3',
      name: 'Comfortable Pet Bed',
      description: 'Soft and cozy bed for small to medium pets',
      price: 39.99,
      images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400'],
      category: 'beds',
      brand: 'ComfortPet',
      stock: 8,
      rating: 4.7,
      reviewCount: 156,
      reviews: [],
      petType: ['dog', 'cat'],
      tags: ['comfort', 'washable'],
      specifications: { 'Size': 'Medium', 'Material': 'Memory Foam' },
      isOnSale: false,
      isFeatured: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch wishlist
    setTimeout(() => {
      setWishlistItems(mockWishlistItems);
      setLoading(false);
    }, 1000);
  }, []);

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    toast.success('Removed from wishlist');
  };

  const addToCartFromWishlist = (product: Product) => {
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  const moveAllToCart = () => {
    wishlistItems.forEach(product => {
      addToCart(product, 1);
    });
    setWishlistItems([]);
    toast.success('All items moved to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-gray-600">Save your favorite items for later</p>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                  </h2>
                  <p className="text-gray-600">Total value: ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
                </div>
                <button
                  onClick={moveAllToCart}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Move All to Cart
                </button>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.isOnSale && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                        SALE
                      </span>
                    )}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/products/${product.id}`} className="block mb-2">
                      <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCartFromWishlist(product)}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      
                      <Link
                        to={`/products/${product.id}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <Heart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save items you love to your wishlist and shop them later</p>
            <Link
              to="/products"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;