
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { 
  User, 
  Settings, 
  Package, 
  Heart, 
  MapPin, 
  LogOut, 
  Camera,
  ChevronRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);

  const handleLogout = async () => {
    if (!auth) return;
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      toast({
        title: "Signed out successfully",
        description: "We hope to see you back soon at Viloryi.",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const resizeImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !userRef) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: "destructive", title: "Invalid File", description: "Please select an image file." });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const rawBase64 = event.target?.result as string;
      
      try {
        const optimizedBase64 = await resizeImage(rawBase64);
        
        // We only update Firestore because Firebase Auth's photoURL has a strict length limit
        // which Base64 data strings often exceed.
        await updateDoc(userRef, { photoURL: optimizedBase64 });
        
        toast({ title: "Profile Updated", description: "Your profile picture has been changed." });
      } catch (error: any) {
        console.error("Profile update error:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: { photoURL: 'image_data_updated' }
        }));
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to read file." });
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  if (isUserLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-muted" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const profileSections = [
    {
      title: "Your Preferences",
      icon: <Sparkles className="w-5 h-5" />,
      description: "Customize your style and fit details",
      href: "/profile/preferences",
    },
    {
      title: "My Orders",
      icon: <Package className="w-5 h-5" />,
      description: "Track and view your order history",
      href: "/profile/orders",
    },
    {
      title: "Wishlist",
      icon: <Heart className="w-5 h-5" />,
      description: "View your saved elegant pieces",
      href: "/profile/wishlist",
    },
    {
      title: "Manage Account & Address",
      icon: <MapPin className="w-5 h-5" />,
      description: "Update your delivery and contact details",
      href: "/profile/address",
    },
  ];

  const displayPhotoURL = userData?.photoURL || user.photoURL || "";

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16 animate-fade-in">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-2 border-muted overflow-hidden">
                <AvatarImage src={displayPhotoURL} alt={userData?.displayName || user.displayName || "User"} className="object-cover" />
                <AvatarFallback className="text-3xl font-headline bg-muted">
                  {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-accent" /> : (userData?.displayName || user.displayName)?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-background hover:bg-accent transition-colors disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-4xl font-headline font-bold text-primary">{userData?.displayName || user.displayName}</h1>
              <p className="text-muted-foreground font-light">{userData?.email || user.email || userData?.mobile || "Premium Member"}</p>
              <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold tracking-widest uppercase mt-2">
                Premium Member
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {profileSections.map((section, idx) => (
              <Link key={idx} href={section.href}>
                <Card className="rounded-none border-muted hover:border-accent transition-all group overflow-hidden">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-muted flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                        {section.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest">{section.title}</h3>
                        <p className="text-xs text-muted-foreground font-light">{section.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-muted animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="w-full md:w-auto min-w-[200px] rounded-none py-8 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 tracking-[0.2em] font-bold uppercase text-xs gap-3"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? "LOGGING OUT..." : "LOG OUT"}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
