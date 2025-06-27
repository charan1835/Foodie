// app/layout.js

import { ClerkProvider, UserButton } from "@clerk/nextjs";
import "./globals.css";
import CategoryList from "./_components/CategoryList";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <div>
        {children}
      </div>
     
    </ClerkProvider>
  );
}
