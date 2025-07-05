// app/layout.js
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "react-hot-toast";
import { CartupdateContext } from "./_context/CartupdateContext";
import { useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

            {/* WhatsApp Floating Button */}
            <a
              href="https://wa.me/918688605760?text=Hey hello i have qury regardeing the order"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition duration-300"
            >
              {/* Placeholder WhatsApp SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 14h.01M16 10h.01M9 16h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2z"
                />
              </svg>
            </a>
          </body>
        </html>
      </CartupdateContext.Provider>
    </ClerkProvider>
  );
}
