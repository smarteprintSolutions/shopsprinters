'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  _id: string;
  title?: string;
  name?: string;
  price: number;
  images?: string[];
  quantity: number;
  [key: string]: any;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('cart');
      if (localData) {
        setCart(JSON.parse(localData));
      }
    }
  }, []);

  // Sync cart with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Sync cart when user logs in/out
  useEffect(() => {
    if (isAuthenticated && user?.cart) {
      if (user.cart.length > 0) {
        setCart(user.cart);
      }
    } else if (!isAuthenticated) {
      setCart([]);
    }
  }, [isAuthenticated, user]);

  // Save cart to DB when it changes (only for logged in users)
  useEffect(() => {
    const saveCart = async () => {
      if (isAuthenticated && user?.token) {
        try {
          await fetch('/api/auth/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ cartItems: cart }),
          });
        } catch (error) {
          console.error('Failed to save cart to DB:', error);
        }
      }
    };

    const timeoutId = setTimeout(saveCart, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart, isAuthenticated, user]);

  const addToCart = (product: any, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
