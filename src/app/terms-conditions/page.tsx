
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Scale, Info, AlertTriangle, ShieldCheck } from "lucide-react";

export default function TermsConditionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-muted/10 text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <span className="text-accent tracking-[0.4em] text-xs font-bold uppercase">Legal Agreement</span>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Terms & Conditions</h1>
          <div className="w-20 h-[2px] bg-accent mx-auto" />
          <p className="text-muted-foreground font-light text-lg max-w-2xl mx-auto italic">
            "By using Viloryi, you agree to the following terms which govern our relationship with you."
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Table of Contents / Sidebar */}
            <div className="lg:col-span-4 hidden lg:block sticky top-32 h-fit space-y-8">
              <div className="p-8 border border-muted bg-white space-y-4">
                <h3 className="text-xs tracking-widest font-bold uppercase text-primary">Navigation</h3>
                <ul className="space-y-4 text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  <li className="hover:text-accent cursor-pointer transition-colors">1. Account Use</li>
                  <li className="hover:text-accent cursor-pointer transition-colors">2. Intellectual Property</li>
                  <li className="hover:text-accent cursor-pointer transition-colors">3. Product Descriptions</li>
                  <li className="hover:text-accent cursor-pointer transition-colors">4. Limitation of Liability</li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-20">
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b pb-4">
                  <Scale className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-headline font-bold text-primary">1. Use of the Site</h2>
                </div>
                <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                  <p>
                    By accessing viloryi.com, you warrant and represent to Viloryi that you are legally entitled to do so and to make use of information made available via the website.
                  </p>
                  <p>
                    You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b pb-4">
                  <ShieldCheck className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-headline font-bold text-primary">2. Intellectual Property</h2>
                </div>
                <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                  <p>
                    The trademarks, names, logos and service marks (collectively "trademarks") displayed on this website are registered and unregistered trademarks of Viloryi. Nothing contained on this website should be construed as granting any license or right to use any trademark without the prior written permission of Viloryi.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b pb-4">
                  <Info className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-headline font-bold text-primary">3. Accuracy of Information</h2>
                </div>
                <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                  <p>
                    We attempt to be as accurate as possible when describing our products on the Site; however, to the extent permitted by applicable law, we do not warrant that the product descriptions, colors, information or other content available on the Site are accurate, complete, reliable, current, or error-free.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b pb-4">
                  <AlertTriangle className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-headline font-bold text-primary">4. Indemnification</h2>
                </div>
                <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                  <p>
                    You agree to indemnify, defend and hold harmless Viloryi and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.
                  </p>
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
