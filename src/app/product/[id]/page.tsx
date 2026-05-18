
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetails } from "@/components/shop/ProductDetails";
import { JsonLd } from "@/components/seo/JsonLd";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase for Server Side data fetching for SEO
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch product data for SEO schema
  let productData = null;
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      productData = { id: docSnap.id, ...docSnap.data() } as any;
    }
  } catch (error) {
    console.error("Error fetching product for SEO:", error);
  }

  const effectivePrice = productData?.discountPrice || productData?.originalPrice || productData?.price || 0;
  
  const productSchema = productData ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productData.name,
    "image": productData.images || [],
    "description": productData.description,
    "sku": productData.id,
    "brand": {
      "@type": "Brand",
      "name": "Viloryi"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://viloryi.com/product/${productData.id}`,
      "priceCurrency": "INR",
      "price": effectivePrice,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": productData.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Viloryi"
      }
    }
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://viloryi.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": "https://viloryi.com/#collections"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": productData?.name || "Product",
        "item": `https://viloryi.com/product/${id}`
      }
    ]
  };

  return (
    <main className="min-h-screen pt-24">
      {productSchema && <JsonLd data={productSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <Navbar />
      <ProductDetails productId={id} />
      <Footer />
    </main>
  );
}
