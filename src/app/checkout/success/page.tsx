
"use client";

import React, { useEffect, Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const { clearCart } = useShop();
  const searchParams = useSearchParams();
  const orderNum = searchParams.get("num") || "001";

  useEffect(() => {
    // Clear cart on successful order landing
    if (clearCart) clearCart();
  }, [clearCart]);

  return (
    <section className="pt-40 pb-24 px-6">
      <div className="container mx-auto max-w-2xl text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Order Confirmed</h1>
          <p className="text-muted-foreground font-light text-lg">
            Thank you for choosing Viloryi. Your elegant pieces are being prepared for dispatch.
          </p>
        </div>
        
        <div className="bg-muted/30 p-8 border border-muted space-y-6 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Order Number</span>
            <span className="font-bold">#VL-{orderNum}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Estimated Delivery</span>
            <span className="font-bold">3-5 Business Days</span>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground italic text-center">
            A confirmation email has been sent to your registered address with tracking details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            asChild
            variant="outline" 
            className="flex-1 rounded-none tracking-widest py-7 h-auto font-bold uppercase text-xs"
          >
            <Link href="/">
              Back to Home
            </Link>
          </Button>
          <Button 
            asChild
            className="flex-1 bg-primary text-white rounded-none tracking-widest py-7 h-auto font-bold uppercase text-xs"
          >
            <Link href="/#collections">
              Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}

function Separator() {
  return <div className="h-[1px] w-full bg-muted" />;
}
