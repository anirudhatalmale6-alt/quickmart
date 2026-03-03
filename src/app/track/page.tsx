"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getOrderById, cancelOrder, getMyOrders } from "@/lib/clientStore";
import { Order, ORDER_STATUS_LABELS } from "@/lib/types";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  // Update time every second for cancel countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load recent orders + auto-load from URL param
  useEffect(() => {
    setMyOrders(getMyOrders());
    const urlId = searchParams.get("id");
    if (urlId) {
      setOrderId(urlId);
      const found = getOrderById(urlId);
      setOrder(found);
      setSearched(true);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    const found = getOrderById(orderId.trim().toUpperCase());
    setOrder(found);
    setSearched(true);
    setCancelled(false);
  };

  const handleCancel = () => {
    if (!order) return;
    setCancelling(true);
    const result = cancelOrder(order.id);
    if (result) {
      setOrder(result);
      setCancelled(true);
    }
    setCancelling(false);
  };

  // Calculate if cancel is still allowed (within 5 minutes)
  const canCancel = order
    ? order.status === "pending" &&
      now - new Date(order.createdAt).getTime() < 5 * 60 * 1000
    : false;

  const cancelTimeLeft = order
    ? Math.max(
        0,
        5 * 60 - Math.floor((now - new Date(order.createdAt).getTime()) / 1000)
      )
    : 0;

  const cancelMinutes = Math.floor(cancelTimeLeft / 60);
  const cancelSeconds = cancelTimeLeft % 60;

  const statusSteps = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "preparing": return "bg-purple-100 text-purple-700";
      case "out_for_delivery": return "bg-orange-100 text-orange-700";
      case "delivered": return "bg-emerald-100 text-emerald-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-stone-100 text-stone-700";
    }
  };

  return (
    <div className="min-h-screen pb-8">
      <Header />

      <main className="max-w-lg mx-auto px-4 pt-6">
        <h1 className="font-heading font-bold text-2xl text-stone-900 mb-2">
          Track Your Order
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          Enter your order ID to check the status
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ORD-M5ABC123"
            className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green uppercase"
          />
          <button
            type="submit"
            className="bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Track
          </button>
        </form>

        {/* Recent Orders - shown when not viewing a specific order */}
        {!searched && myOrders.length > 0 && (
          <div className="mb-6">
            <h2 className="font-heading font-semibold text-stone-900 mb-3">
              Your Recent Orders
            </h2>
            <div className="space-y-2">
              {myOrders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setOrderId(o.id);
                    setOrder(o);
                    setSearched(true);
                    setCancelled(false);
                  }}
                  className="w-full bg-white rounded-xl p-4 border border-stone-100 flex items-center justify-between hover:border-brand-green/30 transition-colors text-left"
                >
                  <div>
                    <p className="font-heading font-bold text-sm text-brand-green">
                      {o.id}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {new Date(o.createdAt).toLocaleString("en-IN")} · ₹{o.total}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg flex-shrink-0 ${
                      o.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : o.status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : o.status === "preparing"
                        ? "bg-purple-100 text-purple-700"
                        : o.status === "out_for_delivery"
                        ? "bg-orange-100 text-orange-700"
                        : o.status === "delivered"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ORDER_STATUS_LABELS[o.status] || o.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!searched && myOrders.length === 0 && (
          <div className="text-center py-8 text-stone-400">
            <span className="text-4xl block mb-3">📦</span>
            <p className="text-sm">No orders yet</p>
            <p className="text-xs mt-1">Place an order and it will show up here</p>
          </div>
        )}

        {searched && !order && (
          <div className="bg-red-50 rounded-2xl p-5 border border-red-200 text-center">
            <span className="text-3xl block mb-2">🔍</span>
            <p className="text-sm text-red-700 font-medium">Order not found</p>
            <p className="text-xs text-red-500 mt-1">
              Please check your order ID and try again
            </p>
          </div>
        )}

        {order && (
          <div className="space-y-4">
            {myOrders.length > 1 && (
              <button
                onClick={() => {
                  setOrder(null);
                  setSearched(false);
                  setOrderId("");
                  setCancelled(false);
                  setMyOrders(getMyOrders());
                }}
                className="text-xs text-brand-green font-medium hover:underline"
              >
                ← Back to all orders
              </button>
            )}
            {/* Order Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-stone-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-heading font-bold text-brand-green">
                    {order.id}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg ${statusColor(order.status)}`}
                >
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              {/* Payment Info */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-stone-500">
                  {order.paymentMethod === "upi" ? "UPI Payment" : "Cash on Delivery"}
                </span>
                {order.paymentMethod === "upi" && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.paymentStatus === "not_paid"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.paymentStatus === "paid"
                      ? "Paid"
                      : order.paymentStatus === "not_paid"
                      ? "Not Paid"
                      : "Payment Pending"}
                  </span>
                )}
              </div>

              {/* Items */}
              <div className="border-t border-stone-100 pt-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-stone-600 py-1"
                  >
                    <span>
                      {item.productName} x {item.quantity}
                    </span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold text-stone-900 mt-2 pt-2 border-t border-stone-50">
                  <span>Total</span>
                  <span className="text-brand-green">₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Order Progress (only for non-cancelled orders) */}
            {order.status !== "cancelled" && (
              <div className="bg-white rounded-2xl p-5 border border-stone-100">
                <h3 className="font-heading font-semibold text-stone-900 mb-4">
                  Order Progress
                </h3>
                <div className="space-y-0">
                  {statusSteps.map((step, i) => (
                    <div key={step} className="flex items-start gap-3 relative">
                      {i < statusSteps.length - 1 && (
                        <div
                          className={`absolute left-[13px] top-7 w-0.5 h-8 ${
                            i < currentStepIndex
                              ? "bg-brand-green"
                              : "bg-stone-200"
                          }`}
                        />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          i <= currentStepIndex
                            ? "bg-brand-green text-white"
                            : "bg-stone-100 text-stone-400"
                        } ${
                          i === currentStepIndex
                            ? "ring-4 ring-emerald-100"
                            : ""
                        }`}
                      >
                        {i < currentStepIndex ? (
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
                      <div className="pb-5">
                        <p
                          className={`text-sm font-medium ${
                            i <= currentStepIndex
                              ? "text-stone-900"
                              : "text-stone-400"
                          }`}
                        >
                          {ORDER_STATUS_LABELS[step]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancel Button */}
            {canCancel && !cancelled && (
              <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-red-700">
                    Cancel this order?
                  </p>
                  <span className="text-xs text-red-500 font-mono">
                    {cancelMinutes}:{cancelSeconds.toString().padStart(2, "0")} left
                  </span>
                </div>
                <p className="text-xs text-red-500 mb-3">
                  You can cancel within 5 minutes of placing the order.
                </p>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            )}

            {cancelled && (
              <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-center">
                <span className="text-2xl block mb-2">❌</span>
                <p className="text-sm font-medium text-red-700">
                  Order has been cancelled
                </p>
              </div>
            )}

            {order.status === "cancelled" && !cancelled && (
              <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-center">
                <span className="text-2xl block mb-2">❌</span>
                <p className="text-sm font-medium text-red-700">
                  This order was cancelled
                </p>
              </div>
            )}
          </div>
        )}

        <Link
          href="/"
          className="block text-center mt-6 text-sm text-brand-green font-medium hover:underline"
        >
          ← Back to Shopping
        </Link>
      </main>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-stone-400">Loading...</span>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
