"use client";

import { useEffect, useState, useRef } from "react";
import GlobalApi from "../_utils/GlobelApi";
import { ArrowRightCircle, ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  const scrollRef = useRef(null);
  const params = useSearchParams();
  const selectedCategory = params.get("category");

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = () => {
    GlobalApi.getCategory().then((resp) => {
      setCategoryList(resp.categories);
    });
  };

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollLeft += direction === "right" ? 200 : -200;
    }
  };

  return (
    <div className="relative px-4 py-4 scroll-hidden">
      <div
        ref={scrollRef}
        className="overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar scroll-hidden"
      >
        <div className="flex gap-4">
          {categoryList.map((category, index) => {
            const isSelected = selectedCategory === category.slug;
            return (
              <Link
                href={`?category=${category.slug}`}
                key={index}
                className={`min-w-[120px] flex-shrink-0 flex flex-col items-center gap-2 border rounded-xl p-3 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${
                  isSelected
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                <img
                  src={category.icon?.url}
                  alt={category.name}
                  height={50}
                  width={50}
                  className="rounded-full object-cover"
                />
                <span className="text-sm font-medium text-center">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Scroll Arrows */}
      <ArrowLeftCircle
        className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer z-10"
        size={30}
        onClick={() => handleScroll("left")}
      />
      <ArrowRightCircle
        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer z-10"
        size={30}
        onClick={() => handleScroll("right")}
      />
    </div>
  );
}

export default CategoryList;
