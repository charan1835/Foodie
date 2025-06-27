"use client";

import { Loader2 } from "lucide-react";

const Loadingpage = () => {
  return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-gray-600 text-lg font-medium">Loading restaurants...</p>
      </div>
    </div>
  );
};

export default Loadingpage;
