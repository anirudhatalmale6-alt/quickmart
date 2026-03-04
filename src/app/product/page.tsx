"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getProductById } from "@/lib/clientStore";
import { useCart } from "@/components/CartProvider";
import { Product, CATEGORY_CONFIG } from "@/lib/types";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const found = getProductById(id);
      setProduct(found);
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen pb-8">
        <Header />
        <main className="max-w-2xl mx-auto px-4 pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-72 bg-stone-100 rounded-2xl" />
            <div className="h-6 bg-stone-100 rounded w-2/3" />
            <div className="h-4 bg-stone-100 rounded w-1/3" />
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pb-8">
        <Header />
        <main className="max-w-2xl mx-auto px-4 pt-6 text-center">
          <div className="py-16">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-stone-500 text-lg mb-2">Product not found</p>
            <Link
              href="/"
              className="text-brand-green font-medium text-sm hover:underline"
            >
              Back to Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const images = product.images || [];
  const config = CATEGORY_CONFIG[product.category] || {
    gradient: "from-stone-100 to-stone-50",
  };
  const qty = getItemQuantity(product.id);

  const handleAdd = () => {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 400);
  };

  return (
    <div className="min-h-screen pb-32">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-brand-green transition-colors mb-4"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Main Image */}
        <div
          className={`bg-gradient-to-br ${config.gradient} rounded-2xl overflow-hidden relative`}
        >
          {images.length > 0 ? (
            <img
              src={images[activeImage] || images[0]}
              alt={product.name}
              className="w-full h-72 sm:h-80 object-cover"
            />
          ) : (
            <div className="w-full h-72 sm:h-80 flex items-center justify-center">
              <span className="text-8xl">{product.emoji}</span>
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-medium text-stone-500 bg-white px-4 py-2 rounded-full shadow-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activeImage === i
                    ? "border-brand-green shadow-sm"
                    : "border-stone-200 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Product Info */}
        <div className="mt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading font-bold text-xl sm:text-2xl text-stone-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-stone-500 mt-1 font-medium">
                {product.unit} · {product.category}
              </p>
            </div>
            <span className="font-heading font-bold text-2xl text-brand-green flex-shrink-0">
              ₹{product.price}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-4 bg-white rounded-2xl p-4 border border-stone-100">
              <h2 className="font-heading font-semibold text-sm text-stone-700 mb-2">
                About this product
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom Add to Cart Bar */}
      {product.inStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-stone-200 p-4 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-bold text-lg text-stone-900">
                ₹{product.price}
              </p>
              <p className="text-xs text-stone-400">{product.unit}</p>
            </div>

            {qty === 0 ? (
              <button
                onClick={handleAdd}
                className={`bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all active:scale-95 ${
                  justAdded ? "animate-pop" : ""
                }`}
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, qty - 1)}
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold transition-colors text-lg"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-brand-green text-lg">
                  {qty}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, qty + 1)}
                  className="w-10 h-10 rounded-xl bg-brand-green hover:bg-brand-green-dark flex items-center justify-center text-white font-bold transition-colors text-lg"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-stone-400">Loading...</span>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
