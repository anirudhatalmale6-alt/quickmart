"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/components/CartProvider";
import { addOrder, getSettings } from "@/lib/clientStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [locationType, setLocationType] = useState<"maps_link" | "manual">(
    "manual"
  );
  const [location, setLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [upiId, setUpiId] = useState("");
  const [storeName, setStoreName] = useState("QuickMart");

  useEffect(() => {
    const settings = getSettings();
    if (settings.upiId) setUpiId(settings.upiId);
    if (settings.storeName) setStoreName(settings.storeName);
  }, []);

  if (items.length === 0) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim() || !location.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setSubmitting(true);

    try {
      const order = addOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        locationType,
        location: location.trim(),
        paymentMethod,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        total: totalPrice,
        deliveryCharge: 0,
      });

      clearCart();

      // If UPI selected and UPI ID is set, open UPI deep link
      if (paymentMethod === "upi" && upiId) {
        const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(storeName)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent(`Order ${order.id} - ${storeName}`)}`;
        // Open UPI app
        window.location.href = upiLink;
        // Give a moment for UPI app to open, then redirect to success
        setTimeout(() => {
          router.push(`/order-success?id=${order.id}`);
        }, 1500);
        return;
      }

      router.push(`/order-success?id=${order.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-8">
      <Header />

      <main className="max-w-lg mx-auto px-4 pt-6">
        <h1 className="font-heading font-bold text-2xl text-stone-900 mb-6">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contact Details */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 space-y-4">
            <h2 className="font-heading font-semibold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-green rounded-full text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              Your Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
              />
            </div>
          </div>

          {/* Delivery Location */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 space-y-4">
            <h2 className="font-heading font-semibold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-green rounded-full text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              Delivery Location
            </h2>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLocationType("manual")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  locationType === "manual"
                    ? "bg-brand-green text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Type Address
              </button>
              <button
                type="button"
                onClick={() => setLocationType("maps_link")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  locationType === "maps_link"
                    ? "bg-brand-green text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Maps Link
              </button>
            </div>

            {locationType === "manual" ? (
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  Delivery Address
                </label>
                <textarea
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="House no, Street, Area, Landmark, City, Pincode"
                  rows={3}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green resize-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  Paste Google Maps Link
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                />
                <p className="text-xs text-stone-400 mt-1.5">
                  Open Google Maps → Find your location → Tap
                  &quot;Share&quot; → Copy link → Paste here
                </p>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 space-y-4">
            <h2 className="font-heading font-semibold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-green rounded-full text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              Payment Method
            </h2>

            <div className="space-y-2">
              <label
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-brand-green bg-emerald-50/50"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === "cod"
                      ? "border-brand-green"
                      : "border-stone-300"
                  }`}
                >
                  {paymentMethod === "cod" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                  )}
                </span>
                <div>
                  <span className="font-medium text-sm text-stone-800">
                    Cash on Delivery
                  </span>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Pay when your order arrives
                  </p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "upi"
                    ? "border-brand-green bg-emerald-50/50"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === "upi"
                      ? "border-brand-green"
                      : "border-stone-300"
                  }`}
                >
                  {paymentMethod === "upi" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                  )}
                </span>
                <div>
                  <span className="font-medium text-sm text-stone-800">
                    UPI Payment
                  </span>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Google Pay, PhonePe, Paytm etc.
                  </p>
                </div>
              </label>
            </div>

            {paymentMethod === "upi" && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-3">
                {upiId ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💳</span>
                      <div>
                        <p className="text-xs text-emerald-700 font-medium">
                          Pay to UPI ID
                        </p>
                        <p className="text-sm font-bold text-emerald-900">
                          {upiId}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-600">
                      After placing the order, tap &quot;Pay Now&quot; to open your UPI
                      app (GPay, PhonePe, Paytm) with the amount pre-filled.
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-amber-800">
                    UPI payment is being set up. Please choose Cash on Delivery
                    for now, or contact the store.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100">
            <h2 className="font-heading font-semibold text-stone-900 mb-3">
              Order Summary
            </h2>
            <div className="space-y-2">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-stone-600">
                    {product.emoji} {product.name} x {quantity}
                  </span>
                  <span className="text-stone-800 font-medium">
                    ₹{product.price * quantity}
                  </span>
                </div>
              ))}
              <div className="border-t border-stone-100 pt-2 mt-2 flex justify-between">
                <span className="font-heading font-bold text-stone-900">
                  Total
                </span>
                <span className="font-heading font-bold text-lg text-brand-green">
                  ₹{totalPrice}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-heading font-bold text-lg rounded-2xl py-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-900/15"
          >
            {submitting
              ? "Placing Order..."
              : paymentMethod === "upi" && upiId
              ? `Pay ₹${totalPrice} & Place Order`
              : "Place Order"}
          </button>
        </form>
      </main>
    </div>
  );
}
