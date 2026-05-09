
"use client";

import React from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const instaImages = [
  PlaceHolderImages.find(img => img.id === "insta-1")?.imageUrl,
  PlaceHolderImages.find(img => img.id === "insta-2")?.imageUrl,
  PlaceHolderImages.find(img => img.id === "insta-3")?.imageUrl,
  PlaceHolderImages.find(img => img.id === "insta-4")?.imageUrl,
  PlaceHolderImages.find(img => img.id === "hero-model")?.imageUrl,
  PlaceHolderImages.find(img => img.id === "category-kurti-sets")?.imageUrl,
].filter(Boolean) as string[];

export const InstagramFeed = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <Instagram className="w-8 h-8 mx-auto text-accent mb-4" />
          <h2 className="text-4xl font-headline tracking-widest">Follow Our Story</h2>
          <p className="text-muted-foreground tracking-widest text-xs uppercase font-semibold">@viloryi.official</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {instaImages.map((img, idx) => (
            <div key={idx} className="group relative aspect-square bg-muted overflow-hidden">
              <Image
                src={img}
                alt={`Instagram feed ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="text-white w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
