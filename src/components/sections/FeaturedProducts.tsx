"use client";

import React from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/shop/ProductCard";

export const FeaturedProducts = () => {
  const { products } = useShop();

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-accent tracking-[0.3em] text-xs font-bold uppercase">Our Selection</span>
            <h2 className="text-4xl md:text-5xl font-headline">Featured Pieces</h2>
          </div>
          <Link href="#collections" className="text-sm tracking-widest font-semibold border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-all">
            VIEW ALL PRODUCTS
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
