
"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Pencil,
  User as UserIcon,
  Shirt,
  ShoppingBag,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EditSection = 'basic' | 'topwear' | 'bottomwear' | 'body' | 'success' | null;

const BAND_SIZES = ["28", "30", "32", "34", "36", "38", "40", "42", "44"];
const CUP_SIZES = ["A", "B", "C", "D", "DD", "E", "F"];

export default function PreferencesPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const [activeSection, setActiveSection] = useState<EditSection>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: "",
    gender: "female",
    dob: "",
    topwearType: "",
    bottomwearType: "",
    bottomwearOccasion: "",
    bottomwearFit: "",
    bottomwearSize: "",
    height: "",
    weight: "",
    bustSize: "",
    shape: "",
    size: "",
    braSize: {
      band: "",
      cup: ""
    }
  });

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.displayName || prev.name,
        ...(userData.preferences || {})
      }));
    } else if (user?.displayName) {
      setFormData(prev => ({ ...prev, name: user.displayName || "" }));
    }
  }, [userData, user]);

  const handleSave = () => {
    if (!userRef) return;
    setLoading(true);
    
    const updateData = {
      displayName: formData.name,
      preferences: {
        ...formData,
      }
    };

    updateDoc(userRef, updateData)
      .then(() => {
        setLoading(false);
        setActiveSection('success');
      })
      .catch(async (error) => {
        setLoading(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updateData
        }));
      });
  };

  if (isUserLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-full" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  const renderDashboard = () => (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <span className="text-accent tracking-[0.4em] text-[10px] font-bold uppercase">Your Style Profile</span>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Preferences</h1>
        <p className="text-muted-foreground text-sm font-light italic">"Personalize your Viloryi experience for a perfect fit."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Details Section */}
        <Card className="rounded-none border-muted shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-accent" /> Basic Details
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setActiveSection('basic'); setCurrentStep(1); }}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <DetailItem label="Name" value={formData.name} />
            <DetailItem label="Gender" value={formData.gender} className="capitalize" />
            <DetailItem label="Date of Birth" value={formData.dob || "Not set"} />
          </CardContent>
        </Card>

        {/* Topwear Details Section */}
        <Card className="rounded-none border-muted shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-2">
              <Shirt className="w-4 h-4 text-accent" /> Topwear
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setActiveSection('topwear'); setCurrentStep(1); }}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <DetailItem label="Type" value={formData.topwearType || "Not set"} />
            <DetailItem label="Shape" value={formData.shape || "Not set"} />
            <DetailItem label="Size" value={formData.size || "Not set"} />
          </CardContent>
        </Card>

        {/* Bottomwear Details Section */}
        <Card className="rounded-none border-muted shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-accent" /> Bottomwear
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setActiveSection('bottomwear'); setCurrentStep(1); }}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <DetailItem label="Type" value={formData.bottomwearType || "Not set"} />
            <DetailItem label="Occasion" value={formData.bottomwearOccasion || "Not set"} />
            <DetailItem label="Fit" value={formData.bottomwearFit || "Not set"} />
            <DetailItem label="Size" value={formData.bottomwearSize || "Not set"} />
          </CardContent>
        </Card>

        {/* Body & Fit Section */}
        <Card className="rounded-none border-muted shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-2">
              <Info className="w-4 h-4 text-accent" /> Body & Fit
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setActiveSection('body'); setCurrentStep(1); }}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <DetailItem label="Height" value={formData.height || "Not set"} />
            <DetailItem label="Weight" value={formData.weight || "Not set"} />
            <DetailItem label="Bust Size" value={formData.bustSize || "Not set"} />
            {formData.braSize?.band && <DetailItem label="Bra Size" value={`${formData.braSize.band}${formData.braSize.cup}`} />}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Button 
          variant="outline" 
          onClick={() => router.push("/profile")}
          className="rounded-none tracking-widest uppercase font-bold text-[10px] px-12 py-6 border-muted hover:border-accent"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Profile
        </Button>
      </div>
    </div>
  );

  const renderEditForm = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Edit Basic Details" />
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Full Name</Label>
                <input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full rounded-none h-12 border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Gender</Label>
                <RadioGroup value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})} className="flex gap-4">
                  <GenderLabel value="female" label="Female" />
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Date of Birth</Label>
                <input 
                  type="date" 
                  value={formData.dob} 
                  onChange={(e) => setFormData({...formData, dob: e.target.value})} 
                  className="w-full rounded-none h-12 border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                />
              </div>
            </div>
            <FormActions onCancel={() => setActiveSection(null)} onSave={handleSave} loading={loading} />
          </div>
        );
      case 'topwear':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Edit Topwear Details" />
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Type Preference</Label>
                <div className="flex flex-wrap gap-2">
                  {["Kurtas", "Tops", "Dresses"].map(t => (
                    <SelectableButton key={t} label={t} active={formData.topwearType === t} onClick={() => setFormData({...formData, topwearType: t})} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Preferred Shape</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["A-Line", "Anarkali", "Pathani", "Straight"].map(s => (
                    <SelectableButton key={s} label={s} active={formData.shape === s} onClick={() => setFormData({...formData, shape: s})} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Size</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map(s => (
                    <SelectableButton key={s} label={s} active={formData.size === s} onClick={() => setFormData({...formData, size: s})} />
                  ))}
                </div>
              </div>
            </div>
            <FormActions onCancel={() => setActiveSection(null)} onSave={handleSave} loading={loading} />
          </div>
        );
      case 'bottomwear':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <SectionHeader title="Bottomwear Preferences" className="border-b-0 pb-0" />
              <div className="text-[10px] font-bold text-accent tracking-widest">STEP {currentStep} / 4</div>
            </div>
            
            <Progress value={(currentStep / 4) * 100} className="h-1 bg-muted rounded-none mb-8" />

            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <Label className="text-[10px] tracking-widest font-bold uppercase">What type of bottomwear do you prefer?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["Pants", "Palazzo", "Leggings", "Jeans"].map(t => (
                    <SelectableButton key={t} label={t} active={formData.bottomwearType === t} onClick={() => setFormData({...formData, bottomwearType: t})} />
                  ))}
                </div>
                <Button onClick={() => setCurrentStep(2)} className="w-full h-14 rounded-none tracking-widest uppercase text-xs">NEXT QUESTION</Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <Label className="text-[10px] tracking-widest font-bold uppercase">For which occasion?</Label>
                <div className="grid grid-cols-1 gap-3">
                  {["Daily Wear", "Office Wear", "Casual Outing"].map(o => (
                    <SelectableButton key={o} label={o} active={formData.bottomwearOccasion === o} onClick={() => setFormData({...formData, bottomwearOccasion: o})} />
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 h-14 rounded-none tracking-widest uppercase text-xs">BACK</Button>
                  <Button onClick={() => setCurrentStep(3)} className="flex-[2] h-14 rounded-none tracking-widest uppercase text-xs">NEXT QUESTION</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <Label className="text-[10px] tracking-widest font-bold uppercase">What fit do you wear?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["Flared", "Loose Fit", "Regular Fit", "Skinny Fit", "Slim Fit", "Straight Fit", "Tapered Fit"].map(f => (
                    <SelectableButton key={f} label={f} active={formData.bottomwearFit === f} onClick={() => setFormData({...formData, bottomwearFit: f})} />
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1 h-14 rounded-none tracking-widest uppercase text-xs">BACK</Button>
                  <Button onClick={() => setCurrentStep(4)} className="flex-[2] h-14 rounded-none tracking-widest uppercase text-xs">NEXT QUESTION</Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <Label className="text-[10px] tracking-widest font-bold uppercase">What is your bottomwear size?</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "40"].map(s => (
                    <SelectableButton key={s} label={s} active={formData.bottomwearSize === s} onClick={() => setFormData({...formData, bottomwearSize: s})} />
                  ))}
                </div>
                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1 h-14 rounded-none tracking-widest uppercase text-xs">BACK</Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="flex-[2] h-14 bg-accent hover:bg-accent/90 rounded-none tracking-widest uppercase text-xs font-bold"
                  >
                    {loading ? "SAVING..." : "SAVE PREFERENCES"}
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep < 4 && (
              <div className="pt-8 text-center">
                <Button variant="link" onClick={() => setActiveSection(null)} className="text-[10px] tracking-widest font-bold uppercase opacity-60">Cancel and Go Back</Button>
              </div>
            )}
          </div>
        );
      case 'body':
        return (
          <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Edit Body & Fit Details" />
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Height</Label>
                  <input 
                    value={formData.height} 
                    onChange={(e) => setFormData({...formData, height: e.target.value})} 
                    placeholder="e.g. 5'5\" 
                    className="w-full rounded-none h-12 border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Weight</Label>
                  <input 
                    value={formData.weight} 
                    onChange={(e) => setFormData({...formData, weight: e.target.value})} 
                    placeholder="e.g. 60kg" 
                    className="w-full rounded-none h-12 border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest font-bold uppercase">Bust Size</Label>
                <input 
                  value={formData.bustSize} 
                  onChange={(e) => setFormData({...formData, bustSize: e.target.value})} 
                  placeholder="e.g. 34 inches" 
                  className="w-full rounded-none h-12 border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Bra Band Size</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {BAND_SIZES.map(band => (
                      <SelectableButton 
                        key={band} 
                        label={band} 
                        active={formData.braSize?.band === band} 
                        onClick={() => setFormData({...formData, braSize: {...formData.braSize, band}})} 
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] tracking-widest font-bold uppercase">Cup Size</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {CUP_SIZES.map(cup => (
                      <SelectableButton 
                        key={cup} 
                        label={cup} 
                        active={formData.braSize?.cup === cup} 
                        onClick={() => setFormData({...formData, braSize: {...formData.braSize, cup}})} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <FormActions onCancel={() => setActiveSection(null)} onSave={handleSave} loading={loading} />
          </div>
        );
      case 'success':
        return (
          <div className="py-12 space-y-8 text-center animate-fade-in flex flex-col items-center">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4 scale-110 animate-pulse">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-headline font-bold text-primary">Preferences Updated</h2>
              <p className="text-muted-foreground font-light text-lg italic max-w-sm">
                "Your style profile has been seamlessly synchronized. We're ready to curate your next favorite look."
              </p>
            </div>
            <Button onClick={() => setActiveSection(null)} className="mt-8 px-12 h-14 rounded-none tracking-[0.3em] font-bold uppercase text-xs">
              GO BACK TO PREFERENCES <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white p-8 md:p-12 shadow-sm border border-muted min-h-[500px]">
            {activeSection ? renderEditForm() : renderDashboard()}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

const DetailItem = ({ label, value, className }: { label: string; value: string; className?: string }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-muted-foreground tracking-widest font-bold uppercase text-[9px]">{label}</span>
    <span className={cn("font-medium text-primary text-right", className)}>{value}</span>
  </div>
);

const SectionHeader = ({ title, className }: { title: string; className?: string }) => (
  <div className={cn("space-y-2 border-b pb-4", className)}>
    <h2 className="text-2xl font-headline font-bold text-primary">{title}</h2>
    <p className="text-muted-foreground text-[10px] tracking-widest uppercase font-bold opacity-60">Update your preferences below</p>
  </div>
);

const SelectableButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex-1 min-w-[50px] h-12 flex items-center justify-center border text-[10px] tracking-widest font-bold uppercase transition-all",
      active ? "border-primary bg-primary text-white" : "border-muted hover:border-accent text-muted-foreground"
    )}
  >
    {label}
  </button>
);

const GenderLabel = ({ value, label }: { value: string; label: string }) => (
  <Label className="flex-1 flex items-center justify-between p-4 border border-muted cursor-pointer hover:border-accent transition-all">
    <div className="flex items-center gap-3">
      <RadioGroupItem value={value} id={value} />
      <span className="text-[10px] tracking-widest font-bold uppercase">{label}</span>
    </div>
  </Label>
);

const FormActions = ({ onCancel, onSave, loading }: { onCancel: () => void; onSave: () => void; loading: boolean }) => (
  <div className="flex gap-4 pt-8">
    <Button variant="outline" onClick={onCancel} className="flex-1 h-14 rounded-none tracking-widest font-bold uppercase text-xs">
      CANCEL
    </Button>
    <Button 
      onClick={onSave} 
      disabled={loading}
      className="flex-[2] h-14 rounded-none tracking-widest font-bold uppercase text-xs bg-accent hover:bg-accent/90"
    >
      {loading ? "SAVING..." : "SAVE CHANGES"} <Sparkles className="w-4 h-4 ml-2" />
    </Button>
  </div>
);
