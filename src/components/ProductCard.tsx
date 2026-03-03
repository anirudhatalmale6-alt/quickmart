"use client";

import { useState } from "react";
import { Product, CATEGORY_CONFIG } from "@/lib/types";
import { useCart } from "./CartProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const qty = getItemQuantity(product.id);
  const config = CATEGORY_CONFIG[product.category] || {
    gradient: "from-stone-100 to-stone-50",
  };

  const handleAdd = () => {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 300);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 opacity-0 animate-fade-in">
      {/* Emoji display area */}
      <div
        className={`bg-gradient-to-br ${config.gradient} h-28 sm:h-32 flex items-center justify-center relative`}
      >
        <span className="text-5xl sm:text-6xl">{product.emoji}</span>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-medium text-stone-500 bg-white px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <h3 className="font-heading font-semibold text-sm sm:text-base text-stone-900 leading-tight">
          {product.name}
        </h3>
        <p className="text-xs text-stone-400 mt-0.5">{product.unit}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="font-heading font-bold text-base sm:text-lg text-stone-900">
            ₹{product.price}
          </span>

          {!product.inStock ? (
            <span className="text-xs text-stone-400">Unavailable</span>
          ) : qty === 0 ? (
            <button
              onClick={handleAdd}
              className={`bg-brand-green hover:bg-brand-green-dark text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition-all active:scale-95 ${justAdded ? "animate-pop" : ""}`}
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(product.id, qty - 1)}
                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold transition-colors"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold text-sm text-brand-green">
                {qty}
              </span>
              <button
                onClick={() => updateQuantity(product.id, qty + 1)}
                className="w-8 h-8 rounded-lg bg-brand-green hover:bg-brand-green-dark flex items-center justify-center text-white font-bold transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
