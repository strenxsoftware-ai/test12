
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/ShopContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginDialog } from "@/components/auth/LoginDialog";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { cart, setIsCartOpen, isCartOpen } = useShop();
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const displayPhotoURL = userData?.photoURL || user?.photoURL || "";
  const displayName = userData?.displayName || user?.displayName || "U";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md py-3 shadow-sm" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex-1 hidden md:flex gap-8">
          <Link href="/#collections" className="text-sm font-medium tracking-widest hover:text-accent transition-colors uppercase">Collections</Link>
          <Link href="/about" className="text-sm font-medium tracking-widest hover:text-accent transition-colors uppercase">About</Link>
          <Link href="/contact" className="text-sm font-medium tracking-widest hover:text-accent transition-colors uppercase">Contact</Link>
        </div>

        <div className="md:hidden">
          {mounted && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background">
                <SheetHeader className="text-left border-b pb-4 mb-4">
                  <SheetTitle className="text-2xl font-headline tracking-widest">MENU</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 pt-4">
                  <Link href="/#collections" className="text-xl font-headline tracking-widest">COLLECTIONS</Link>
                  <Link href="/about" className="text-xl font-headline tracking-widest">ABOUT</Link>
                  <Link href="/contact" className="text-xl font-headline tracking-widest">CONTACT</Link>
                  {user && <Link href="/profile" className="text-xl font-headline tracking-widest">MY PROFILE</Link>}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <Link href="/" className="flex-1 text-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-[0.2em] text-primary">
            VILORYI
          </h1>
        </Link>

        <div className="flex-1 flex items-center justify-end gap-1 md:gap-4">
          {mounted && (
            <>
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md bg-background flex flex-col p-0">
                  <CartDrawer />
                </SheetContent>
              </Sheet>

              {user ? (
                <Link href="/profile">
                  <Avatar className="w-8 h-8 border border-muted hover:border-accent transition-colors">
                    <AvatarImage src={displayPhotoURL} alt={displayName} />
                    <AvatarFallback className="bg-muted text-[10px] font-bold">
                      {displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsLoginOpen(true)}>
                  <UserIcon className="w-5 h-5" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <LoginDialog isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </nav>
  );
};
