
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-muted/10 text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <span className="text-accent tracking-[0.4em] text-xs font-bold uppercase">Our Commitment</span>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Privacy Policy</h1>
          <div className="w-20 h-[2px] bg-accent mx-auto" />
          <p className="text-muted-foreground font-light text-lg max-w-2xl mx-auto italic">
            "Your trust is the foundation of our brand. We are committed to protecting your personal information and your privacy."
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start border-b border-muted pb-16">
            <div className="md:col-span-1 space-y-4">
              <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-headline font-bold text-primary uppercase tracking-widest">Introduction</h2>
            </div>
            <div className="md:col-span-3 space-y-6 text-muted-foreground font-light leading-relaxed">
              <p>
                Viloryi ("we," "us," or "our") operates the website viloryi.com. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
              <p>
                We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start border-b border-muted pb-16">
            <div className="md:col-span-1 space-y-4">
              <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-headline font-bold text-primary uppercase tracking-widest">Data Collection</h2>
            </div>
            <div className="md:col-span-3 space-y-6 text-muted-foreground font-light leading-relaxed">
              <p>
                While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Phone number</li>
                <li>Address, State, Province, ZIP/Postal code, City</li>
                <li>Cookies and Usage Data</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start border-b border-muted pb-16">
            <div className="md:col-span-1 space-y-4">
              <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-headline font-bold text-primary uppercase tracking-widest">Use of Data</h2>
            </div>
            <div className="md:col-span-3 space-y-6 text-muted-foreground font-light leading-relaxed">
              <p>Viloryi uses the collected data for various purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To provide you with news, special offers and general information about other goods, services and events which we offer</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
            <div className="md:col-span-1 space-y-4">
              <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-headline font-bold text-primary uppercase tracking-widest">Legal Basis</h2>
            </div>
            <div className="md:col-span-3 space-y-6 text-muted-foreground font-light leading-relaxed">
              <p>
                Viloryi's legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Data we collect and the specific context in which we collect it. We may process your Personal Data because:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We need to perform a contract with you</li>
                <li>You have given us permission to do so</li>
                <li>The processing is in our legitimate interests and it is not overridden by your rights</li>
                <li>For payment processing purposes</li>
                <li>To comply with the law</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
