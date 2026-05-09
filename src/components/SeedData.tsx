
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Database, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CATEGORIES = [
  {
    id: "kurti-sets",
    name: "Kurti Sets",
    description: "Elegant ensembles for the modern muse, blending tradition with contemporary flair.",
    imageUrl: "https://picsum.photos/seed/kurti-set/800/1000"
  },
  {
    id: "coord-sets",
    name: "Co-ord Sets",
    description: "Seamlessly tailored for effortless sophistication and comfort.",
    imageUrl: "https://picsum.photos/seed/coord/800/1000"
  },
  {
    id: "luxe-kurtis",
    name: "Luxe Kurtis",
    description: "Minimalist silhouettes with a touch of grandeur for any hour.",
    imageUrl: "https://picsum.photos/seed/kurti/800/1000"
  },
  {
    id: "occasion-wear",
    name: "Occasion Wear",
    description: "Exquisite craftsmanship designed to celebrate your most precious moments.",
    imageUrl: "https://picsum.photos/seed/occasion/800/1000"
  },
  {
    id: "daily-essentials",
    name: "Daily Essentials",
    description: "Breathable luxury fabrics for your everyday narrative.",
    imageUrl: "https://picsum.photos/seed/daily/800/1000"
  },
  {
    id: "winter-velvet",
    name: "Winter Velvet",
    description: "Rich textures and deep tones for the festive winter season.",
    imageUrl: "https://picsum.photos/seed/velvet/800/1000"
  }
];

export function SeedData() {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const db = useFirestore();

  const handleSeed = async () => {
    if (!db) return;
    setLoading(true);

    try {
      const batch = CATEGORIES.map((cat) => {
        const docRef = doc(collection(db, 'categories'), cat.id);
        return setDoc(docRef, cat, { merge: true });
      });

      await Promise.all(batch);
      setSeeded(true);
      toast({
        title: "Database Seeded",
        description: "6 Premium categories have been added to Firestore.",
      });
    } catch (error: any) {
      console.error("Seeding error:", error);
      toast({
        variant: "destructive",
        title: "Seeding Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <Button
        onClick={handleSeed}
        disabled={loading || seeded}
        className="rounded-full shadow-2xl bg-white text-primary border-accent hover:bg-muted"
        variant="outline"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : seeded ? (
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
        ) : (
          <Database className="w-4 h-4 mr-2" />
        )}
        {seeded ? "DATA SEEDED" : "SEED CATEGORIES"}
      </Button>
    </div>
  );
}
