
"use client";

import React, { use, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Instagram, 
  Star,
  CheckCircle2,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function InfluencerProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const db = useFirestore();
  const { setAffiliateId } = useShop();

  // Look up user by referralUsername
  const decodedUsername = decodeURIComponent(username).replace(/^@/, '');
  
  const influencerQuery = useMemoFirebase(() => {
    if (!db || !decodedUsername) return null;
    return query(
      collection(db, "users"),
      where("referralUsername", "==", decodedUsername.toLowerCase()),
      limit(1)
    );
  }, [db, decodedUsername]);

  const { data: influencers, isLoading } = useCollection(influencerQuery);
  const influencer = influencers?.[0];

  useEffect(() => {
    if (influencer) {
      setAffiliateId(influencer.uid);
      // Small toast to acknowledge the curation
      toast({
        title: "Personal Curation Active",
        description: `Now shopping with ${influencer.referralDisplayName || influencer.displayName}'s collection.`
      });
    }
  }, [influencer, setAffiliateId]);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-accent w-10 h-10" /></div>;

  if (!influencer) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-40 text-center space-y-8">
           <h1 className="text-4xl font-headline">Profile Not Found</h1>
           <p className="text-muted-foreground italic">"This curation seems to have moved or does not exist."</p>
           <Button asChild variant="outline" className="rounded-none tracking-widest uppercase">
             <Link href="/">RETURN TO STORE</Link>
           </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Influencer Hero Landing */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/influencer-bg/1920/1080" 
            alt="Branded Collection" 
            fill 
            className="object-cover opacity-20 grayscale"
            data-ai-hint="luxury interior"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-12">
            
            <div className="space-y-6">
              <div className="relative inline-block">
                <Avatar className="w-40 h-40 border-4 border-accent/20 shadow-2xl">
                  <AvatarImage src={influencer.photoURL} alt={influencer.referralDisplayName} className="object-cover" />
                  <AvatarFallback className="text-4xl font-headline bg-muted">
                    {influencer.referralDisplayName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-accent text-white p-2 rounded-full shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-accent tracking-[0.5em] text-[10px] font-bold uppercase block">Viloryi Partner</span>
                <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-tight">
                  {influencer.referralDisplayName || influencer.displayName}
                </h1>
              </div>
            </div>

            <div className="max-w-xl space-y-6">
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed italic">
                "{influencer.referralBio || 'Explore my personally curated selection of premium Viloryi silhouettes.'}"
              </p>
              <div className="w-20 h-[1px] bg-accent mx-auto" />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button asChild className="bg-primary text-white py-8 px-16 rounded-none tracking-[0.3em] font-bold text-xs hover:bg-foreground transition-all shadow-2xl">
                <Link href="/#collections">
                  SHOP MY FAVORITES <ArrowRight className="ml-3 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-accent text-accent py-8 px-12 rounded-none tracking-[0.3em] font-bold text-xs hover:bg-accent hover:text-white transition-all">
                <Instagram className="mr-3 w-4 h-4" /> FOLLOW STORY
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40">
           <span className="text-[9px] tracking-[0.4em] font-bold uppercase">Discover Selection</span>
           <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
        </div>
      </section>

      {/* Recommended Category Section */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-accent tracking-[0.3em] text-[10px] font-bold uppercase">The Curated Edit</span>
            <h2 className="text-4xl font-headline">Recommended Silhouettes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <PromoCard 
              title="Kurti Sets" 
              img="https://picsum.photos/seed/k1/800/1000" 
              desc="Elegant tradition meets modern minimalism." 
              link="/category/kurti-sets"
            />
            <PromoCard 
              title="Co-ord Sets" 
              img="https://picsum.photos/seed/c1/800/1000" 
              desc="Seamlessly tailored for effortless sophistication." 
              link="/category/coord-sets"
            />
            <PromoCard 
              title="Daily Luxe" 
              img="https://picsum.photos/seed/d1/800/1000" 
              desc="Breathable luxury for your everyday narrative." 
              link="/category/daily-essentials"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PromoCard({ title, img, desc, link }: { title: string; img: string; desc: string; link: string }) {
  return (
    <Link href={link} className="group space-y-6 block">
      <div className="aspect-[4/5] relative overflow-hidden bg-muted">
        <Image src={img} alt={title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-headline">{title}</h3>
          <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
        </div>
        <p className="text-sm text-muted-foreground font-light italic">{desc}</p>
      </div>
    </Link>
  );
}
