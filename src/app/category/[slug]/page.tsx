import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryContent } from "@/components/shop/CategoryContent";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className="min-h-screen pt-24 bg-background">
      <Navbar />
      <CategoryContent categorySlug={slug} />
      <Footer />
    </main>
  );
}
