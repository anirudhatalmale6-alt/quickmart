"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useCart } from "@/components/CartProvider";
import { CATEGORY_CONFIG } from "@/lib/types";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="text-6xl">🛒</span>
          <h2 className="font-heading font-bold text-xl text-stone-900 mt-4">
            Your cart is empty
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            Add some items to get started
          </p>
          <Link
            href="/"
            className="inline-block mt-6 bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <h1 className="font-heading font-bold text-2xl text-stone-900 mb-5">
          Your Cart
        </h1>

        <div className="space-y-3">
          {items.map(({ product, quantity }) => {
            const config = CATEGORY_CONFIG[product.category];
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 border border-stone-100 flex items-center gap-4"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${config?.gradient || "from-stone-100 to-stone-50"} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-3xl">{product.emoji}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm text-stone-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-400">{product.unit}</p>
                  <p className="font-heading font-bold text-stone-900 mt-1">
                    ₹{product.price * quantity}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
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
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateQuantity(product.id, quantity - 1)
                      }
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold text-sm transition-colors"
                    >
                      −
                    </button>
                    <span className="w-7 text-center font-semibold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, quantity + 1)
                      }
                      className="w-7 h-7 rounded-lg bg-brand-green hover:bg-brand-green-dark flex items-center justify-center text-white font-bold text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 bg-white rounded-2xl p-4 border border-stone-100">
          <div className="flex justify-between text-sm text-stone-500">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-500 mt-2">
            <span>Delivery</span>
            <span className="text-brand-green font-medium">Free</span>
          </div>
          <div className="border-t border-stone-100 mt-3 pt-3 flex justify-between">
            <span className="font-heading font-bold text-stone-900">
              Total
            </span>
            <span className="font-heading font-bold text-lg text-stone-900">
              ₹{totalPrice}
            </span>
          </div>
        </div>
      </main>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <Link
          href="/checkout"
          className="max-w-2xl mx-auto flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white font-heading font-bold text-lg rounded-2xl px-5 py-4 shadow-lg shadow-emerald-900/20 transition-colors"
        >
          Proceed to Checkout
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
