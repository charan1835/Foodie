"use client";

import { usePathname } from "next/navigation";
import CategoryList from "./CategoryList";
import BusinessList from "./BusinessList";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return isHomePage ? (
    <>
      <CategoryList />
      <BusinessList />
    </>
  ) : (
    children
  );
}
