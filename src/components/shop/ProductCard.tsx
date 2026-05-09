
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useShop, type Product, getEffectivePrice, getDiscountPercentage } from "@/context/ShopContext";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useShop();
  const { user } = useUser();
  const db = useFirestore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const wishlistRef = useMemoFirebase(() => {
    if (!db || !user?.uid || !product.id) return null;
    return doc(db, "users", user.uid, "wishlist", product.id);
  }, [db, user?.uid, product.id]);

  const { data: wishlistItem } = useDoc(wishlistRef);
  const isInWishlist = !!wishlistItem;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    const defaultSize = product.sizes?.includes("M") ? "M" : product.sizes?.[0] || "M";
    addToCart(product, defaultSize);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    if (!db || !wishlistRef) return;

    if (isInWishlist) {
      deleteDoc(wishlistRef).catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: wishlistRef.path,
          operation: 'delete'
        }));
      });
    } else {
      setDoc(wishlistRef, product).catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: wishlistRef.path,
          operation: 'create',
          requestResourceData: product
        }));
      });
    }
  };

  const mainImage = product.images?.[0] || "https://picsum.photos/seed/placeholder/600/800";
  const effectivePrice = getEffectivePrice(product);
  const discountPercent = getDiscountPercentage(product);
  const originalPrice = product.originalPrice || product.price;

  return (
    <>
      <div className={cn("group space-y-4 bg-background p-4 shadow-sm hover:shadow-xl transition-all duration-500", className)}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-accent text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
              {discountPercent}% OFF
            </div>
          )}

          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 space-y-2">
            <Button 
              onClick={handleQuickAdd}
              className="w-full bg-white text-primary rounded-none tracking-widest text-[10px] font-bold h-10 hover:bg-accent hover:text-white transition-colors border-none"
            >
              <ShoppingBag className="w-3 h-3 mr-2" />
              QUICK ADD
            </Button>
            <div className="flex gap-2">
              <Link href={`/product/${product.id}`} className="flex-1">
                <Button variant="secondary" className="w-full rounded-none h-10 bg-primary text-primary-foreground hover:bg-primary/90 border-none">
                    <Eye className="w-4 h-4" />
                </Button>
              </Link>
              <Button 
                onClick={handleWishlist}
                variant="secondary" 
                className={cn(
                  "flex-1 rounded-none h-10 transition-colors border-none",
                  isInWishlist ? "bg-accent text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                  <Heart className={cn("w-4 h-4", isInWishlist && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-1 text-center">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-lg font-headline tracking-wide hover:text-accent transition-colors cursor-pointer truncate px-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-center gap-3">
            <p className="font-bold tracking-wider text-primary">₹{effectivePrice.toLocaleString()}</p>
            {discountPercent > 0 && (
              <p className="text-xs text-muted-foreground line-through decoration-muted-foreground/60">₹{originalPrice.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>

      <LoginDialog 
        isOpen={isLoginOpen} 
        onOpenChange={setIsLoginOpen} 
        title="Elevate Your Wardrobe"
        description="Sign in to save this piece to your bag and start your luxury journey."
      />
    </>
  );
};
