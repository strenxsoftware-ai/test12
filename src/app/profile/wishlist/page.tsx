"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  ShoppingBag, 
  ChevronLeft,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";

export default function WishlistPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const wishlistQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, "users", user.uid, "wishlist");
  }, [db, user?.uid]);

  const { data: wishlist, isLoading: isWishlistLoading } = useCollection(wishlistQuery);

  if (isUserLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <span className="text-accent tracking-[0.4em] text-[10px] font-bold uppercase">Saved for Later</span>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">My Wishlist</h1>
            </div>
            <Link href="/profile">
              <Button variant="ghost" className="text-[10px] tracking-widest font-bold uppercase gap-2 p-0 h-auto hover:bg-transparent hover:text-accent">
                <ChevronLeft className="w-4 h-4" /> Back to Profile
              </Button>
            </Link>
          </div>

          {isWishlistLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
              ))}
            </div>
          ) : !wishlist || wishlist.length === 0 ? (
            <div className="text-center py-24 bg-muted/20 border border-dashed border-muted rounded-none space-y-6">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/20" />
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold">Your wishlist is empty</h3>
                <p className="text-muted-foreground font-light text-sm italic">"Save your favorite silhouettes here to shop later."</p>
              </div>
              <Link href="/#collections">
                <Button className="rounded-none tracking-widest uppercase font-bold text-xs px-12 py-6">
                  BROWSE COLLECTIONS
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 animate-fade-in">
              {wishlist.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-16 pt-12 border-t border-muted text-center space-y-6">
            <h3 className="text-xl font-headline font-bold">Looking for styling advice?</h3>
            <p className="text-muted-foreground text-sm font-light italic">"Our AI Style Curator can help you build the perfect look from your wishlist items."</p>
            <Link href="/">
              <Button variant="outline" className="rounded-none tracking-widest uppercase font-bold text-[10px] px-12 py-6 border-muted hover:border-accent">
                TRY AI CURATOR
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
