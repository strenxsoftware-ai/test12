
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RefreshCw, CreditCard, Ban, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-muted/10 text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <span className="text-accent tracking-[0.4em] text-xs font-bold uppercase">Customer Care</span>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Refund & Cancellation</h1>
          <div className="w-20 h-[2px] bg-accent mx-auto" />
          <p className="text-muted-foreground font-light text-lg max-w-2xl mx-auto italic">
            "Transparency in our transactions is key to our relationship with you."
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl space-y-24">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent">
                <Ban className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-headline font-bold text-primary">Cancellations</h2>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p>
                  You may cancel your order before it has been processed and dispatched. Typically, orders are processed within 24 hours of placement.
                </p>
                <p>
                  To cancel an order, please contact our support team immediately at viloryi.official@gmail.com or via WhatsApp at +91 96967 31313.
                </p>
                <p className="font-semibold text-primary italic">
                  *Once an order is dispatched, it cannot be cancelled. In such cases, the standard returns policy will apply.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-headline font-bold text-primary">Refund Process</h2>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p>
                  Refunds are initiated only after the returned item has passed our Quality Check (QC).
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Prepaid Orders:</strong> The refund will be credited back to the original payment source within 5-7 business days.</li>
                  <li><strong>COD Orders:</strong> We offer store credit or bank transfer. You will need to provide valid bank account details for a transfer.</li>
                  <li><strong>Taxes:</strong> GST is refunded as part of the total order value.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-primary text-primary-foreground p-12 space-y-8">
            <div className="flex items-center gap-6">
              <RefreshCw className="w-8 h-8 text-accent" />
              <h2 className="text-3xl font-headline font-bold">Failed Deliveries</h2>
            </div>
            <p className="text-lg opacity-80 font-light leading-relaxed max-w-3xl">
              If an order is returned to our warehouse due to multiple failed delivery attempts by our courier partner, we can either re-dispatch it (shipping charges applicable) or initiate a refund after deducting the two-way shipping costs incurred.
            </p>
          </div>

          <div className="text-center space-y-8 py-12 border-t">
            <div className="w-16 h-16 bg-muted mx-auto flex items-center justify-center text-accent rounded-full">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-headline font-bold text-primary">Still have questions?</h3>
              <p className="text-muted-foreground font-light italic">"Our support team is here to assist you with any policy clarifications."</p>
            </div>
            <div className="flex justify-center gap-6">
              <Link href="/contact">
                <button className="px-12 py-5 bg-primary text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-foreground/90 transition-all">
                  Contact Support
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
