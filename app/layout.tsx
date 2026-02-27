import type { Metadata } from "next";
import { DM_Serif_Display, Bodoni_Moda } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Guessing the Wealth Gap",
  description: "An interactive visualization of wealth inequality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${bodoni.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
