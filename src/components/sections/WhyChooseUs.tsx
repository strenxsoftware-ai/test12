
"use client";

import React from "react";
import { Gem, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: <Gem className="w-8 h-8" />,
    title: "Premium Fabric",
    description: "Sourced from the finest weavers across the country, our fabrics redefine luxury comfort."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Affordable Luxury",
    description: "Experience high-end couture craftsmanship at prices that don't compromise on value."
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Fast Delivery",
    description: "Your elegance shouldn't wait. We ensure quick and secure delivery right to your doorstep."
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-6 group">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
                {feature.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-headline tracking-widest">{feature.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
