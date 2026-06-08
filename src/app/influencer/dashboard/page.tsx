
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, addDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Gift, 
  TrendingUp, 
  LogOut,
  Loader2,
  Plus,
  Copy,
  ExternalLink,
  Settings,
  Share2,
  Link2,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { useShop } from "@/context/ShopContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function InfluencerDashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { products } = useShop();

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [generatedLink, setGeneratedLink] = useState("");

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: influencerProfile } = useDoc(userRef);

  // Fetch categories
  const categoriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "categories");
  }, [db]);
  const { data: categories } = useCollection(categoriesQuery);

  // Fetch commissions
  const commissionsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, "commissions"),
      where("influencerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [db, user?.uid]);
  const { data: commissions } = useCollection(commissionsQuery);

  // Fetch saved links
  const linksQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, "users", user.uid, "links"),
      orderBy("createdAt", "desc")
    );
  }, [db, user?.uid]);
  const { data: savedLinks } = useCollection(linksQuery);

  const totalCredits = useMemo(() => {
    if (!commissions) return 0;
    return commissions.reduce((sum, comm) => sum + (comm.amount || 0), 0);
  }, [commissions]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/influencer/login");
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({ title: "Signed out", description: "See you soon!" });
    router.push("/");
  };

  const handleGenerateLink = async () => {
    if (!user || !db) return;

    if (!influencerProfile?.referralUsername) {
      toast({ 
        variant: "destructive", 
        title: "Handle Required", 
        description: "Please set a referral handle in settings before creating links." 
      });
      return;
    }

    setIsGenerating(true);
    const baseUrl = window.location.origin;
    const handle = influencerProfile.referralUsername;
    
    let path = "";
    let type = "profile";
    let targetName = "Main Storefront";

    if (selectedProduct) {
      path = `/product/${selectedProduct.id}`;
      type = "product";
      targetName = selectedProduct.name;
    } else if (selectedCategoryId) {
      path = `/category/${selectedCategoryId}`;
      type = "category";
      targetName = categories?.find(c => c.id === selectedCategoryId)?.name || "Category";
    }
    
    const finalLink = `${baseUrl}/@${handle}${path}`;
    setGeneratedLink(finalLink);

    // Save link to Firestore subcollection
    try {
      const linksRef = collection(db, "users", user.uid, "links");
      await addDoc(linksRef, {
        url: finalLink,
        targetName,
        type,
        createdAt: serverTimestamp()
      });
      toast({ title: "Link Saved", description: "Your branded link is now in your history." });
    } catch (error) {
      console.error("Error saving link:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Link Copied", description: "Share this with your followers!" });
  };

  const handleDeleteLink = (linkId: string) => {
    if (!db || !user?.uid) return;
    const linkDoc = doc(db, "users", user.uid, "links", linkId);
    deleteDocumentNonBlocking(linkDoc);
    toast({ title: "Link Removed", description: "The link has been removed from your history." });
  };

  if (isUserLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-accent w-10 h-10" /></div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="space-y-4">
              <span className="text-accent tracking-[0.4em] text-[10px] font-bold uppercase">Partner Portal</span>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Welcome, {influencerProfile?.referralDisplayName || influencerProfile?.displayName || "Partner"}</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/influencer/settings">
                <Button variant="outline" className="rounded-none tracking-widest uppercase font-bold text-[10px] h-12 border-muted">
                  <Settings className="w-4 h-4 mr-2" /> PROFILE SETTINGS
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="rounded-none tracking-widest uppercase font-bold text-[10px] h-12 border-muted hover:border-red-200 hover:text-red-500"
              >
                <LogOut className="w-4 h-4 mr-2" /> LOG OUT
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <StatsCard title="Brand Credits" value={`₹${totalCredits.toLocaleString()}`} icon={<Gift className="text-accent" />} />
            
            <Dialog open={isGeneratorOpen} onOpenChange={(open) => {
              setIsGeneratorOpen(open);
              if (!open) {
                setGeneratedLink("");
                setSelectedProduct(null);
                setSelectedCategoryId(null);
              }
            }}>
              <DialogTrigger asChild>
                <Card className="rounded-none border-accent border-2 shadow-none bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors group">
                  <CardContent className="p-8 flex items-center justify-between h-full">
                    <div className="space-y-1">
                      <p className="text-[10px] tracking-widest font-bold uppercase text-accent">Affiliate Program</p>
                      <p className="text-2xl font-headline font-bold text-primary">Create Branded Link</p>
                    </div>
                    <div className="w-12 h-12 bg-accent text-white flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="rounded-none max-w-md bg-background border-none p-0 overflow-hidden">
                <DialogHeader className="p-8 pb-0 bg-primary text-primary-foreground">
                  <DialogTitle className="text-2xl font-headline tracking-widest uppercase mb-4">Generate Referral Link</DialogTitle>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">1. Select Category (Optional)</label>
                      <Select onValueChange={(v) => { setSelectedCategoryId(v); setSelectedProduct(null); }}>
                        <SelectTrigger className="rounded-none h-12 border-muted focus:ring-0">
                          <SelectValue placeholder="All Categories (Main Link)" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="none">Storefront Landing</SelectItem>
                          {categories?.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCategoryId && selectedCategoryId !== "none" && (
                      <div className="space-y-2 animate-fade-in">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">2. Pick Product (Optional)</label>
                        <Select onValueChange={(v) => setSelectedProduct(products.find(p => p.id === v))}>
                          <SelectTrigger className="rounded-none h-12 border-muted focus:ring-0">
                            <SelectValue placeholder="All products in category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none">
                            <SelectItem value="none">Entire Collection</SelectItem>
                            {products.filter(p => p.category === selectedCategoryId).map((prod: any) => (
                              <SelectItem key={prod.id} value={prod.id}>{prod.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {!generatedLink && (
                    <Button 
                      disabled={isGenerating}
                      onClick={handleGenerateLink} 
                      className="w-full h-14 rounded-none bg-primary tracking-widest font-bold uppercase text-xs"
                    >
                      {isGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
                      {isGenerating ? "GENERATING..." : "GENERATE BRANDED LINK"}
                    </Button>
                  )}

                  {generatedLink && (
                    <div className="space-y-4 pt-4 border-t border-muted animate-fade-in">
                      <div className="p-4 bg-muted/30 border border-muted text-[10px] font-mono break-all leading-relaxed">
                        {generatedLink}
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => copyToClipboard(generatedLink)} variant="outline" className="flex-1 rounded-none h-12 tracking-widest text-[10px] font-bold">
                          <Copy className="w-3.5 h-3.5 mr-2" /> COPY
                        </Button>
                        <Button asChild className="flex-1 rounded-none h-12 bg-accent tracking-widest text-[10px] font-bold">
                          <a href={generatedLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5 mr-2" /> PREVIEW
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!influencerProfile?.referralUsername && (
                    <p className="text-[9px] text-red-500 italic text-center uppercase tracking-wider mt-2">
                      Critical: Set a custom handle in settings first!
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <StatsCard title="Total Referrals" value={`${commissions?.length || 0}`} icon={<TrendingUp className="text-accent" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Link History */}
            <div className="lg:col-span-8">
              <Card className="rounded-none border-muted shadow-none bg-white h-full">
                <CardHeader className="border-b px-8 py-6 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-3 text-primary">
                    <Link2 className="w-4 h-4 text-accent" /> Generated Link History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {!savedLinks || savedLinks.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                      <Link2 className="w-12 h-12 mx-auto text-muted-foreground/20" />
                      <p className="text-sm text-muted-foreground font-light italic">"No links created yet. Start curation using the button above."</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-muted max-h-[600px] overflow-y-auto custom-scrollbar">
                      {savedLinks.map((link: any) => (
                        <div key={link.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:bg-muted/5 transition-colors group">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold uppercase tracking-tight">{link.targetName}</h4>
                            <p className="text-[9px] text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-xs">{link.url}</p>
                            <div className="flex items-center gap-2 pt-1">
                              <Badge variant="secondary" className="rounded-none text-[8px] tracking-widest uppercase py-0 px-2 h-4">{link.type}</Badge>
                              <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
                                {link.createdAt?.seconds ? new Date(link.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-none hover:text-accent" onClick={() => copyToClipboard(link.url)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button asChild size="icon" variant="ghost" className="h-9 w-9 rounded-none hover:text-accent">
                              <a href={link.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /></a>
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-none hover:text-destructive" onClick={() => handleDeleteLink(link.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Earnings Sidebar */}
            <div className="lg:col-span-4">
              <Card className="rounded-none border-muted shadow-none bg-white">
                <CardHeader className="border-b px-8 py-6">
                  <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-3 text-primary">
                    <TrendingUp className="w-4 h-4 text-accent" /> Recent Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {!commissions || commissions.length === 0 ? (
                    <div className="p-12 text-center space-y-4">
                      <p className="text-xs text-muted-foreground font-light italic">"Awaiting first conversion..."</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-muted">
                      {commissions.slice(0, 5).map((comm: any) => (
                        <div key={comm.id} className="p-6 space-y-2 hover:bg-muted/5 transition-colors">
                          <div className="flex justify-between items-start">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest">Order Reward</h4>
                            <p className="text-sm font-bold text-green-600">+ ₹{comm.amount?.toLocaleString()}</p>
                          </div>
                          <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">
                            {comm.createdAt?.seconds ? new Date(comm.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}
                          </p>
                        </div>
                      ))}
                      {commissions.length > 5 && (
                        <div className="p-4 text-center">
                           <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Showing last 5 of {commissions.length} sales</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StatsCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="rounded-none border-muted shadow-none bg-white">
      <CardContent className="p-8 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] tracking-widest font-bold uppercase opacity-50">{title}</p>
          <p className="text-3xl font-headline font-bold text-primary">{value}</p>
        </div>
        <div className="w-14 h-14 bg-muted flex items-center justify-center rounded-full">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
