
"use client";

import React, { use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const orderRef = useMemoFirebase(() => {
    if (!db || !user?.uid || !id) return null;
    return doc(db, "users", user.uid, "orders", id);
  }, [db, user?.uid, id]);

  const { data: order, isLoading: isOrderLoading } = useDoc(orderRef);

  if (isUserLoading || isOrderLoading) {
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

  if (!order) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-40 text-center space-y-6">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground/20" />
          <h1 className="text-2xl font-headline">Order not found.</h1>
          <Link href="/profile/orders">
            <Button variant="outline" className="rounded-none tracking-widest uppercase">BACK TO ORDERS</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const status = order.status?.toLowerCase() || 'pending';

  const getStatusIcon = (statusStr: string) => {
    switch (statusStr) {
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'processing': return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <Link href="/profile/orders" className="flex items-center gap-2 text-[10px] tracking-widest font-bold uppercase text-accent hover:opacity-70 transition-opacity">
                <ChevronLeft className="w-3 h-3" /> Back to Orders
              </Link>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Order Details</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">#{order.id.toUpperCase()}</p>
            </div>
            <div>
              <Badge variant="outline" className="rounded-none border-muted px-6 py-2.5 flex gap-3 items-center bg-white shadow-sm">
                {getStatusIcon(status)}
                <span className="text-xs tracking-[0.2em] font-bold uppercase">
                  {order.status || 'Pending'}
                </span>
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Items */}
            <div className="lg:col-span-7 space-y-8">
              <Card className="rounded-none border-muted shadow-none bg-white">
                <CardHeader className="border-b px-8 py-6">
                  <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-3 text-primary">
                    <Package className="w-4 h-4 text-accent" /> Items in this Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-muted">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="p-8 flex gap-6 group">
                        <div className="relative w-24 h-32 bg-muted shrink-0 overflow-hidden">
                          <Image 
                            src={item.images?.[0] || "https://picsum.photos/seed/placeholder/600/800"} 
                            alt={item.name} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold uppercase tracking-tight group-hover:text-accent transition-colors">{item.name}</h4>
                            <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            Size: {item.selectedSize || 'M'} • Qty: {item.quantity}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-light italic line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address Detail */}
              <Card className="rounded-none border-muted shadow-none bg-white">
                <CardHeader className="border-b px-8 py-6">
                  <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-3 text-primary">
                    <MapPin className="w-4 h-4 text-accent" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase">{order.shippingAddress?.name}</h4>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      {order.shippingAddress?.houseNo}, {order.shippingAddress?.building}, {order.shippingAddress?.locality}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <div className="pt-2 flex flex-col gap-1">
                      <p className="text-xs font-medium">Mobile: {order.phone || order.shippingAddress?.mobile}</p>
                      <p className="text-xs font-medium">Email: {order.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Summary & Payment */}
            <div className="lg:col-span-5 space-y-8">
              <Card className="rounded-none border-muted shadow-none bg-muted/5">
                <CardHeader className="border-b px-8 py-6">
                  <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-3 text-primary">
                    <CreditCard className="w-4 h-4 text-accent" /> Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order Date</span>
                      <span className="font-medium">
                        {order.createdAt?.seconds 
                          ? format(new Date(order.createdAt.seconds * 1000), 'PPP') 
                          : 'Recent'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="font-bold uppercase tracking-widest text-[10px]">{order.paymentMethod === 'upi' ? 'Online / UPI' : 'Cash on Delivery'}</span>
                    </div>
                    {order.razorpayPaymentId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span className="font-mono text-[10px] opacity-60">{order.razorpayPaymentId}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{order.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-accent font-bold">FREE</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold uppercase tracking-widest">Grand Total</span>
                      <span className="text-2xl font-bold text-primary">₹{order.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Tracker */}
              <Card className="rounded-none border-muted shadow-none bg-white">
                <CardHeader className="border-b px-8 py-6">
                  <CardTitle className="text-xs tracking-widest font-bold uppercase flex items-center gap-3 text-primary">
                    <Truck className="w-4 h-4 text-accent" /> Shipment Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                   <div className="relative space-y-8">
                     <div className="absolute left-[11px] top-1 bottom-1 w-[1px] bg-muted" />
                     
                     <TrackingStep 
                       title="Order Placed" 
                       date={order.createdAt?.seconds ? format(new Date(order.createdAt.seconds * 1000), 'p, PPP') : 'Recently'} 
                       completed={true} 
                     />
                     <TrackingStep 
                       title="Processing" 
                       date={['processing', 'shipped', 'delivered'].includes(status) ? 'Successfully processed' : 'Awaiting confirmation'} 
                       completed={['processing', 'shipped', 'delivered'].includes(status)} 
                     />
                     <TrackingStep 
                       title="Shipped" 
                       date={['shipped', 'delivered'].includes(status) ? 'Dispatched from warehouse' : 'Expected within 24-48 hours'} 
                       completed={['shipped', 'delivered'].includes(status)} 
                     />
                     <TrackingStep 
                       title="Delivered" 
                       date={status === 'delivered' ? 'Package received' : 'Estimated 3-5 business days'} 
                       completed={status === 'delivered'} 
                     />
                   </div>
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

function TrackingStep({ title, date, completed }: { title: string; date: string; completed: boolean }) {
  return (
    <div className="flex gap-6 relative z-10">
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 bg-white transition-colors duration-500",
        completed ? "border-accent text-accent" : "border-muted text-muted-foreground"
      )}>
        {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
      </div>
      <div className="space-y-1">
        <h5 className={cn("text-xs font-bold uppercase tracking-widest", completed ? "text-primary" : "text-muted-foreground opacity-50")}>{title}</h5>
        <p className="text-[10px] text-muted-foreground font-light italic">{date}</p>
      </div>
    </div>
  );
}
