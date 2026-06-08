
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, Star } from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function InfluencerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
      
      // Ensure UserProfile exists with influencer role
      const userRef = doc(db, "users", result.user.uid);
      const profileData = {
        uid: result.user.uid,
        email: result.user.email?.toLowerCase().trim() || email.toLowerCase().trim(),
        role: "influencer",
        lastLogin: serverTimestamp()
      };

      // Non-blocking mutation per guidelines
      setDoc(userRef, profileData, { merge: true })
        .catch(async (err) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: profileData
          }));
        });

      toast({ title: "Welcome back", description: "Accessing influencer dashboard..." });
      router.push("/influencer/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      let message = "Please check your credentials and try again.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = "Invalid email or password. Please ensure you have an influencer account.";
      }
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white border border-muted shadow-2xl p-10 space-y-10 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">Influencer Portal</h1>
            <p className="text-muted-foreground text-sm font-light italic">
              "Access your collaboration dashboard and campaigns."
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] tracking-widest font-bold uppercase opacity-60">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  className="rounded-none pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] tracking-widest font-bold uppercase opacity-60">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="rounded-none pl-10 h-12"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-16 bg-primary text-white tracking-[0.3em] font-bold uppercase rounded-none hover:bg-foreground transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "SIGN IN TO DASHBOARD"}
            </Button>
          </form>

          <p className="text-[9px] tracking-[0.3em] text-center text-muted-foreground uppercase opacity-40">
            Secure Access • Brand Partnership
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
