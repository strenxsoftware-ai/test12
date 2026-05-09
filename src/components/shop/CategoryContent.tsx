
"use client";

import React, { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { useShop, getEffectivePrice } from "@/context/ShopContext";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SIZES = ["XS", "S", "M", "L", "XL"];

export const CategoryContent = ({ categorySlug }: { categorySlug: string }) => {
  const { products } = useShop();
  const db = useFirestore();
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const categoryRef = useMemoFirebase(() => {
    if (!db || !categorySlug) return null;
    return doc(db, "categories", categorySlug);
  }, [db, categorySlug]);

  const { data: category, isLoading: isCategoryLoading } = useDoc(categoryRef);

  const filteredProducts = useMemo(() => {
    // Filter by the category ID field
    let result = products.filter(p => p.category === categorySlug);

    // Filter by Price (using Effective Price)
    result = result.filter(p => {
      const effectivePrice = getEffectivePrice(p);
      return effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
    });

    // Filter by Size
    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        p.sizes?.some(size => selectedSizes.includes(size))
      );
    }

    // Sort (using Effective Price)
    result.sort((a, b) => {
      const priceA = getEffectivePrice(a);
      const priceB = getEffectivePrice(b);
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      return 0;
    });

    return result;
  }, [products, categorySlug, sortBy, priceRange, selectedSizes]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 15000]);
    setSelectedSizes([]);
  };

  if (isCategoryLoading) {
    return (
      <div className="container mx-auto px-6 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col gap-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-muted">
          <div className="space-y-2">
            <span className="text-accent tracking-[0.3em] text-xs font-bold uppercase">Collections</span>
            <h1 className="text-5xl font-headline tracking-tight text-primary">{category?.name || "Collection"}</h1>
            {category?.description && (
              <p className="text-muted-foreground text-sm font-light italic max-w-xl">
                {category.description}
              </p>
            )}
            <p className="text-muted-foreground text-[10px] tracking-widest uppercase font-bold pt-2">
              Showing {filteredProducts.length} results
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-none border-muted h-11 tracking-widest text-xs font-bold gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> FILTERS
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-background rounded-none">
                <SheetHeader className="border-b pb-6 mb-8">
                  <SheetTitle className="text-2xl font-headline tracking-widest uppercase text-primary">Filters</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-12">
                  {/* Price Filter */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs tracking-[0.2em] font-bold uppercase">Price Range</h4>
                      <span className="text-xs font-medium">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                    </div>
                    <Slider
                      defaultValue={[0, 15000]}
                      max={15000}
                      step={500}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="py-4"
                    />
                  </div>

                  {/* Size Filter */}
                  <div className="space-y-6">
                    <h4 className="text-xs tracking-[0.2em] font-bold uppercase">Select Size</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {SIZES.map(size => (
                        <div key={size} className="flex items-center space-x-3">
                          <Checkbox 
                            id={`size-${size}`} 
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={() => toggleSize(size)}
                            className="rounded-none border-muted"
                          />
                          <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">{size}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t space-y-4">
                    <Button 
                      onClick={clearFilters}
                      variant="ghost" 
                      className="w-full rounded-none tracking-widest text-xs h-12"
                    >
                      CLEAR ALL
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] rounded-none border-muted h-11 focus:ring-0">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-muted">
                <SelectItem value="newest" className="rounded-none">Newest Arrivals</SelectItem>
                <SelectItem value="price-low" className="rounded-none">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="rounded-none">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4">
            <h3 className="text-2xl font-headline italic">No pieces found in this collection matching filters.</h3>
            <Button onClick={clearFilters} variant="link" className="tracking-widest text-xs uppercase font-bold opacity-60">
              RESET FILTERS
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
