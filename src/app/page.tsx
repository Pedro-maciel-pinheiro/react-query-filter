"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  COLOR_FILTERS,
  DEFAULT_CUSTOM_PRICE,
  PRICE_FILTERS,
  SIZE_FILTERS,
  SORT_OPTIONS,
  SUBCATEGORIES,
} from "@/constant/sort-options";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Filter } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { QueryResult } from "@upstash/vector";
import { Product } from "@/types/type-index";
import { ProductCard } from "@/components/products/product-card";
import ProductSkeleton from "@/components/products/product-skeleton";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProductState } from "@/lib/validators/product-validator";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import debounce from "lodash.debounce";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    sort: "none",
    color: ["beige", "blue", "green", "purple", "white"],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ["L", "M", "S"],
  });

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<Product>[]>(
        "http://localhost:3000/api/products",
        {
          filter: {
            sort: filter.sort,
            color: filter.color,
            price: filter.price.range,
            size: filter.size,
          },
        },
      );
      return data;
    },
  });
  console.log(filter);
  const onSubmit = () => refetch();

  const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(debouncedSubmit, []);

  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">;
    value: string;
  }) => {
    const isFilterApplied = filter[category].includes(value as never);

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((item) => item !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }

    _debouncedSubmit();
  };

  const minPrice = Math.min(filter.price.range[0], filter.price.range[1]);
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          High-quality cotton selection
        </h1>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.name}
                  className={cn("block w-full px-4 py-2 text-left text-sm", {
                    "bg-gray-100 text-gray-900": option.value === filter.sort,
                    "text-gray-500": option.value !== filter.sort,
                  })}
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, sort: option.value }));
                    _debouncedSubmit();
                  }}
                >
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant={"outline"}
            className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          <div className="">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {SUBCATEGORIES.map((category) => (
                <li key={category.name} className="">
                  <button
                    disabled={!category.selected}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            <Accordion type="multiple" className="animate-none">
              {/* Color filter */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-2 text-sm text-gray-400 hover:text-gray-50">
                  <span className="font-medium text-gray-900">Color</span>
                </AccordionTrigger>
                <AccordionContent className="animate-none pt-6">
                  <ul className="space-y-4">
                    {COLOR_FILTERS.options.map((option, optionIndex) => (
                      <li key={option.value} className="flex items-center">
                        <Checkbox
                          id={`color-${optionIndex}`}
                          onCheckedChange={() => {
                            applyArrayFilter({
                              category: "color",
                              value: option.value,
                            });
                          }}
                          checked={filter.color.includes(option.value)}
                          className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label
                          htmlFor={`color-${optionIndex}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </Label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/*  Size Filters */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-2 text-sm text-gray-400 hover:text-gray-50">
                  <span className="font-medium text-gray-900">Size</span>
                </AccordionTrigger>
                <AccordionContent className="animate-none pt-6">
                  <ul className="space-y-4">
                    {SIZE_FILTERS.options.map((option, optionIndex) => (
                      <li key={option.value} className="flex items-center">
                        <Checkbox
                          id={`size-${optionIndex}`}
                          onCheckedChange={() => {
                            applyArrayFilter({
                              category: "size",
                              value: option.value,
                            });
                          }}
                          checked={filter.size.includes(option.value)}
                          className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label
                          htmlFor={`size-${optionIndex}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </Label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* Price Filter */}
              <AccordionItem value="price">
                <AccordionTrigger className="py-2 text-sm text-gray-400 hover:text-gray-50">
                  <span className="font-medium text-gray-900">Price</span>
                </AccordionTrigger>
                <AccordionContent className="animate-none pt-6">
                  <ul className="space-y-4">
                    {PRICE_FILTERS.options.map((option, optionIndex) => (
                      <li key={option.label} className="flex items-center">
                        <Checkbox
                          id={`price-${optionIndex}`}
                          onCheckedChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...option.value],
                              },
                            }));
                            _debouncedSubmit();
                          }}
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === option.value[0] &&
                            filter.price.range[1] === option.value[1]
                          }
                          className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label
                          htmlFor={`price-${optionIndex}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </Label>
                      </li>
                    ))}
                    <li className="flex flex-col justify-center gap-2">
                      <div>
                        <Checkbox
                          id={`price-${PRICE_FILTERS.options.length}`}
                          onCheckedChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 100],
                              },
                            }));
                            _debouncedSubmit();
                          }}
                          checked={filter.price.isCustom}
                          className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label
                          htmlFor={`price-${PRICE_FILTERS.options.length}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          Custom
                        </Label>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-medium">Price</p>
                        <div>
                          {filter.price.isCustom
                            ? minPrice.toFixed(0)
                            : filter.price.range[0].toFixed(0)}{" "}
                          $ -{" "}
                          {filter.price.isCustom
                            ? maxPrice.toFixed(0)
                            : filter.price.range[1].toFixed(0)}{" "}
                          $
                        </div>
                      </div>
                      <Slider
                        className={cn("rounded-lg border", {
                          "opacity-50": !filter.price.isCustom,
                          "border-black/50": filter.price.isCustom,
                        })}
                        disabled={!filter.price.isCustom}
                        onValueChange={(range) => {
                          const [newMin, newMax] = range;
                          setFilter((prev) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [newMin, newMax],
                            },
                          }));
                          _debouncedSubmit();
                        }}
                        value={
                          filter.price.isCustom
                            ? filter.price.range
                            : DEFAULT_CUSTOM_PRICE
                        }
                        min={DEFAULT_CUSTOM_PRICE[0]}
                        defaultValue={DEFAULT_CUSTOM_PRICE}
                        max={DEFAULT_CUSTOM_PRICE[1]}
                        step={5}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {/* Procuct Grid*/}
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
            {products && products.length === 0 ? <EmptyState/> : products
              ? products.map((product) => (
                  <ProductCard key={product.id} product={product.metadata!} />
                ))
              : new Array(12)
                  .fill(null)
                  .map((_, index) => <ProductSkeleton key={index} />)}
          </ul>
        </div>
      </section>
    </main>
  );
}
