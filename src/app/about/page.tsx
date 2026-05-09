
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AboutPage() {
  const storyImg = PlaceHolderImages.find(img => img.id === "about-craft");
  const missionImg = PlaceHolderImages.find(img => img.id === "insta-3");
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-model");

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 text-center bg-muted/10">
        <div className="container mx-auto max-w-4xl space-y-8 animate-fade-in opacity-0">
          <span className="text-accent tracking-[0.4em] text-xs font-bold uppercase">The Viloryi Essence</span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight text-primary">
            Elegance is an <br /> Experience
          </h1>
          <div className="w-20 h-[2px] bg-accent mx-auto" />
          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed italic max-w-2xl mx-auto">
            "Viloryi is a modern women's fashion brand focused on elegance, comfort and confidence. Each piece is designed to make you feel beautiful every day."
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative aspect-[4/5] bg-muted overflow-hidden">
              {storyImg?.imageUrl && (
                <Image
                  src={storyImg.imageUrl}
                  alt="Viloryi Craftsmanship"
                  fill
                  className="object-cover"
                  data-ai-hint="fabric detail"
                />
              )}
            </div>
            <div className="space-y-8">
              <span className="text-accent tracking-[0.2em] text-xs font-bold uppercase">The Narrative</span>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">Our Story</h2>
              <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-lg">
                <p>
                  Founded on the principles of timeless silhouettes and contemporary minimalism, Viloryi was born to fill a void in the modern woman's wardrobe. We believe that what you wear is an extension of your spirit.
                </p>
                <p>
                  Our journey began with a single vision: to create ethnic and contemporary wear that feels like a second skin. By marrying premium fabrics with precision tailoring, we've crafted a collection that celebrates the multifaceted life of today's woman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 md:order-1">
              <span className="text-accent tracking-[0.2em] text-xs font-bold uppercase">The Purpose</span>
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Mission</h2>
              <p className="text-lg opacity-80 font-light leading-relaxed">
                Our mission is to empower women through effortless style. We design for the woman who finds beauty in simplicity and strength in comfort. Viloryi isn't just about clothing; it's about the confidence that comes from knowing you are perfectly dressed for any moment.
              </p>
            </div>
            <div className="relative aspect-square md:aspect-[4/3] bg-white/10 overflow-hidden order-1 md:order-2">
              {missionImg?.imageUrl && (
                <Image
                  src={missionImg.imageUrl}
                  alt="Viloryi Mission"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  data-ai-hint="luxury interior"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <span className="text-accent tracking-[0.2em] text-xs font-bold uppercase">The Vow</span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">Our Quality Promise</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-muted mx-auto flex items-center justify-center rounded-full text-accent">
                <span className="text-2xl font-bold">01</span>
              </div>
              <h3 className="text-xl font-headline font-bold">Fine Sourcing</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                We travel across weaving clusters to source the highest grade of organic cotton, mulberry silk, and premium linen.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-muted mx-auto flex items-center justify-center rounded-full text-accent">
                <span className="text-2xl font-bold">02</span>
              </div>
              <h3 className="text-xl font-headline font-bold">Artisanal Craft</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                Each piece is meticulously crafted by master tailors, ensuring every seam is as beautiful inside as it is outside.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-muted mx-auto flex items-center justify-center rounded-full text-accent">
                <span className="text-2xl font-bold">03</span>
              </div>
              <h3 className="text-xl font-headline font-bold">Conscious Luxury</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                Luxury that doesn't cost the earth. We focus on small-batch production to ensure zero waste and maximum quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
