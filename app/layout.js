// app/layout.js
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "react-hot-toast";
import { CartupdateContext } from "./_context/CartupdateContext";
import { useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next"
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [updateCart, setUpdateCart] = useState(false);

  return (
    <ClerkProvider>
      <CartupdateContext.Provider value={{ updateCart, setUpdateCart }}>
        <html lang="en">
          <body className={inter.className}>
            {/* Background */}
            <video
              autoPlay
              loop
              muted
              className="fixed top-0 left-0 w-full h-full object-cover -z-10"
              src="/videos/chiken-grill.mp4"
            />
            <div className="fixed inset-0 bg-black/40 z-0" />
            <Header />
            <main className="relative z-10 pt-20 text-white">
              {children}
            </main>
            <Toaster />
          </body>
        </html>
      </CartupdateContext.Provider>
    </ClerkProvider>
  );
}