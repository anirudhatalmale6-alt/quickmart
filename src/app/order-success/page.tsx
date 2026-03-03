"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function DeliveryAnimation() {
  const [progress, setProgress] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [stage, setStage] = useState(0);

  const stages = [
    { label: "Order Confirmed", icon: "check" },
    { label: "Preparing", icon: "box" },
    { label: "Out for Delivery", icon: "scooter" },
    { label: "Arriving Soon", icon: "location" },
  ];

  useEffect(() => {
    // Animate progress bar
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 35) {
          clearInterval(timer);
          return 35;
        }
        return prev + 1;
      });
    }, 80);

    // Animate stages
    const stageTimer = setTimeout(() => setStage(1), 1500);
    const stageTimer2 = setTimeout(() => setStage(2), 3500);

    // Countdown minutes
    const minuteTimer = setInterval(() => {
      setMinutes((prev) => (prev > 25 ? prev - 1 : 25));
    }, 600);

    return () => {
      clearInterval(timer);
      clearTimeout(stageTimer);
      clearTimeout(stageTimer2);
      clearInterval(minuteTimer);
    };
  }, []);

  return (
    <div className="mt-6 space-y-5">
      {/* Animated Delivery Scene */}
      <div className="relative bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 rounded-2xl p-5 border border-emerald-200 overflow-hidden">
        {/* Road */}
        <div className="relative h-16 mb-3">
          {/* Road line */}
          <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-emerald-200" />
          <div className="absolute bottom-3 left-0 right-0 flex gap-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-0.5 bg-emerald-300 flex-shrink-0 road-dash"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          {/* Delivery scooter */}
          <div
            className="absolute bottom-5 delivery-scooter"
            style={{ left: `${Math.min(progress, 35)}%` }}
          >
            <svg
              width="48"
              height="36"
              viewBox="0 0 48 36"
              fill="none"
              className="scooter-bounce"
            >
              {/* Body */}
              <rect x="12" y="8" width="20" height="14" rx="3" fill="#059669" />
              {/* Package */}
              <rect x="14" y="4" width="10" height="8" rx="2" fill="#F97316" />
              <text x="16" y="11" fontSize="6" fill="white">
                Q
              </text>
              {/* Wheels */}
              <circle cx="14" cy="26" r="4" fill="#1c1917" />
              <circle cx="14" cy="26" r="2" fill="#525252" />
              <circle cx="34" cy="26" r="4" fill="#1c1917" />
              <circle cx="34" cy="26" r="2" fill="#525252" />
              {/* Handlebar */}
              <line
                x1="32"
                y1="8"
                x2="36"
                y2="4"
                stroke="#1c1917"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Exhaust puff */}
              <circle
                cx="6"
                cy="22"
                r="2"
                fill="#d6d3d1"
                className="exhaust-puff"
              />
              <circle
                cx="2"
                cy="20"
                r="1.5"
                fill="#e7e5e4"
                className="exhaust-puff-2"
              />
            </svg>
          </div>

          {/* House/destination */}
          <div className="absolute bottom-5 right-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L4 14h4v12h16V14h4L16 4z" fill="#059669" />
              <rect x="13" y="18" width="6" height="8" rx="1" fill="#F97316" />
              <rect x="10" y="14" width="4" height="4" rx="0.5" fill="#d1fae5" />
              <rect x="18" y="14" width="4" height="4" rx="0.5" fill="#d1fae5" />
            </svg>
            <div className="location-ping absolute -top-1 left-1/2 -translate-x-1/2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="#059669">
                <circle cx="6" cy="6" r="3" />
              </svg>
            </div>
          </div>
        </div>

        {/* ETA */}
        <div className="text-center">
          <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">
            Estimated Delivery
          </p>
          <p className="font-heading font-bold text-3xl text-emerald-800 mt-1 time-pulse">
            {minutes} min
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl p-5 border border-stone-100">
        <div className="space-y-0">
          {stages.map((s, i) => (
            <div key={i} className="flex items-start gap-3 relative">
              {/* Vertical line */}
              {i < stages.length - 1 && (
                <div
                  className={`absolute left-[13px] top-7 w-0.5 h-8 transition-colors duration-500 ${
                    i < stage ? "bg-brand-green" : "bg-stone-200"
                  }`}
                />
              )}
              {/* Circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  i <= stage
                    ? "bg-brand-green text-white scale-100"
                    : "bg-stone-100 text-stone-400 scale-90"
                } ${i === stage ? "ring-4 ring-emerald-100 stage-active" : ""}`}
              >
                {i < stage ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
                )}
              </div>
              {/* Label */}
              <div className="pb-5">
                <p
                  className={`text-sm font-medium transition-colors duration-500 ${
                    i <= stage ? "text-stone-900" : "text-stone-400"
                  }`}
                >
                  {s.label}
                </p>
                {i === stage && (
                  <p className="text-xs text-brand-green mt-0.5 animate-fade-in">
                    {i === 0
                      ? "We got your order!"
                      : i === 1
                        ? "Packing your items..."
                        : "On the way to you!"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Success Header */}
        <div className="text-center">
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

          <h1 className="font-heading font-bold text-2xl text-stone-900 mt-5">
            Order Placed!
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Sit back and relax, your order is on its way
          </p>
        </div>

        {orderId && (
          <div className="bg-white rounded-2xl p-4 border border-stone-100 mt-5 text-center">
            <p className="text-xs text-stone-400 uppercase tracking-wider">
              Order ID
            </p>
            <p className="font-heading font-bold text-lg text-brand-green mt-1">
              {orderId}
            </p>
          </div>
        )}

        {/* Delivery Animation */}
        <DeliveryAnimation />

        {/* Contact Note */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mt-5">
          <p className="text-sm text-amber-800">
            We will contact you on your phone number to confirm delivery
            details.
          </p>
        </div>

        {orderId && (
          <Link
            href={`/track?id=${orderId}`}
            className="block text-center mt-5 bg-white hover:bg-stone-50 text-brand-green font-semibold px-8 py-3.5 rounded-xl transition-colors border-2 border-brand-green"
          >
            Track My Order
          </Link>
        )}

        <Link
          href="/"
          className="block text-center mt-3 bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
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
