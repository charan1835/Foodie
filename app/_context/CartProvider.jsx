// app/_context/CartProvider.jsx
"use client";

import { createContext, useState } from "react";

export const CartupdateContext = createContext();

export default function CartProvider({ children }) {
  const [updateCart, setUpdateCart] = useState(false);

  return (
    <CartupdateContext.Provider value={{ updateCart, setUpdateCart }}>
      {children}
    </CartupdateContext.Provider>
  );
}
