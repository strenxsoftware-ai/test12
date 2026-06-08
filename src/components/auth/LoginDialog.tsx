'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Star, Loader2, UserPlus, Phone, Lock, User } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { loginWithMobile, signUpWithMobile } from '@/firebase/auth/mobile-password-auth';
import { toast } from '@/hooks/use-toast';

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export const LoginDialog = ({ 
  isOpen, 
  onOpenChange, 
  title = "Welcome to Viloryi", 
  description = "Please sign in to access your elegant collection."
}: LoginDialogProps) => {
  const auth = useAuth();
  const db = useFirestore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
    name: ""
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;

    if (formData.mobile.length !== 10) {
      toast({ variant: "destructive", title: "Invalid Number", description: "Please enter a 10-digit mobile number." });
      return;
    }

    if (formData.password.length < 6) {
      toast({ variant: "destructive", title: "Weak Password", description: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        if (!formData.name) {
          toast({ variant: "destructive", title: "Name Required", description: "Please enter your full name." });
          setLoading(false);
          return;
        }
        await signUpWithMobile(auth, db, formData.mobile, formData.password, formData.name);
        toast({ title: "Account Created", description: "Welcome to the world of Viloryi." });
      } else {
        await loginWithMobile(auth, formData.mobile, formData.password);
        toast({ title: "Signed In", description: "Welcome back to your collection." });
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = "Authentication failed. Please check your credentials.";
      if (error.code === 'auth/email-already-in-use') message = "This mobile number is already registered.";
      if (error.code === 'auth/wrong-password') message = "Incorrect password.";
      if (error.code === 'auth/user-not-found') message = "No account found with this number.";
      
      toast({
        variant: "destructive",
        title: "Auth Status",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-background rounded-none border-none p-0 overflow-hidden">
        <div className="relative h-32 bg-primary flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 pointer-events-none">
             {[...Array(10)].map((_, i) => <Star key={i} className="w-8 h-8 text-white" />)}
          </div>
          <h2 className="text-3xl font-headline font-bold text-white tracking-widest relative z-10">VILORYI</h2>
        </div>
        
        <div className="p-8 space-y-6">
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-xl font-headline font-bold tracking-tight text-primary">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-light italic">
              {isSignUp ? "Join our community of elegant women." : "Access your saved pieces and orders."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <Label className="text-[10px] tracking-widest font-bold uppercase opacity-60">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    required 
                    placeholder="E.g. Monika" 
                    className="rounded-none pl-10 h-12"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-[10px] tracking-widest font-bold uppercase opacity-60">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required 
                  type="tel" 
                  maxLength={10}
                  placeholder="10-digit number" 
                  className="rounded-none pl-10 h-12"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] tracking-widest font-bold uppercase opacity-60">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required 
                  type="password" 
                  placeholder="Min. 6 characters" 
                  className="rounded-none pl-10 h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-7 rounded-none tracking-[0.2em] font-bold text-xs hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSignUp ? (
                <UserPlus className="w-4 h-4" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "PROCESSING..." : isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] tracking-widest font-bold uppercase text-accent border-b border-accent pb-1 hover:opacity-70 transition-opacity"
            >
              {isSignUp ? "Already have an account? Sign In" : "New to Viloryi? Create Account"}
            </button>
          </div>

          <p className="text-[9px] tracking-[0.3em] text-center text-muted-foreground uppercase opacity-40 pt-4">
            Premium Silhouettes • Timeless Style
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};