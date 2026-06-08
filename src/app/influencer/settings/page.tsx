
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Sparkles, 
  Loader2, 
  Camera, 
  Check, 
  X,
  User,
  AtSign,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

export default function InfluencerSettingsPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const [formData, setFormData] = useState({
    referralUsername: "",
    referralDisplayName: "",
    referralBio: "",
    photoURL: ""
  });

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: influencerProfile } = useDoc(userRef);

  useEffect(() => {
    if (influencerProfile) {
      setFormData({
        referralUsername: influencerProfile.referralUsername || "",
        referralDisplayName: influencerProfile.referralDisplayName || influencerProfile.displayName || "",
        referralBio: influencerProfile.referralBio || "",
        photoURL: influencerProfile.photoURL || ""
      });
    }
  }, [influencerProfile]);

  useEffect(() => {
    const checkUsername = async () => {
      if (!db || !formData.referralUsername || formData.referralUsername.length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      if (formData.referralUsername === influencerProfile?.referralUsername) {
        setIsUsernameAvailable(true);
        return;
      }

      setIsCheckingUsername(true);
      const q = query(collection(db, "users"), where("referralUsername", "==", formData.referralUsername.toLowerCase().trim()));
      const snap = await getDocs(q);
      setIsUsernameAvailable(snap.empty);
      setIsCheckingUsername(false);
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [formData.referralUsername, db, influencerProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userRef) return;

    if (isUsernameAvailable === false) {
      toast({ variant: "destructive", title: "Username Taken", description: "Please choose another referral handle." });
      return;
    }

    setLoading(true);
    const updateData = {
      ...formData,
      referralUsername: formData.referralUsername.toLowerCase().trim()
    };

    updateDoc(userRef, updateData)
      .then(() => {
        setLoading(false);
        toast({ title: "Settings Updated", description: "Your branded profile is ready!" });
        router.push("/influencer/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updateData
        }));
      });
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
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } }
        else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const optimized = await resizeImage(event.target?.result as string);
      setFormData({ ...formData, photoURL: optimized });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  if (isUserLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-accent w-10 h-10" /></div>;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-headline font-bold text-primary">Branded Profile Settings</h1>
            <Button variant="ghost" onClick={() => router.back()} className="text-[10px] tracking-widest font-bold uppercase gap-2 p-0 hover:bg-transparent hover:text-accent">
              <ChevronLeft className="w-4 h-4" /> Dashboard
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-10 bg-white p-8 md:p-12 border border-muted shadow-sm">
            
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-6 pb-6 border-b border-muted">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-2 border-muted overflow-hidden">
                  <AvatarImage src={formData.photoURL} alt="Influencer" className="object-cover" />
                  <AvatarFallback className="text-3xl font-headline bg-muted">
                    {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-accent" /> : <User className="w-12 h-12 text-muted-foreground" />}
                  </AvatarFallback>
                </Avatar>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full border-2 border-background hover:bg-accent transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-muted-foreground">Profile Picture for Landing Page</p>
            </div>

            {/* Branded Handle */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <AtSign className="w-4 h-4 text-accent" />
                <Label className="text-[10px] tracking-widest font-bold uppercase">Referral Handle (Unique)</Label>
              </div>
              <div className="relative">
                <Input 
                  required
                  placeholder="e.g. prince" 
                  value={formData.referralUsername}
                  onChange={(e) => setFormData({...formData, referralUsername: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '')})}
                  className="rounded-none h-14 pl-12 text-lg font-medium"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">@</div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isCheckingUsername ? <Loader2 className="w-4 h-4 animate-spin text-accent" /> : 
                   isUsernameAvailable === true ? <Check className="w-4 h-4 text-green-500" /> : 
                   isUsernameAvailable === false ? <X className="w-4 h-4 text-red-500" /> : null}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Your landing page will be: viloryi.com/@{formData.referralUsername || "handle"}</p>
            </div>

            {/* Display Name */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-4 h-4 text-accent" />
                <Label className="text-[10px] tracking-widest font-bold uppercase">Display Name</Label>
              </div>
              <Input 
                required
                placeholder="Show your brand name or real name" 
                value={formData.referralDisplayName}
                onChange={(e) => setFormData({...formData, referralDisplayName: e.target.value})}
                className="rounded-none h-14"
              />
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-4 h-4 text-accent" />
                <Label className="text-[10px] tracking-widest font-bold uppercase">Professional Bio</Label>
              </div>
              <Textarea 
                placeholder="Tell your followers why you love Viloryi..." 
                value={formData.referralBio}
                onChange={(e) => setFormData({...formData, referralBio: e.target.value})}
                className="rounded-none min-h-[120px] resize-none leading-relaxed"
                maxLength={250}
              />
              <p className="text-right text-[9px] text-muted-foreground uppercase tracking-widest">
                {formData.referralBio.length} / 250 Characters
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading || isUsernameAvailable === false}
              className="w-full h-16 bg-primary text-white tracking-[0.3em] font-bold uppercase rounded-none hover:bg-foreground transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
              SAVE BRANDED PROFILE
            </Button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
