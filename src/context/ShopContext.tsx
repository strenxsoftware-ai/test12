
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, Timestamp } from "firebase/firestore";

export type Product = {
  id: string;
  name: string;
  price: number; // Keep for legacy but derive effective price
  originalPrice: number;
  discountPrice?: number;
  category: string;
  images: string[];
  description: string;
  materials: string;
  details: string;
  sizes: string[];
  stock: number;
  createdAt?: Timestamp | any;
  isFeatured?: boolean;
};

type CartItem = Product & { quantity: number; selectedSize?: string };

type ShopContextType = {
  products: Product[];
  isLoading: boolean;
  cart: CartItem[];
  addToCart: (product: Product, selectedSize?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const getEffectivePrice = (product: Product | any) => {
  if (product.discountPrice !== undefined && product.discountPrice !== null && product.discountPrice > 0) {
    return product.discountPrice;
  }
  return product.originalPrice || product.price || 0;
};

export const getDiscountPercentage = (product: Product | any) => {
  const original = product.originalPrice || product.price;
  const discount = product.discountPrice;
  if (!original || !discount || discount >= original) return 0;
  return Math.round(((original - discount) / original) * 100);
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const db = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "products");
  }, [db]);

  const { data: firestoreProducts, isLoading } = useCollection<Product>(productsQuery);

  useEffect(() => {
    const savedCart = localStorage.getItem("viloryi-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("viloryi-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, selectedSize?: string) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id && item.selectedSize === selectedSize);
      if (existingItem) {
        return prev.map((item) =>
          (item.id === product.id && item.selectedSize === selectedSize) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId, size);
    setCart((prev) =>
      prev.map((item) => (item.id === productId && item.selectedSize === size ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("viloryi-cart");
  };

  const cartTotal = cart.reduce((total, item) => {
    const effectivePrice = getEffectivePrice(item);
    return total + effectivePrice * item.quantity;
  }, 0);

  return (
    <ShopContext.Provider
      value={{
        products: firestoreProducts || [],
        isLoading,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};
