"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-brand-green-light rounded-full flex items-center justify-center mx-auto animate-pop">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="font-heading font-bold text-2xl text-stone-900 mt-6">
          Order Placed!
        </h1>
        <p className="text-stone-500 text-sm mt-2">
          Your order has been received and is being processed.
        </p>

        {orderId && (
          <div className="bg-white rounded-2xl p-4 border border-stone-100 mt-6">
            <p className="text-xs text-stone-400 uppercase tracking-wider">
              Order ID
            </p>
            <p className="font-heading font-bold text-lg text-brand-green mt-1">
              {orderId}
            </p>
          </div>
        )}

        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 mt-4">
          <p className="text-sm text-emerald-800">
            We will contact you on your phone number to confirm delivery
            details.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block mt-8 bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-stone-400">Loading...</span>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
