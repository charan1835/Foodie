// app/layout.js
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "react-hot-toast";
import CartProvider from "./_context/CartProvider"; // ✅ Use clean context provider
import ClientWrapper from "./_components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <CartProvider>
            {/* Background Video */}
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
              <ClientWrapper>{children}</ClientWrapper>
            </main>
            <Toaster />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
