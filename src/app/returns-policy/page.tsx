import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RefreshCcw, ShieldCheck, Truck, AlertCircle } from "lucide-react";

export default function ReturnsPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-muted/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <span className="text-accent tracking-[0.4em] text-xs font-bold uppercase">Customer Care</span>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Returns & Exchanges</h1>
          <div className="w-20 h-[2px] bg-accent mx-auto" />
          <p className="text-muted-foreground font-light text-lg max-w-2xl mx-auto italic">
            "Your satisfaction is our priority. If your Viloryi piece isn't perfect, we are here to help."
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-20">
            
            {/* Core Policy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent">
                  <RefreshCcw className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-headline font-bold text-primary">Our 7-Day Policy</h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  At Viloryi, we take pride in the quality of our craftsmanship. However, if you wish to return or exchange an item, we offer a 7-day window from the date of delivery.
                </p>
              </div>
              <div className="bg-muted/30 p-8 border border-muted space-y-4">
                <h4 className="text-xs tracking-widest font-bold uppercase text-primary">Eligibility Criteria</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" /> Items must be in original condition.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" /> All tags and labels must be attached.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" /> Must be unworn, unwashed, and undamaged.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" /> Include original packaging and invoice.
                  </li>
                </ul>
              </div>
            </div>

            {/* Process */}
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-headline font-bold text-primary">The Process</h2>
                <div className="w-12 h-[1px] bg-accent mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <span className="text-4xl font-headline text-accent/30 font-bold italic">01.</span>
                  <h3 className="font-bold tracking-widest uppercase text-xs">Initiate</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    Contact us via WhatsApp at +91 96967 31313 or email viloryi.official@gmail.com with your Order ID and reason for return.
                  </p>
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <span className="text-4xl font-headline text-accent/30 font-bold italic">02.</span>
                  <h3 className="font-bold tracking-widest uppercase text-xs">Quality Check</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    Once we receive the item at our warehouse, it will undergo a thorough quality inspection by our team.
                  </p>
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <span className="text-4xl font-headline text-accent/30 font-bold italic">03.</span>
                  <h3 className="font-bold tracking-widest uppercase text-xs">Resolution</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    Upon successful QC, we will process your refund to the original payment method or ship your exchange piece within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-primary text-primary-foreground p-10 md:p-16 space-y-8">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <AlertCircle className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-headline font-bold">Important Notes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] tracking-widest font-bold uppercase opacity-60">Refunds</h4>
                  <p className="text-sm font-light leading-relaxed opacity-80">
                    For prepaid orders, the amount is refunded to the original source. For COD orders, we provide store credit or bank transfer upon sharing account details.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] tracking-widest font-bold uppercase opacity-60">Shipping Charges</h4>
                  <p className="text-sm font-light leading-relaxed opacity-80">
                    A nominal reverse shipping fee of ₹150 is applicable for returns. However, exchanges for size issues are processed once free of charge.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="text-center py-12 space-y-6 border-t">
              <h3 className="text-2xl font-headline font-bold text-primary">Need further assistance?</h3>
              <p className="text-muted-foreground font-light italic">"Our support team is always ready to guide you."</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="https://wa.me/919696731313" target="_blank" rel="noopener noreferrer">
                  <button className="px-12 py-5 bg-primary text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-foreground/90 transition-all">
                    Chat on WhatsApp
                  </button>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
