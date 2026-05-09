
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useShop, getEffectivePrice, getDiscountPercentage } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Maximize2,
  Heart,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
  Tag
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { Badge } from "@/components/ui/badge";

export const ProductDetails = ({ productId }: { productId: string }) => {
  const { products, addToCart } = useShop();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const product = products.find(p => p.id === productId);
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>(product?.images?.[0] || "");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [viewerZoom, setViewerZoom] = useState(1);
  
  // Refs for navigation and panning
  const viewerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchDistRef = useRef<number | null>(null);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const wishlistRef = useMemoFirebase(() => {
    if (!db || !user?.uid || !productId) return null;
    return doc(db, "users", user.uid, "wishlist", productId);
  }, [db, user?.uid, productId]);

  const { data: wishlistItem } = useDoc(wishlistRef);
  const isInWishlist = !!wishlistItem;

  const allImages = product?.images || [];
  const activeIndex = allImages.indexOf(activeImage);

  const handleNextImage = useCallback(() => {
    if (activeIndex < allImages.length - 1) {
      setActiveImage(allImages[activeIndex + 1]);
    } else {
      setActiveImage(allImages[0]);
    }
    setViewerZoom(1);
  }, [activeIndex, allImages]);

  const handlePrevImage = useCallback(() => {
    if (activeIndex > 0) {
      setActiveImage(allImages[activeIndex - 1]);
    } else {
      setActiveImage(allImages[allImages.length - 1]);
    }
    setViewerZoom(1);
  }, [activeIndex, allImages]);

  // Handle Touch/Mouse Panning & Navigation
  const handleStart = (clientX: number, clientY: number, isTouch: boolean) => {
    if (viewerZoom > 1 && viewerRef.current) {
      setIsDragging(true);
      dragStart.current = {
        x: clientX,
        y: clientY,
        scrollLeft: viewerRef.current.scrollLeft,
        scrollTop: viewerRef.current.scrollTop
      };
    } else {
      touchStartRef.current = clientX;
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging && viewerZoom > 1 && viewerRef.current) {
      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;
      viewerRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
      viewerRef.current.scrollTop = dragStart.current.scrollTop - dy;
    }
  };

  const handleEnd = (clientX: number) => {
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    if (touchStartRef.current !== null && viewerZoom === 1) {
      const touchEnd = clientX;
      const diff = touchStartRef.current - touchEnd;
      if (Math.abs(diff) > 50) {
        if (diff > 0) handleNextImage();
        else handlePrevImage();
      }
    }
    touchStartRef.current = null;
  };

  // Specialized handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].pageX, e.touches[0].pageY, true);
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      touchDistRef.current = dist;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].pageX, e.touches[0].pageY);
    } else if (e.touches.length === 2 && touchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const delta = dist / touchDistRef.current;
      setViewerZoom(prev => Math.min(Math.max(prev * delta, 1), 4));
      touchDistRef.current = dist;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1) {
      handleEnd(e.changedTouches[0].pageX);
    }
    touchDistRef.current = null;
  };

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-headline">Product not found.</h2>
        <Button variant="link" className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "A size selection is required to add this item to your bag.",
        variant: "destructive",
      });
      return;
    }
    addToCart(product, selectedSize);
  };

  const handleWishlist = () => {
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

  const handleZoomIn = () => setViewerZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setViewerZoom(prev => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setViewerZoom(1);

  const effectivePrice = getEffectivePrice(product);
  const discountPercent = getDiscountPercentage(product);
  const originalPrice = product.originalPrice || product.price;

  return (
    <section className="container mx-auto px-6 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
        
        {/* Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            className="relative aspect-[3/4] bg-muted overflow-hidden group cursor-zoom-in shadow-sm"
            onClick={() => setIsViewerOpen(true)}
          >
            {activeImage && (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="rounded-none bg-white/80 backdrop-blur-md">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
            {discountPercent > 0 && (
              <div className="absolute top-6 left-6 z-10 bg-accent text-white text-xs font-bold px-4 py-2 tracking-[0.2em] uppercase shadow-lg">
                {discountPercent}% OFF
              </div>
            )}
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={cn(
                  "relative w-20 aspect-[3/4] flex-shrink-0 bg-muted overflow-hidden transition-all duration-300",
                  activeImage === img ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <nav className="flex items-center gap-2 text-[10px] tracking-widest text-muted-foreground uppercase font-bold">
              <span>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span>Catalog</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight">
              {product.name}
            </h1>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-semibold tracking-wider text-accent">
                  ₹{effectivePrice.toLocaleString()}
                </span>
                {discountPercent > 0 && (
                  <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/60">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest flex items-center gap-2">
                  <Tag className="w-3 h-3" /> You save ₹{(originalPrice - effectivePrice).toLocaleString()} ({discountPercent}%)
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs tracking-widest font-bold uppercase">
              <span>Select Size</span>
              <span className="opacity-40">Size Guide (In Footer)</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {(product.sizes || ["XS", "S", "M", "L", "XL"]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center border text-xs font-bold transition-all",
                    selectedSize === size 
                      ? "border-primary bg-primary text-white" 
                      : "border-muted hover:border-accent hover:text-accent"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-14 bg-primary text-white rounded-none tracking-[0.2em] font-bold text-sm hover:bg-foreground/90 shadow-xl"
              >
                {product.stock === 0 ? "OUT OF STOCK" : "ADD TO BAG"}
              </Button>
              <Button 
                onClick={handleWishlist}
                className={cn(
                  "w-14 h-14 rounded-none border-none transition-colors",
                  isInWishlist ? "bg-accent text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Heart className={cn("w-5 h-5", isInWishlist && "fill-current")} />
              </Button>
            </div>
          </div>

          <div className="space-y-6 border-t pt-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details" className="border-b-muted">
                <AccordionTrigger className="text-xs tracking-widest font-bold uppercase hover:no-underline">
                  Materials & Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Fabric / Materials</span>
                      <span className="text-muted-foreground">{product.materials || "Premium Blend"}</span>
                    </div>
                    {product.details && (
                      <p className="text-xs text-muted-foreground leading-relaxed italic">
                        {product.details}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground opacity-70 leading-relaxed uppercase tracking-wider">
                      {product.description}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-b-muted">
                <AccordionTrigger className="text-xs tracking-widest font-bold uppercase hover:no-underline">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-accent" />
                    <span>Free standard shipping on orders above ₹2,999.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-4 h-4 text-accent" />
                    <span>7-day return policy for unused items with original tags.</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Full Screen Image Viewer */}
      <Dialog open={isViewerOpen} onOpenChange={(open) => {
        setIsViewerOpen(open);
        if (!open) handleResetZoom();
      }}>
        <DialogContent className="max-w-[100vw] h-[100vh] p-0 bg-black/98 border-none rounded-none flex flex-col overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{product.name} - Image Viewer</DialogTitle>
          </DialogHeader>
          
          {/* Controls Bar */}
          <div className="absolute top-6 left-0 right-0 z-[60] flex items-center justify-between px-6 pointer-events-none">
            <div className="flex items-center gap-4 pointer-events-auto">
               <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1 gap-1">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={handleZoomOut} disabled={viewerZoom <= 1}><ZoomOut className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={handleZoomIn} disabled={viewerZoom >= 4}><ZoomIn className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={handleResetZoom}><RotateCw className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 bg-white text-black hover:bg-muted pointer-events-auto" onClick={() => setIsViewerOpen(false)}><X className="w-5 h-5" /></Button>
          </div>

          {/* Navigation Arrows (Desktop) */}
          <div className="absolute inset-y-0 left-6 flex items-center z-50 pointer-events-none hidden md:flex">
             <Button variant="ghost" size="icon" onClick={handlePrevImage} className="w-12 h-12 rounded-full bg-white/5 text-white hover:bg-white/20 pointer-events-auto backdrop-blur-sm">
                <ChevronLeft className="w-6 h-6" />
             </Button>
          </div>
          <div className="absolute inset-y-0 right-6 flex items-center z-50 pointer-events-none hidden md:flex">
             <Button variant="ghost" size="icon" onClick={handleNextImage} className="w-12 h-12 rounded-full bg-white/5 text-white hover:bg-white/20 pointer-events-auto backdrop-blur-sm">
                <ChevronRight className="w-6 h-6" />
             </Button>
          </div>

          {/* Main Viewer Container */}
          <div 
            ref={viewerRef}
            className={cn(
              "w-full h-full overflow-auto scrollbar-hide flex items-center justify-center select-none",
              viewerZoom === 1 && "transition-all duration-300",
              viewerZoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            )}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={(e) => handleStart(e.pageX, e.pageY, false)}
            onMouseMove={(e) => handleMove(e.pageX, e.pageY)}
            onMouseUp={(e) => handleEnd(e.pageX)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div 
              className="flex items-center justify-center pointer-events-none"
              style={{ 
                minWidth: '100%',
                minHeight: '100%',
                width: viewerZoom > 1 ? `${100 * viewerZoom}%` : '100%',
                height: viewerZoom > 1 ? `${100 * viewerZoom}%` : '100%',
              }}
            >
              <div
                className="relative"
                style={{
                  height: `${85 * viewerZoom}vh`,
                  aspectRatio: '3/4',
                  maxWidth: '100%',
                }}
              >
                {activeImage && (
                  <Image 
                    src={activeImage} 
                    alt={product.name} 
                    fill 
                    className="object-contain" 
                    quality={100} 
                    priority
                  />
                )}
              </div>
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] tracking-[0.4em] font-bold uppercase pointer-events-none">
            {activeIndex + 1} / {allImages.length}
          </div>
        </DialogContent>
      </Dialog>

      <LoginDialog isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md p-4 border-t flex gap-4 animate-in slide-in-from-bottom duration-500">
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-bold text-sm tracking-wider">₹{effectivePrice.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{selectedSize || "Select Size"}</p>
        </div>
        <Button onClick={handleAddToCart} disabled={product.stock === 0} className="bg-primary text-white rounded-none px-8 tracking-widest text-xs font-bold py-6 h-auto">
          {product.stock === 0 ? "SOLD OUT" : "ADD TO BAG"}
        </Button>
      </div>
    </section>
  );
};
