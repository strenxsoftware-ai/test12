
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles, CheckCircle2, Instagram, LogIn } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export default function CollaboratePage() {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "India",
    instagram: "",
    followers: "",
    message: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    if (!formData.consent) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please agree to be contacted regarding collaboration opportunities.",
      });
      return;
    }

    setLoading(true);
    try {
      // Normalize email for security rule consistency
      const normalizedData = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "collaboration"), normalizedData);
      setSubmitted(true);
      toast({
        title: "Application Received",
        description: "Thank you for reaching out! Our team will review your profile soon.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://viloryi.com" },
      { "@type": "ListItem", "position": 2, "name": "Collaborate", "item": "https://viloryi.com/collaborate" }
    ]
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-40 pb-24 px-6 text-center">
          <div className="container mx-auto max-w-2xl space-y-8 animate-fade-in">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Application Sent</h1>
            <p className="text-muted-foreground font-light text-lg">
              We've received your collaboration request. Our brand team will review your profile and get in touch with you shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild className="rounded-none tracking-widest px-12 py-7 h-auto font-bold uppercase text-xs">
                <Link href="/">BACK TO HOME</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-none tracking-widest px-12 py-7 h-auto font-bold uppercase text-xs">
                <Link href="/influencer/login">INFLUENCER LOGIN</Link>
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={breadcrumbSchema} />
      <Navbar />

      <section className="pt-40 pb-20 px-6 bg-muted/10 text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <span className="text-accent tracking-[0.4em] text-xs font-bold uppercase">Join the Vision</span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary leading-tight">
            Collaborate With Us
          </h1>
          <div className="w-20 h-[2px] bg-accent mx-auto" />
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto italic">
            "Join hands with our brand and create amazing content together."
          </p>
          <div className="pt-4">
            <Link href="/influencer/login" className="text-[10px] tracking-widest font-bold uppercase text-accent border-b border-accent pb-1 flex items-center justify-center gap-2 w-fit mx-auto hover:opacity-70 transition-opacity">
              <LogIn className="w-3 h-3" /> Already a partner? Login here
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 border border-muted shadow-sm space-y-12">
            
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-muted pb-4">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-headline font-bold uppercase tracking-widest">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Full Name *</Label>
                  <Input 
                    required 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                    placeholder="Jane Doe" 
                    className="rounded-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Email Address *</Label>
                  <Input 
                    required 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    placeholder="jane@example.com" 
                    className="rounded-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Phone Number *</Label>
                  <Input 
                    required 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    placeholder="9876543210" 
                    className="rounded-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">City</Label>
                  <Input 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})} 
                    placeholder="E.g. Delhi" 
                    className="rounded-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">State</Label>
                  <Input 
                    value={formData.state} 
                    onChange={(e) => setFormData({...formData, state: e.target.value})} 
                    placeholder="E.g. Delhi" 
                    className="rounded-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Country</Label>
                  <Input 
                    value={formData.country} 
                    onChange={(e) => setFormData({...formData, country: e.target.value})} 
                    className="rounded-none h-12"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-3 border-b border-muted pb-4">
                <Instagram className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-headline font-bold uppercase tracking-widest">Social Media Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Instagram Handle</Label>
                  <Input 
                    value={formData.instagram} 
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})} 
                    placeholder="@username" 
                    className="rounded-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Follower Count</Label>
                  <Input 
                    value={formData.followers} 
                    onChange={(e) => setFormData({...formData, followers: e.target.value})} 
                    placeholder="E.g. 10k+" 
                    className="rounded-none h-12"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Why do you want to collaborate?</Label>
                  <Textarea 
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                    placeholder="Briefly describe your content style and audience..." 
                    className="rounded-none min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-muted">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="consent" 
                  checked={formData.consent} 
                  onCheckedChange={(checked) => setFormData({...formData, consent: !!checked})} 
                  className="mt-1"
                />
                <label htmlFor="consent" className="text-xs font-medium leading-relaxed text-muted-foreground cursor-pointer">
                  I agree to be contacted regarding collaboration opportunities and share my profile information with the Viloryi brand team.
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-16 bg-primary text-white tracking-[0.3em] font-bold uppercase rounded-none hover:bg-foreground transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {loading ? "SUBMITTING..." : "APPLY FOR COLLABORATION"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
