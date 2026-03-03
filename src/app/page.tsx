"use client";

import { useState, useEffect } from "react";
import { Product, CATEGORIES, CATEGORY_CONFIG } from "@/lib/types";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { totalItems, totalPrice } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory = category === "All" || p.category === category;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen pb-24">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        {/* Welcome */}
        <div className="mb-5">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900">
            Fresh groceries,
            <br />
            <span className="text-brand-green">delivered fast</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Order now, get it at your doorstep
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
          />
        </div>

        {/* Categories */}
        <div className="category-scroll flex gap-2 overflow-x-auto pb-3 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat
                  ? "bg-brand-green text-white shadow-sm"
                  : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
              }`}
            >
              {cat !== "All" && (
                <span className="mr-1.5">
                  {CATEGORY_CONFIG[cat]?.emoji}
                </span>
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-stone-100"
              >
                <div className="h-28 sm:h-32 bg-stone-100 animate-pulse" />
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-4 bg-stone-100 rounded animate-pulse" />
                  <div className="h-3 bg-stone-100 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl">🔍</span>
            <p className="text-stone-500 mt-3">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 stagger">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
          <Link
            href="/cart"
            className="max-w-4xl mx-auto flex items-center justify-between bg-brand-green hover:bg-brand-green-dark text-white rounded-2xl px-5 py-3.5 shadow-lg shadow-emerald-900/20 transition-colors animate-slide-up"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white/20 rounded-lg px-2.5 py-1 text-sm font-bold">
                {totalItems}
              </span>
              <span className="font-medium text-sm">
                {totalItems === 1 ? "item" : "items"} in cart
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg">
                ₹{totalPrice}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
