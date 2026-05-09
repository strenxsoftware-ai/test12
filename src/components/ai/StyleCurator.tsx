
"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { aiStyleCuratorSuggestions, type AIStyleCuratorSuggestionsOutput } from "@/ai/flows/ai-style-curator-suggestions";
import { useShop } from "@/context/ShopContext";

export const StyleCurator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIStyleCuratorSuggestionsOutput | null>(null);
  const [formData, setFormData] = useState({
    stylePreference: "",
    occasion: "",
    currentWardrobeDescription: "",
  });

  const handleCurate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const suggestions = await aiStyleCuratorSuggestions(formData);
      setResult(suggestions);
    } catch (error) {
      console.error("Failed to fetch styling suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-accent text-accent hover:bg-accent hover:text-white rounded-none px-6 tracking-widest font-medium"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI STYLE CURATOR</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-background p-0 rounded-none border-none">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-3xl font-headline tracking-widest text-primary">Your Personal Stylist</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            Let our AI curator find the perfect Viloryi pieces based on your unique style and needs.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <form onSubmit={handleCurate} className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stylePreference" className="text-xs tracking-widest font-semibold uppercase">Style Preference</Label>
              <Input
                id="stylePreference"
                placeholder="e.g., Minimalist, Boho, Classic..."
                className="rounded-none border-muted focus:border-accent ring-0 focus-visible:ring-0"
                value={formData.stylePreference}
                onChange={(e) => setFormData({ ...formData, stylePreference: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasion" className="text-xs tracking-widest font-semibold uppercase">What's the Occasion?</Label>
              <Input
                id="occasion"
                placeholder="e.g., Summer Wedding, Office Wear..."
                className="rounded-none border-muted focus:border-accent ring-0 focus-visible:ring-0"
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wardrobe" className="text-xs tracking-widest font-semibold uppercase">Wardrobe Context (Optional)</Label>
              <Textarea
                id="wardrobe"
                placeholder="Tell us what you usually like or want to avoid..."
                className="rounded-none border-muted focus:border-accent ring-0 focus-visible:ring-0 min-h-[100px]"
                value={formData.currentWardrobeDescription}
                onChange={(e) => setFormData({ ...formData, currentWardrobeDescription: e.target.value })}
              />
            </div>
            <Button
              disabled={loading}
              className="w-full bg-primary text-white py-6 tracking-[0.2em] rounded-none font-bold text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  CURATING YOUR STYLE...
                </>
              ) : (
                "CURATE MY LOOK"
              )}
            </Button>
          </form>
        ) : (
          <div className="p-8 space-y-8 animate-fade-in">
            <h4 className="text-lg font-headline border-b border-accent/20 pb-2">Stylist Recommendations</h4>
            <div className="space-y-6">
              {result.suggestions.map((suggestion, idx) => (
                <div key={idx} className="space-y-3 bg-muted/30 p-4 border-l-2 border-accent">
                  <h5 className="font-bold tracking-tight text-primary uppercase text-sm">{suggestion.title}</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{suggestion.reasoning}"</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {suggestion.items.map((item, i) => (
                      <span key={i} className="text-[10px] bg-white border border-accent/20 px-2 py-1 tracking-wider uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 text-accent" /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setResult(null)}
                variant="outline"
                className="rounded-none tracking-widest text-xs py-5"
              >
                START OVER
              </Button>
              <Button
                onClick={() => setResult(null)}
                className="bg-accent text-white rounded-none tracking-widest text-xs py-5"
              >
                BROWSE SUGGESTED STYLES
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
