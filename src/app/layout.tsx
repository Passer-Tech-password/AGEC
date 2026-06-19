import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGEC - Agro Elite Community",
  description: "Connecting investors with profitable agricultural opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
