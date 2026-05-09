import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck, Clock, ShieldCheck, Globe, Package, MapPin } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-muted/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <span className="text-accent tracking-[0.4em] text-xs font-bold uppercase">Customer Support</span>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Shipping Policy</h1>
          <div className="w-20 h-[2px] bg-accent mx-auto" />
          <p className="text-muted-foreground font-light text-lg max-w-2xl mx-auto italic">
            "We strive to deliver your elegant Viloryi pieces with the utmost care and efficiency."
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-primary text-primary-foreground p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-widest font-bold uppercase opacity-60">Processing</h4>
                    <p className="text-sm font-bold">24-48 Hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-widest font-bold uppercase opacity-60">Delivery</h4>
                    <p className="text-sm font-bold">3-5 Business Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-widest font-bold uppercase opacity-60">Coverage</h4>
                    <p className="text-sm font-bold">Pan India</p>
                  </div>
                </div>
              </div>

              <div className="border border-muted p-8 space-y-4">
                <h3 className="font-headline font-bold text-lg">Need help tracking?</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  Our team is available on WhatsApp to help you with real-time updates of your shipment.
                </p>
                <a href="https://wa.me/919696731313" target="_blank" rel="noopener noreferrer" className="inline-block text-[10px] font-bold tracking-widest uppercase text-accent border-b border-accent pb-1">
                  Connect on WhatsApp
                </a>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-headline font-bold text-primary">Domestic Shipping</h2>
                <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                  <p>
                    Viloryi offers shipping across all major pin codes in India. We partner with leading courier services to ensure your order reaches you safely and on time.
                  </p>
                  <p>
                    <strong>Standard Delivery:</strong> All orders are typically delivered within 3-5 business days across major cities. Delivery to remote locations may take 5-7 business days.
                  </p>
                  <p>
                    <strong>Shipping Charges:</strong> We offer FREE standard shipping on all orders above ₹2,999. For orders below this amount, a flat shipping fee of ₹150 is applicable.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-headline font-bold text-primary">Order Tracking</h2>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                    <p>
                      Once your order is dispatched, you will receive a confirmation email and SMS containing your tracking number and a link to the courier's website.
                    </p>
                    <p>
                      Please allow up to 24 hours for the tracking information to update on the courier's portal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-headline font-bold text-primary">Packaging Excellence</h2>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                    <p>
                      Each Viloryi piece is meticulously inspected for quality before being packed. We use premium, sustainable packaging designed to protect your garments during transit while reflecting our commitment to luxury and the environment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-headline font-bold text-primary">Missed Deliveries</h2>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                    <p>
                      Our courier partners will attempt delivery up to 3 times. If the delivery is unsuccessful after 3 attempts, the package will be returned to our warehouse. In such cases, a reshipping fee may be applicable for the next delivery attempt.
                    </p>
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