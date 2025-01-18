import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProductSkeleton = () => {
  return (
    <div className="relative ">
      <Skeleton className="lg:aspect-none aspect-square w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75 lg:h-80">
        <div className="h-full w-full bg-gray-300" />
      </Skeleton>
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-full rounded-lg bg-gray-300" />
        <Skeleton className="h-4 w-28 rounded-lg bg-gray-300" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
