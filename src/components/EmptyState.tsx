import { XCircle } from "lucide-react";
import React from "react";

const EmptyState = () => {
  return (
    <div className="relative rounded-lg col-span-full flex h-80 w-full flex-col items-center justify-center bg-red-50 p-12">
      <XCircle className="h-8 w-8 text-black" />
      <h3 className="font-semibold text-xl"> No product found</h3>
      <p className="text-gray-500 text-sm">We found no search result for those filters</p>
    </div>
  );
};

export default EmptyState;
