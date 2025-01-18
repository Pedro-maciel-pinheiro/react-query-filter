import { ProductCardProps } from "@/types/type-index";
import React from "react";

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative cursor-pointer">
      <div className="aspect-h-1 aspect-w-1 lg:aspect-none w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75 lg:h-80 ">
        <img
          src={product.imageId}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="my-1 text-sm text-gray-500">
            Size {product.size.toUpperCase()} , {product.color}
          </p>
        </div>
        <p className="text-sm font-medium text-gray-900">{product.price}</p>
      </div>
    </div>
  );
};
