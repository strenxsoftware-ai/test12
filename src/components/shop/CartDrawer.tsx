
"use client";

import React from "react";
import { useShop, getEffectivePrice } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, setIsCartOpen } = useShop();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <SheetHeader className="sr-only">
          <SheetTitle>Your Shopping Bag</SheetTitle>
        </SheetHeader>
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-20" />
        </div>
        <h3 className="text-xl font-headline mb-2">Your Bag is Empty</h3>
        <p className="text-muted-foreground text-sm mb-8">Items added to your bag will appear here.</p>
        <Button onClick={() => setIsCartOpen(false)} variant="outline" className="tracking-widest rounded-none border-foreground hover:bg-foreground hover:text-background transition-all">
          START SHOPPING
        </Button>
      </div>
    );
  }

  return (
    <>
      <SheetHeader className="p-6 border-b flex flex-row items-center justify-between space-y-0">
        <SheetTitle className="text-xl font-headline font-semibold tracking-widest uppercase">Your Shopping Bag</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {cart.map((item) => {
          const displayImage = item.images?.[0] || "https://picsum.photos/seed/placeholder/600/800";
          const effectivePrice = getEffectivePrice(item);
          
          return (
            <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
              <Link 
                href={`/product/${item.id}`} 
                onClick={() => setIsCartOpen(false)}
                className="relative w-24 h-32 flex-shrink-0 bg-muted overflow-hidden hover:opacity-90 transition-opacity"
              >
                <Image
                  src={displayImage}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <Link 
                      href={`/product/${item.id}`} 
                      onClick={() => setIsCartOpen(false)}
                      className="hover:text-accent transition-colors"
                    >
                      <h4 className="font-medium text-sm tracking-tight">{item.name}</h4>
                    </Link>
                    <button onClick={() => removeFromCart(item.id, item.selectedSize)}>
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.category} {item.selectedSize && `• Size: ${item.selectedSize}`}
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-muted-foreground/20 px-2 py-1 gap-4">
                    <button onClick={() => updateQuantity(item.id, item.selectedSize || "M", item.quantity - 1)} className="hover:text-accent">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.selectedSize || "M", item.quantity + 1)} className="hover:text-accent">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold tracking-wide">₹{effectivePrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-6 bg-muted/30 border-t space-y-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm tracking-widest font-medium">SUBTOTAL</span>
          <span className="text-lg font-bold">₹{cartTotal.toLocaleString()}</span>
        </div>
        <p className="text-xs text-muted-foreground text-center">Taxes and shipping calculated at checkout.</p>
        <Link href="/checkout" className="w-full" onClick={() => setIsCartOpen(false)}>
          <Button className="w-full bg-primary text-primary-foreground py-6 tracking-[0.2em] rounded-none hover:bg-foreground/90 transition-all font-semibold">
            PROCEED TO CHECKOUT
          </Button>
        </Link>
      </div>
    </>
  );
};
