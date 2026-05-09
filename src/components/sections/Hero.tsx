
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export const Hero = () => {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-model");

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        {heroImg?.imageUrl ? (
          <Image
            src={heroImg.imageUrl}
            alt="Viloryi Premium Collection"
            fill
            priority
            className="object-cover object-center scale-110 animate-ken-burns"
            data-ai-hint="elegant fashion"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-2xl space-y-8 animate-fade-in opacity-0">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-headline font-bold text-foreground leading-[1.05] tracking-tight">
              Wear Your <br /> Elegance
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-lg leading-relaxed">
            Experience the harmony of traditional silhouettes and modern minimalism with our premium Kurti Sets & Co-ord Styles.
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row gap-5">
            <Link href="/#collections">
              <Button className="bg-primary text-primary-foreground text-xs tracking-[0.3em] rounded-none px-12 py-8 h-auto font-bold hover:bg-foreground/90 transition-all shadow-xl">
                SHOP NOW
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-foreground/20 text-foreground text-xs tracking-[0.3em] rounded-none px-12 py-8 h-auto font-bold hover:bg-foreground hover:text-background transition-all backdrop-blur-sm bg-white/5">
                OUR STORY
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] tracking-[0.4em] font-bold uppercase rotate-90 translate-y-8">SCROLL</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
};
