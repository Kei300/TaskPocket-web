import type { Metadata } from "next";
import { Pixelify_Sans, VT323, Courier_Prime, Share_Tech_Mono } from "next/font/google";
import { Providers } from "@/src/components/Providers";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  weight: "400",
  variable: "--font-courier-prime",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskPocket — EduTask",
  description:
    "Tareas, tiempos y organización al alcance de tu mano. Con Bun, el Guardián del Tiempo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${pixelifySans.variable} ${vt323.variable} ${courierPrime.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ice-white text-charcoal font-pixelify">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
