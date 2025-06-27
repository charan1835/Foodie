 
"use client";
import { create } from 'zustand';

const useCartStore = create((set) => ({
  cartCount: 0,
  cartItems: [],
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  addItemToCart: (item) =>
    set((state) => ({
      cartItems: [...state.cartItems, item],
      cartCount: state.cartCount + 1,
    })),
  removeItemFromCart: (id) =>
    set((state) => {
      const filteredItems = state.cartItems.filter((item) => item.id !== id);
      return {
        cartItems: filteredItems,
        cartCount: filteredItems.length,
      };
    }),
}));
export default useCartStore;
