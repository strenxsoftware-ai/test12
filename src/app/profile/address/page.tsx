"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, updateDoc, collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  MapPin, 
  Plus, 
  Pencil, 
  User as UserIcon, 
  Mail, 
  Phone,
  CheckCircle2,
  Trash2,
  Briefcase,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function AddressPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const addressesRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, "users", user.uid, "addresses");
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);
  const { data: addresses, isLoading: isAddressesLoading } = useCollection(addressesRef);

  const [contactData, setContactData] = useState({
    displayName: "",
    email: "",
    mobile: "",
    altMobile: "",
    altName: ""
  });

  useEffect(() => {
    if (userData) {
      setContactData({
        displayName: userData.displayName || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        altMobile: userData.altMobile || "",
        altName: userData.altName || ""
      });
    }
  }, [userData]);

  const handleSaveContact = () => {
    if (!userRef) return;
    setContactLoading(true);
    
    updateDoc(userRef, contactData)
      .then(() => {
        setContactLoading(false);
        setIsEditingContact(false);
      })
      .catch((err) => {
        setContactLoading(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: contactData
        }));
      });
  };

  const handleDeleteAddress = (addressId: string) => {
    if (!db || !user?.uid) return;
    const addrRef = doc(db, "users", user.uid, "addresses", addressId);
    deleteDocumentNonBlocking(addrRef);
  };

  if (isUserLoading) return <LoadingState />;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-4">
              <span className="text-accent tracking-[0.4em] text-[10px] font-bold uppercase">Account Management</span>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Details & Address</h1>
            </div>
            <Link href="/profile">
              <Button variant="ghost" className="text-[10px] tracking-widest font-bold uppercase gap-2 p-0 h-auto hover:bg-transparent hover:text-accent">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12">
            
            {/* Section 1: Contact Details */}
            <Card className="rounded-none border-muted shadow-none bg-white">
              <CardHeader className="flex flex-row items-center justify-between border-b px-8 py-6">
                <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-3 text-primary">
                  <UserIcon className="w-4 h-4 text-accent" /> Contact Information
                </CardTitle>
                {!isEditingContact && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingContact(true)} className="text-[10px] tracking-widest uppercase font-bold text-accent">
                    <Pencil className="w-3 h-3 mr-2" /> Edit Details
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-8">
                {isEditingContact ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] tracking-widest font-bold uppercase">Full Name</Label>
                      <Input value={contactData.displayName} onChange={(e) => setContactData({...contactData, displayName: e.target.value})} className="rounded-none h-12" />
                    </div>
                    <div className="space-y-2 opacity-60">
                      <Label className="text-[10px] tracking-widest font-bold uppercase">Email Address (Auto-fill)</Label>
                      <Input value={contactData.email} disabled className="rounded-none h-12 bg-muted/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] tracking-widest font-bold uppercase">Mobile Number</Label>
                      <Input value={contactData.mobile} onChange={(e) => setContactData({...contactData, mobile: e.target.value})} placeholder="10-digit number" className="rounded-none h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] tracking-widest font-bold uppercase">Alternative Mobile</Label>
                      <Input value={contactData.altMobile} onChange={(e) => setContactData({...contactData, altMobile: e.target.value})} placeholder="Optional" className="rounded-none h-12" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] tracking-widest font-bold uppercase">Alternative Contact Name</Label>
                      <Input value={contactData.altName} onChange={(e) => setContactData({...contactData, altName: e.target.value})} placeholder="E.g. Father, Husband" className="rounded-none h-12" />
                    </div>
                    <div className="flex gap-4 md:col-span-2 pt-4">
                      <Button variant="outline" onClick={() => setIsEditingContact(false)} className="flex-1 rounded-none h-12 tracking-widest text-xs font-bold">CANCEL</Button>
                      <Button onClick={handleSaveContact} disabled={contactLoading} className="flex-2 rounded-none h-12 bg-accent tracking-widest text-xs font-bold uppercase">
                        {contactLoading ? "SAVING..." : "SAVE CHANGES"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ContactItem label="Full Name" value={contactData.displayName} icon={<UserIcon className="w-4 h-4" />} />
                    <ContactItem label="Email" value={contactData.email} icon={<Mail className="w-4 h-4" />} />
                    <ContactItem label="Mobile" value={contactData.mobile || "Not set"} icon={<Phone className="w-4 h-4" />} />
                    <ContactItem label="Alt Contact" value={contactData.altName ? `${contactData.altName} (${contactData.altMobile})` : "Not set"} icon={<Phone className="w-4 h-4 opacity-50" />} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 2: Addresses */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-headline font-bold uppercase tracking-widest flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" /> Saved Addresses
                </h2>
                <Link href="/profile/address/manage">
                  <Button className="rounded-none tracking-widest uppercase font-bold text-[10px] bg-primary h-10 px-6">
                    <Plus className="w-4 h-4 mr-2" /> ADD NEW ADDRESS
                  </Button>
                </Link>
              </div>

              {isAddressesLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="h-32 bg-muted animate-pulse" />
                </div>
              ) : !addresses || addresses.length === 0 ? (
                <div className="text-center py-20 bg-muted/10 border border-dashed border-muted rounded-none space-y-4">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground font-light italic">"No addresses saved yet. Add one for a faster checkout."</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr: any) => (
                    <Card key={addr.id} className="rounded-none border-muted shadow-sm hover:border-accent transition-all group">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {addr.type === 'office' ? <Briefcase className="w-4 h-4 text-accent" /> : <Home className="w-4 h-4 text-accent" />}
                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">{addr.type}</span>
                            {addr.isDefault && (
                              <Badge variant="outline" className="rounded-none text-[8px] bg-green-50 text-green-600 border-green-200 uppercase tracking-widest">Default</Badge>
                            )}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/profile/address/manage?id=${addr.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent"><Pencil className="w-3.5 h-3.5" /></Button>
                            </Link>
                            <Button onClick={() => handleDeleteAddress(addr.id)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold uppercase tracking-tight">{addr.name}</h4>
                          <p className="text-xs text-muted-foreground font-light leading-relaxed">
                            {addr.houseNo}, {addr.building}, {addr.locality}<br />
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-xs font-medium pt-2 flex items-center gap-2">
                            <Phone className="w-3 h-3 text-muted-foreground" /> {addr.mobile}
                          </p>
                        </div>
                        {addr.type === 'office' && (addr.officeHours?.openSaturday || addr.officeHours?.openSunday) && (
                          <div className="pt-2 border-t text-[9px] text-muted-foreground font-bold uppercase tracking-widest flex gap-3">
                            {addr.officeHours?.openSaturday && <span>Sat Open</span>}
                            {addr.officeHours?.openSunday && <span>Sun Open</span>}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const ContactItem = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-muted flex items-center justify-center text-accent shrink-0">
      {icon}
    </div>
    <div className="space-y-1">
      <span className="text-[9px] tracking-widest font-bold uppercase opacity-50">{label}</span>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

const LoadingState = () => (
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
