import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { PWA } from "@/components/PWA";

export const metadata: Metadata = {
  title: {
    default: "AGEC - Agro Elite Community",
    template: "%s | AGEC - Agro Elite Community"
  },
  description: "Connecting investors with profitable agricultural opportunities. Grow your wealth through agriculture with AGEC.",
  keywords: ["agriculture investment", "agro investment", "farm investment", "agriculture nigeria", "agro elite community", "agec", "farming investment", "nigeria agriculture"],
  authors: [{ name: "AGEC" }],
  creator: "AGEC",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://agec.ng",
    title: "AGEC - Agro Elite Community",
    description: "Connecting investors with profitable agricultural opportunities. Grow your wealth through agriculture with AGEC.",
    siteName: "AGEC",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1200&h=630",
        width: 1200,
        height: 630,
        alt: "AGEC - Agro Elite Community"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AGEC - Agro Elite Community",
    description: "Connecting investors with profitable agricultural opportunities. Grow your wealth through agriculture with AGEC.",
    images: ["https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1200&h=630"],
    creator: "@agec_official"
  },
  metadataBase: new URL("https://agec.ng"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AGEC"
  },
  icons: [
    { rel: "apple-touch-icon", url: "/icon-192.png" },
    { rel: "icon", url: "/icon-192.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#15803d" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <PWA />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
