import type { Metadata } from "next";
import "./globals.css";
import { GlobalProvider } from "@/lib/context/GlobalContext";
import { Suspense } from "react";
import { Analytics } from '@vercel/analytics/next';
import CookieConsent from "@/components/Cookies";
import { GoogleAnalytics } from '@next/third-parties/google'

// Import error prevention system for development
if (process.env.NODE_ENV === 'development') {
  import('@/lib/debug/error-prevention').then(({ errorPreventionSystem }) => {
    errorPreventionSystem.startMonitoring()
  }).catch(() => {
    // Fail silently in development if module doesn't exist
  })
}

const gaID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  title: "BizLevel - Business Skills Training Platform",
  description: "Master business skills through interactive lessons and AI-powered learning",
  keywords: "business, training, skills, education, AI, learning",
  authors: [{ name: "BizLevel Team" }],
  robots: "index, follow",
  // Performance optimizations
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://bizlevel.app',
  },
  // Preload critical resources
  other: {
    'dns-prefetch': '//fonts.googleapis.com',
    'preconnect': process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  },
};

// Separate viewport export for Next.js 15
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link 
          rel="preconnect" 
          href={process.env.NEXT_PUBLIC_SUPABASE_URL} 
          crossOrigin="anonymous"
        />
        <link 
          rel="dns-prefetch" 
          href="//fonts.googleapis.com" 
        />
        {/* Performance hints */}
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <GlobalProvider>
            {children}
            <Analytics />
            <CookieConsent />
            { gaID && (
                <GoogleAnalytics gaId={gaID}/>
            )}
          </GlobalProvider>
        </Suspense>
      </body>
    </html>
  );
}
