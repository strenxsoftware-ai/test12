
"use client";

import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  {
    name: "Ayesha Khan",
    text: "The quality of the kurti set I received is beyond amazing. The silk feels so premium and the fit is absolutely perfect for my evening dinner.",
    rating: 5
  },
  {
    name: "Priya Sharma",
    text: "Minimalism at its best. Viloryi's co-ord sets are my new work-from-anywhere uniform. Super breathable and very chic.",
    rating: 5
  },
  {
    name: "Rhea Kapoor",
    text: "Fastest delivery I've ever experienced for premium ethnic wear. The packaging was also so elegant, felt like a gift to myself.",
    rating: 4
  },
  {
    name: "Sanya Malhotra",
    text: "I love the clean aesthetic. It's hard to find traditional wear that feels this modern and fresh. Will definitely be ordering more.",
    rating: 5
  }
];

export const Reviews = () => {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-accent tracking-[0.3em] text-xs font-bold uppercase">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-headline">What Our Clients Say</h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {reviews.map((review, idx) => (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3 p-4">
                <Card className="bg-background border-none shadow-sm rounded-none h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-10 flex flex-col justify-between h-full space-y-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                      ))}
                    </div>
                    <p className="text-sm font-light italic leading-relaxed text-muted-foreground flex-1">
                      "{review.text}"
                    </p>
                    <div className="pt-4 border-t border-muted/50">
                      <p className="text-xs tracking-[0.2em] font-bold uppercase">{review.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -translate-x-12 border-none bg-transparent hover:bg-muted" />
            <CarouselNext className="right-0 translate-x-12 border-none bg-transparent hover:bg-muted" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};
