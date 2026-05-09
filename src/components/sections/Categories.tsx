
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export const Categories = () => {
  const db = useFirestore();
  
  const categoriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "categories");
  }, [db]);

  const { data: categories, isLoading } = useCollection(categoriesQuery);

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null; // Or show a fallback if no data
  }

  return (
    <section id="collections" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline">Shop by Category</h2>
          <div className="w-20 h-[2px] bg-accent mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.id}`} 
              className="group relative block overflow-hidden"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                {category.imageUrl && (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint="fashion apparel"
                  />
                )}
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                   <div className="border border-white/40 bg-white/10 backdrop-blur-sm px-8 py-4 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-white text-lg tracking-[0.2em] font-medium uppercase">{category.name}</span>
                  </div>
                  <p className="text-white/80 text-xs mt-4 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700 font-light italic">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center px-2">
                <span className="text-xl font-headline tracking-widest">{category.name}</span>
                <span className="text-xs text-muted-foreground tracking-widest font-semibold group-hover:text-accent transition-colors">DISCOVER</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
