"use client";

import { Suspense } from "react";
import CategoryList from "./_components/CategoryList";
import BusinessList from "./_components/BusinessList";

// Loading component for BusinessList
function BusinessListSkeleton() {
  return (
    <div className="px-4 py-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200/20 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200/20 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200/20 h-80 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoryList />
      </Suspense>
      <Suspense fallback={<BusinessListSkeleton />}>
        <BusinessList />
      </Suspense>
    </>
  );
}