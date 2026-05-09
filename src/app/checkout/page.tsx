
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useShop, getEffectivePrice } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ShoppingBag, CreditCard, Truck, CheckCircle2, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { createRazorpayOrder } from "@/app/actions/razorpay";
import Script from "next/script";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useShop();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const addressesRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, "users", user.uid, "addresses");
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);
  const { data: addresses } = useCollection(addressesRef);

  useEffect(() => {
    if (userData) {
      setEmail(userData.email || "");
      setPhone(userData.mobile || "");
    }
  }, [userData]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else setSelectedAddressId(addresses[0].id);
    }
  }, [addresses]);

  const selectedAddress = useMemo(() => {
    return addresses?.find((a: any) => a.id === selectedAddressId);
  }, [addresses, selectedAddressId]);

  const saveOrderToFirestore = async (paymentId?: string) => {
    if (!user || !db || !selectedAddress) return;

    // Use discountPrice logic for items in the saved order
    const orderItems = cart.map(item => ({
      ...item,
      priceAtPurchase: getEffectivePrice(item)
    }));

    const orderData = {
      userId: user.uid,
      items: orderItems,
      totalAmount: cartTotal,
      status: "Processing",
      paymentMethod,
      razorpayPaymentId: paymentId || null,
      email,
      phone,
      shippingAddress: selectedAddress,
      createdAt: serverTimestamp(),
      itemsCount: cart.length
    };

    const ordersRef = collection(db, "users", user.uid, "orders");
    await addDoc(ordersRef, orderData);
    router.push("/checkout/success");
  };

  const handleRazorpayPayment = async () => {
    const res = await createRazorpayOrder(cartTotal);
    
    if (!res.success || !res.order) {
      toast({ variant: "destructive", title: "Payment Error", description: res.error || "Could not initiate payment." });
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_live_SiuQXDGuUvawLa",
      amount: res.order.amount,
      currency: res.order.currency,
      name: "VILORYI",
      description: "Premium Fashion Collection",
      order_id: res.order.id,
      handler: async function (response: any) {
        // Payment successful
        await saveOrderToFirestore(response.razorpay_payment_id);
      },
      prefill: {
        name: user?.displayName || "",
        email: email,
        contact: phone,
      },
      theme: {
        color: "#191919",
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !selectedAddress) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please ensure you have a selected shipping address." });
      return;
    }

    setLoading(true);

    if (paymentMethod === "upi") {
      await handleRazorpayPayment();
    } else {
      // Cash on Delivery
      try {
        await saveOrderToFirestore();
      } catch (err) {
        console.error("Order creation error:", err);
        toast({ variant: "destructive", title: "Order Failed", description: "Could not place your order. Please try again." });
        setLoading(false);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-40 pb-24 text-center space-y-6">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/20" />
          <h1 className="text-3xl font-headline">Your bag is empty.</h1>
          <p className="text-muted-foreground">Add some elegant pieces to your collection before checking out.</p>
          <Link href="/#collections">
            <Button className="rounded-none tracking-widest mt-4">BROWSE COLLECTIONS</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-headline font-bold tracking-widest">VILORYI</Link>
          <Link href="/" className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:text-accent transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </header>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-7 space-y-12">
              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* Contact Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
                    <h2 className="text-xl font-headline font-bold uppercase tracking-widest">Contact Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] tracking-widest font-bold uppercase">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        placeholder="jane@example.com" 
                        className="rounded-none h-12"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[10px] tracking-widest font-bold uppercase">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        required 
                        placeholder="9876543210" 
                        className="rounded-none h-12"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address Selection */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
                      <h2 className="text-xl font-headline font-bold uppercase tracking-widest">Shipping Address</h2>
                    </div>
                    <Link href="/profile/address/manage" className="text-[10px] font-bold tracking-widest uppercase text-accent border-b border-accent pb-1">
                      + ADD NEW
                    </Link>
                  </div>

                  {!addresses || addresses.length === 0 ? (
                    <div className="p-8 border border-dashed border-muted text-center space-y-4">
                      <p className="text-sm text-muted-foreground italic">"Please add a shipping address to continue."</p>
                      <Link href="/profile/address/manage">
                        <Button type="button" variant="outline" className="rounded-none tracking-widest uppercase font-bold text-xs">ADD ADDRESS</Button>
                      </Link>
                    </div>
                  ) : (
                    <RadioGroup value={selectedAddressId || ""} onValueChange={setSelectedAddressId} className="grid grid-cols-1 gap-4">
                      {addresses.map((addr: any) => (
                        <div key={addr.id}>
                          <input type="radio" value={addr.id} id={`addr-${addr.id}`} className="peer hidden" />
                          <Label
                            htmlFor={`addr-${addr.id}`}
                            className={cn(
                              "flex items-start justify-between p-6 border cursor-pointer transition-all",
                              selectedAddressId === addr.id ? "border-accent bg-accent/5" : "border-muted hover:border-accent/50"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="mt-1" />
                              <div className="space-y-1">
                                <div className="text-sm font-bold uppercase flex items-center gap-2">
                                  <span>{addr.name}</span>
                                  <Badge className="text-[8px] bg-muted text-primary hover:bg-muted rounded-none">{addr.type}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                  {addr.houseNo}, {addr.building}, {addr.locality}<br />
                                  {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                                <p className="text-xs font-medium pt-1">{addr.mobile}</p>
                              </div>
                            </div>
                            <Link href={`/profile/address/manage?id=${addr.id}`} onClick={(e) => e.stopPropagation()}>
                              <Pencil className="w-4 h-4 text-muted-foreground hover:text-accent" />
                            </Link>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</span>
                    <h2 className="text-xl font-headline font-bold uppercase tracking-widest">Payment Method</h2>
                  </div>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Label
                      htmlFor="upi"
                      className={cn(
                        "flex items-center justify-between p-4 border cursor-pointer transition-all",
                        paymentMethod === 'upi' ? "border-accent bg-accent/5" : "hover:border-accent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="upi" id="upi" />
                        <span className="text-xs font-bold tracking-widest uppercase">UPI / Online Pay</span>
                      </div>
                    </Label>
                    <Label
                      htmlFor="cod"
                      className={cn(
                        "flex items-center justify-between p-4 border cursor-pointer transition-all",
                        paymentMethod === 'cod' ? "border-accent bg-accent/5" : "hover:border-accent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <span className="text-xs font-bold tracking-widest uppercase">Cash on Delivery</span>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

                <Button 
                  disabled={loading || !selectedAddressId}
                  className="w-full bg-primary text-white py-8 tracking-[0.3em] font-bold uppercase rounded-none hover:bg-foreground/90 transition-all text-sm"
                >
                  {loading ? "PROCESSING..." : `PLACE ORDER • ₹${cartTotal.toLocaleString()}`}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-muted/30 p-8 sticky top-32">
                <h3 className="text-xl font-headline font-bold uppercase tracking-widest mb-8">Order Summary</h3>
                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => {
                    const displayImage = item.images?.[0] || "https://picsum.photos/seed/placeholder/600/800";
                    const effectivePrice = getEffectivePrice(item);
                    
                    return (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                        <div className="relative w-16 h-20 bg-muted flex-shrink-0">
                          <Image src={displayImage} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="text-xs font-bold uppercase tracking-tight">{item.name}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">Qty: {item.quantity} • Size: {item.selectedSize}</p>
                          <p className="text-xs font-bold">₹{(effectivePrice * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <Separator className="mb-6" />
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-accent font-bold">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center text-center p-4 bg-background border space-y-2">
                    <Truck className="w-5 h-5 text-accent" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Safe Delivery</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-background border space-y-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
