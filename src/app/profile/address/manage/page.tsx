
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc, collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  MapPin, 
  Home, 
  Briefcase, 
  CheckCircle2, 
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

function AddressForm() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get("id");
  
  const [loading, setLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pincode: "",
    state: "",
    city: "",
    houseNo: "",
    building: "",
    locality: "",
    type: "home" as "home" | "office",
    isDefault: false,
    officeHours: {
      openSaturday: false,
      openSunday: false
    }
  });

  const addressRef = useMemoFirebase(() => {
    if (!db || !user?.uid || !addressId) return null;
    return doc(db, "users", user.uid, "addresses", addressId);
  }, [db, user?.uid, addressId]);

  const { data: existingAddress } = useDoc(addressRef);

  useEffect(() => {
    if (existingAddress) {
      setFormData({
        ...formData,
        ...existingAddress
      });
    } else if (user?.displayName) {
      setFormData(prev => ({ ...prev, name: user.displayName || "" }));
    }
  }, [existingAddress, user]);

  // Pincode Auto-fetch Logic
  useEffect(() => {
    const fetchLocation = async (pin: string) => {
      if (pin.length === 6 && /^\d+$/.test(pin)) {
        setIsFetchingLocation(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await res.json();
          if (data[0].Status === "Success") {
            const info = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: info.District,
              state: info.State,
              locality: info.Name
            }));
            toast({ title: "Location detected", description: `${info.District}, ${info.State}` });
          }
        } catch (error) {
          console.error("Pincode fetch error:", error);
        } finally {
          setIsFetchingLocation(false);
        }
      }
    };
    fetchLocation(formData.pincode);
  }, [formData.pincode]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user?.uid) return;
    
    // Basic Validation
    if (formData.mobile.length !== 10) {
      toast({ variant: "destructive", title: "Invalid Mobile", description: "Please enter a 10-digit mobile number." });
      return;
    }
    if (formData.pincode.length !== 6) {
      toast({ variant: "destructive", title: "Invalid Pincode", description: "Please enter a 6-digit pincode." });
      return;
    }

    setLoading(true);
    const addressesRef = collection(db, "users", user.uid, "addresses");

    try {
      // If setting as default, unset others first
      if (formData.isDefault) {
        const q = query(addressesRef, where("isDefault", "==", true));
        const currentDefaults = await getDocs(q);
        currentDefaults.forEach((d) => {
          updateDoc(d.ref, { isDefault: false });
        });
      }

      if (addressId && addressRef) {
        await updateDoc(addressRef, formData);
      } else {
        await addDoc(addressesRef, { ...formData, createdAt: new Date() });
      }

      toast({ title: "Address Saved", description: "Your shipping information has been updated." });
      router.push("/profile/address");
    } catch (err) {
      console.error("Save address error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-headline font-bold text-primary">
              {addressId ? "Edit Address" : "Add New Address"}
            </h1>
            <Button variant="ghost" onClick={() => router.back()} className="text-[10px] tracking-widest font-bold uppercase gap-2 p-0 hover:bg-transparent hover:text-accent">
              <ChevronLeft className="w-4 h-4" /> Cancel
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-8 bg-white p-8 md:p-12 border border-muted shadow-sm">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Full Name</Label>
                <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" className="rounded-none h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Mobile Number (10 Digits)</Label>
                <Input required type="tel" maxLength={10} value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})} placeholder="9876543210" className="rounded-none h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase flex justify-between">
                  Pincode (6 Digits)
                  {isFetchingLocation && <Loader2 className="w-3 h-3 animate-spin text-accent" />}
                </Label>
                <Input required type="text" maxLength={6} value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} placeholder="110001" className="rounded-none h-12" />
              </div>
              <div className="space-y-2 opacity-80">
                <Label className="text-[10px] tracking-widest font-bold uppercase">State</Label>
                <Input required value={formData.state} disabled className="rounded-none h-12 bg-muted/20" />
              </div>
              <div className="space-y-2 opacity-80">
                <Label className="text-[10px] tracking-widest font-bold uppercase">City / District</Label>
                <Input required value={formData.city} disabled className="rounded-none h-12 bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Locality / Town</Label>
                <Input required value={formData.locality} onChange={(e) => setFormData({...formData, locality: e.target.value})} placeholder="E.g. Hauz Khas" className="rounded-none h-12" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase">House No. / Block / Tower</Label>
                <Input required value={formData.houseNo} onChange={(e) => setFormData({...formData, houseNo: e.target.value})} placeholder="E.g. Flat 402, B-Block" className="rounded-none h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Address (Building, Street, Area)</Label>
                <Input required value={formData.building} onChange={(e) => setFormData({...formData, building: e.target.value})} placeholder="E.g. Oakwood Residency, Main Street" className="rounded-none h-12" />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] tracking-widest font-bold uppercase">Type of Address</Label>
              <RadioGroup value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})} className="grid grid-cols-2 gap-4">
                <label className={cn("flex items-center gap-3 p-4 border cursor-pointer transition-all", formData.type === 'home' ? "border-primary bg-primary/5" : "border-muted hover:border-accent")}>
                  <RadioGroupItem value="home" />
                  <Home className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Home</span>
                </label>
                <label className={cn("flex items-center gap-3 p-4 border cursor-pointer transition-all", formData.type === 'office' ? "border-primary bg-primary/5" : "border-muted hover:border-accent")}>
                  <RadioGroupItem value="office" />
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Office</span>
                </label>
              </RadioGroup>
            </div>

            {formData.type === 'office' && (
              <div className="space-y-4 p-6 bg-muted/10 border border-muted animate-fade-in">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Office Delivery Preferences</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="sat" 
                      checked={formData.officeHours.openSaturday} 
                      onCheckedChange={(checked) => setFormData({...formData, officeHours: {...formData.officeHours, openSaturday: !!checked}})} 
                    />
                    <label htmlFor="sat" className="text-xs font-medium cursor-pointer">Office open on Saturday</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="sun" 
                      checked={formData.officeHours.openSunday} 
                      onCheckedChange={(checked) => setFormData({...formData, officeHours: {...formData.officeHours, openSunday: !!checked}})} 
                    />
                    <label htmlFor="sun" className="text-xs font-medium cursor-pointer">Office open on Sunday</label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4">
              <Checkbox 
                id="default" 
                checked={formData.isDefault} 
                onCheckedChange={(checked) => setFormData({...formData, isDefault: !!checked})} 
              />
              <label htmlFor="default" className="text-xs font-bold tracking-widest uppercase cursor-pointer">Make this as my default address</label>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 rounded-none h-14 tracking-widest text-xs font-bold">CANCEL</Button>
              <Button type="submit" disabled={loading} className="flex-[2] rounded-none h-14 bg-accent tracking-widest text-xs font-bold uppercase">
                {loading ? "SAVING..." : "SAVE ADDRESS"} <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ManageAddressPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-accent w-10 h-10" /></div>}>
      <AddressForm />
    </Suspense>
  );
}
