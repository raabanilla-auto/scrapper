import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/scrap-ledger/ServiceWorkerRegister";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Scrap Ledger",
  description: "Track scrap products, recovered inventory, element pricing, and sale estimates.",
};

export const viewport: Viewport = {
  themeColor: "#171310",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfairDisplay.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ margin: 0, background: "#171310" }}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
