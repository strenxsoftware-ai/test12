import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ShopProvider } from "@/context/ShopContext";
import { FirebaseClientProvider } from '@/firebase/client-provider';

/**
 * Root Layout for Viloryi.
 * Includes global providers and enhanced SEO metadata for Google Indexing.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://viloryi.com'),
  title: {
    default: 'Viloryi | Premium Women\'s Fashion',
    template: '%s | Viloryi'
  },
  description: 'Wear Your Elegance with premium Kurti Sets & Co-ord Styles. Experience the harmony of traditional silhouettes and modern minimalism.',
  keywords: ['fashion', 'kurti sets', 'co-ord sets', 'women clothing', 'luxury ethnic wear', 'Viloryi premium'],
  authors: [{ name: 'Viloryi' }],
  creator: 'Viloryi',
  publisher: 'Viloryi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Viloryi | Premium Women\'s Fashion',
    description: 'Wear Your Elegance with premium Kurti Sets & Co-ord Styles.',
    url: 'https://viloryi.com',
    siteName: 'Viloryi',
    images: [
      {
        url: '/hero_banner.png',
        width: 1200,
        height: 630,
        alt: 'Viloryi Premium Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viloryi | Premium Women\'s Fashion',
    description: 'Wear Your Elegance with premium Kurti Sets & Co-ord Styles.',
    images: ['/hero_banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <ShopProvider>
            {children}
            <Toaster />
          </ShopProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
