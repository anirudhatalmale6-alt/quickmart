"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-stone-200/60">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 bg-brand-green rounded-xl flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </span>
          <span className="font-heading font-bold text-lg text-stone-900 tracking-tight">
            Quick<span className="text-brand-green">Mart</span>
          </span>
        </Link>

        <Link
          href="/cart"
          className="relative flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 transition-colors rounded-xl px-3.5 py-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-stone-700"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-brand-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pop">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
