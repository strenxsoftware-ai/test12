
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, Instagram, MessageSquare, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-muted/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <span className="text-accent tracking-[0.4em] text-xs font-bold uppercase">Get in Touch</span>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Contact Viloryi</h1>
          <div className="w-20 h-[2px] bg-accent mx-auto" />
          <p className="text-muted-foreground font-light text-lg max-w-2xl mx-auto italic">
            "Whether you have a question about our collections or need assistance with an order, our team is here to help you."
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Contact Information */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-headline font-bold text-primary">Connect With Us</h2>
                <p className="text-muted-foreground font-light">
                  Reach out through any of our official channels. We aim to respond to all inquiries within 24 hours.
                </p>
              </div>

              <div className="space-y-8">
                <a 
                  href="https://wa.me/919696731313" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-6 group"
                >
                  <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-widest font-bold uppercase mb-1">WhatsApp</h4>
                    <p className="text-lg font-medium group-hover:text-accent transition-colors">+91 96967 31313</p>
                  </div>
                </a>

                <a 
                  href="https://instagram.com/viloryi.official" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-6 group"
                >
                  <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-widest font-bold uppercase mb-1">Instagram</h4>
                    <p className="text-lg font-medium group-hover:text-accent transition-colors">@viloryi.official</p>
                  </div>
                </a>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-widest font-bold uppercase mb-1">Email</h4>
                    <p className="text-lg font-medium">viloryi.official@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-widest font-bold uppercase mb-1">Location</h4>
                    <p className="text-lg font-medium">Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-muted/30 p-8 md:p-12 border border-muted">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] tracking-widest font-bold uppercase">Your Name</Label>
                    <Input id="name" placeholder="E.g. Monika" className="rounded-none border-muted focus:border-accent ring-0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] tracking-widest font-bold uppercase">Email Address</Label>
                    <Input id="email" type="email" placeholder="monika@gmail.com" className="rounded-none border-muted focus:border-accent ring-0" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[10px] tracking-widest font-bold uppercase">Subject</Label>
                  <Input id="subject" placeholder="What can we help you with?" className="rounded-none border-muted focus:border-accent ring-0" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[10px] tracking-widest font-bold uppercase">Message</Label>
                  <Textarea id="message" placeholder="Type your message here..." className="rounded-none border-muted focus:border-accent ring-0 min-h-[150px]" />
                </div>

                <Button className="w-full bg-primary text-white py-8 tracking-[0.3em] font-bold uppercase rounded-none hover:bg-foreground/90 transition-all">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
