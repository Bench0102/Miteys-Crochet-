import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartContextType, Product, ProductVariant } from '../types';
import toast from 'react-hot-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever items change
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number, variant?: ProductVariant) => {
    const existingItemIndex = items.findIndex(
      item => item.product.id === product.id && 
      item.selectedVariant?.id === variant?.id
    );

    if (existingItemIndex > -1) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
      toast.success('Cart updated!');
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
        product,
        quantity,
        selectedVariant: variant,
        addedAt: new Date().toISOString()
      };
      setItems([...items, newItem]);
      toast.success('Added to cart!');
    }
  };

  const removeFromCart = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.selectedVariant 
        ? item.product.price + item.selectedVariant.priceModifier 
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};