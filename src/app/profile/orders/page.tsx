
"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Package, 
  ChevronRight, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck,
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

export default function OrdersPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, "users", user.uid, "orders"),
      orderBy("createdAt", "desc")
    );
  }, [db, user?.uid]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

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

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
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
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <span className="text-accent tracking-[0.4em] text-[10px] font-bold uppercase">Account History</span>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">My Orders</h1>
            </div>
            <Link href="/profile">
              <Button variant="ghost" className="text-[10px] tracking-widest font-bold uppercase gap-2 p-0 h-auto hover:bg-transparent hover:text-accent">
                <ChevronLeft className="w-4 h-4" /> Back to Profile
              </Button>
            </Link>
          </div>

          {isOrdersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted/50 animate-pulse rounded-none" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-24 bg-muted/20 border border-dashed border-muted rounded-none space-y-6">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/20" />
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold">No orders found</h3>
                <p className="text-muted-foreground font-light text-sm italic">"Your luxury journey is just beginning."</p>
              </div>
              <Link href="/#collections">
                <Button className="rounded-none tracking-widest uppercase font-bold text-xs px-12 py-6">
                  EXPLORE COLLECTIONS
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              {orders.map((order) => (
                <Link key={order.id} href={`/profile/orders/${order.id}`}>
                  <Card className="rounded-none border-muted hover:border-accent transition-all group overflow-hidden shadow-none cursor-pointer">
                    <CardContent className="p-0">
                      <div className="p-6 flex flex-col md:flex-row justify-between gap-6 border-b border-muted bg-muted/5">
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="space-y-1">
                            <p className="text-[10px] tracking-widest font-bold uppercase opacity-50">Order Number</p>
                            <p className="text-sm font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] tracking-widest font-bold uppercase opacity-50">Date Placed</p>
                            <p className="text-sm font-medium">
                              {order.createdAt?.seconds 
                                ? format(new Date(order.createdAt.seconds * 1000), 'PPP') 
                                : 'Recent'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] tracking-widest font-bold uppercase opacity-50">Total Amount</p>
                            <p className="text-sm font-bold text-accent">₹{order.totalAmount?.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="rounded-none border-muted px-4 py-1.5 flex gap-2 items-center bg-white shadow-sm">
                            {getStatusIcon(order.status)}
                            <span className="text-[9px] tracking-[0.2em] font-bold uppercase">
                              {order.status || 'Pending'}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-6 flex items-center justify-between group-hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                            <Package className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold uppercase tracking-widest">View Details</h4>
                            <p className="text-[10px] text-muted-foreground font-light italic">
                              {order.itemsCount || 1} item(s) • Ship to: {order.shippingAddress?.city || 'Address on file'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-16 pt-12 border-t border-muted text-center space-y-6">
            <h3 className="text-xl font-headline font-bold">Need assistance?</h3>
            <p className="text-muted-foreground text-sm font-light italic">"Our concierge team is here to help you with your order status."</p>
            <Link href="/contact">
              <Button variant="outline" className="rounded-none tracking-widest uppercase font-bold text-[10px] px-12 py-6 border-muted hover:border-accent">
                CONTACT SUPPORT
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
