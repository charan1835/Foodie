"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import GlobalApi from "../_utils/GlobelApi";
import Businessitem from "./Businessitem";
import Loadingpage from "./Loadingpage";
import { motion } from "framer-motion";

// Separate the component that uses useSearchParams
function BusinessListContent() {
  const [businessList, setBusinessList] = useState([]);
  const params = useSearchParams();
  const selectedCategory = params.get("category");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      GlobalApi.getBusinessList(selectedCategory).then((res) => {
        console.log("Fetched businesses:", res);
        setBusinessList(res.restaurants || []);
        setLoading(false);
      });
    } else {
      setBusinessList([]);
    }
  }, [selectedCategory]);

  const variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">
        {selectedCategory ? `Restaurants for ${selectedCategory}` : "Select a category"}
      </h2>
      <h2 className="text-lg font-semibold mb-4 text-gray-600 animate-pulse hover:text-blue-600 transition duration-300">
        {businessList.length} Results Found
      </h2>
      {loading ? (
        <Loadingpage />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {businessList.length === 0 && (
              <p className="text-gray-500">No restaurants found.</p>
            )}
            {businessList.length > 0 &&
              businessList.map((restaurant, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={variants}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Businessitem business={restaurant} />
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Main component with Suspense wrapper
function BusinessList() {
  return (
    <Suspense fallback={<Loadingpage />}>
      <BusinessListContent />
    </Suspense>
  );
}

export default BusinessList;