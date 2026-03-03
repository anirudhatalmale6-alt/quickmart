"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Product, Order, CATEGORIES, ORDER_STATUS_LABELS } from "@/lib/types";
import {
  getAllProducts,
  getOrders,
  addProduct as storeAddProduct,
  updateProduct as storeUpdateProduct,
  deleteProduct as storeDeleteProduct,
  updateOrderStatus as storeUpdateOrderStatus,
  isAdminLoggedIn,
  logoutAdmin,
} from "@/lib/clientStore";

const CATEGORY_EMOJIS: Record<string, string> = {
  Fruits: "🍎",
  Vegetables: "🥬",
  Dairy: "🥛",
  Staples: "🌾",
  Snacks: "🍿",
  Beverages: "🥤",
  Household: "🧹",
  Electronics: "🔌",
  "Personal Care": "🧴",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formCategory, setFormCategory] = useState("Fruits");
  const [formDescription, setFormDescription] = useState("");
  const [formEmoji, setFormEmoji] = useState("🍎");
  const [formImage, setFormImage] = useState("");
  const [formInStock, setFormInStock] = useState(true);

  const refreshData = () => {
    setProducts(getAllProducts());
    setOrders(getOrders());
  };

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/admin");
      return;
    }
    refreshData();
    setLoading(false);
  }, [router]);

  const resetForm = () => {
    setFormName("");
    setFormPrice("");
    setFormUnit("");
    setFormCategory("Fruits");
    setFormDescription("");
    setFormEmoji("🍎");
    setFormImage("");
    setFormInStock(true);
    setEditingProduct(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(p.price.toString());
    setFormUnit(p.unit);
    setFormCategory(p.category);
    setFormDescription(p.description);
    setFormEmoji(p.emoji);
    setFormImage(p.image || "");
    setFormInStock(p.inStock);
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = () => {
    if (!formName || !formPrice || !formUnit) return;

    const data = {
      name: formName,
      price: parseFloat(formPrice),
      unit: formUnit,
      category: formCategory,
      description: formDescription,
      emoji: formEmoji,
      inStock: formInStock,
      image: formImage || undefined,
    };

    if (editingProduct) {
      storeUpdateProduct(editingProduct.id, data);
    } else {
      storeAddProduct(data);
    }

    resetForm();
    refreshData();
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("Delete this product?")) return;
    storeDeleteProduct(id);
    refreshData();
  };

  const handleToggleStock = (p: Product) => {
    storeUpdateProduct(p.id, { inStock: !p.inStock });
    refreshData();
  };

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    storeUpdateOrderStatus(orderId, status as Order["status"]);
    refreshData();
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <span className="text-stone-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-brand-green rounded-xl flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </span>
            <span className="font-heading font-bold text-stone-900">
              QuickMart{" "}
              <span className="text-stone-400 font-normal text-sm">
                Admin
              </span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-stone-100">
            <p className="text-xs text-stone-400 uppercase tracking-wider">
              Products
            </p>
            <p className="font-heading font-bold text-2xl text-stone-900 mt-1">
              {products.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-stone-100">
            <p className="text-xs text-stone-400 uppercase tracking-wider">
              Orders
            </p>
            <p className="font-heading font-bold text-2xl text-stone-900 mt-1">
              {orders.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-stone-100">
            <p className="text-xs text-stone-400 uppercase tracking-wider">
              Pending
            </p>
            <p className="font-heading font-bold text-2xl text-brand-orange mt-1">
              {orders.filter((o) => o.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("products")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === "products"
                ? "bg-brand-green text-white"
                : "bg-white text-stone-600 border border-stone-200"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === "orders"
                ? "bg-brand-green text-white"
                : "bg-white text-stone-600 border border-stone-200"
            }`}
          >
            Orders
            {orders.filter((o) => o.status === "pending").length > 0 && (
              <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                {orders.filter((o) => o.status === "pending").length}
              </span>
            )}
          </button>
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-lg text-stone-900">
                All Products
              </h2>
              <button
                onClick={openAddForm}
                className="bg-brand-green hover:bg-brand-green-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                + Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>

                  <div className="space-y-3">
                    {/* Product Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">
                        Product Photo
                      </label>
                      <div className="flex items-center gap-3">
                        {formImage ? (
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200">
                            <img
                              src={formImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => {
                                setFormImage("");
                                if (fileInputRef.current)
                                  fileInputRef.current.value = "";
                              }}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                            >
                              x
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green hover:bg-emerald-50/30 transition-colors"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-stone-400"
                            >
                              <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                              />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                            <span className="text-[10px] text-stone-400 mt-1">
                              Upload
                            </span>
                          </div>
                        )}
                        <div className="text-xs text-stone-400">
                          <p>Upload a photo of the product.</p>
                          <p>JPG, PNG under 2MB.</p>
                          <p className="text-stone-300 mt-1">
                            (Optional — emoji shown if no photo)
                          </p>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Amul Butter 500g"
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Brand name, details, what customer should know"
                        rows={2}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          placeholder="99"
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">
                          Unit *
                        </label>
                        <input
                          type="text"
                          value={formUnit}
                          onChange={(e) => setFormUnit(e.target.value)}
                          placeholder="1 kg, 500g, 1L, 1 pc"
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">
                          Category
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => {
                            setFormCategory(e.target.value);
                            setFormEmoji(
                              CATEGORY_EMOJIS[e.target.value] || "📦"
                            );
                          }}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                        >
                          {CATEGORIES.filter((c) => c !== "All").map(
                            (c) => (
                              <option key={c} value={c}>
                                {CATEGORY_EMOJIS[c]} {c}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">
                          Emoji Icon
                        </label>
                        <input
                          type="text"
                          value={formEmoji}
                          onChange={(e) => setFormEmoji(e.target.value)}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formInStock}
                        onChange={(e) => setFormInStock(e.target.checked)}
                        className="w-4 h-4 rounded border-stone-300 text-brand-green focus:ring-brand-green"
                      />
                      <span className="text-sm text-stone-700">In Stock</span>
                    </label>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2.5 rounded-xl text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProduct}
                      className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
                    >
                      {editingProduct ? "Save Changes" : "Add Product"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product List */}
            <div className="space-y-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl p-3 border border-stone-100 flex items-center gap-3"
                >
                  {p.image ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-2xl w-10 text-center flex-shrink-0">
                      {p.emoji}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-stone-900 truncate">
                        {p.name}
                      </span>
                      {!p.inStock && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex-shrink-0">
                          Out
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-400">
                      ₹{p.price} / {p.unit} · {p.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleStock(p)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        p.inStock
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                      }`}
                    >
                      {p.inStock ? "In Stock" : "Out"}
                    </button>
                    <button
                      onClick={() => openEditForm(p)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            <h2 className="font-heading font-bold text-lg text-stone-900 mb-4">
              All Orders
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <span className="text-4xl block mb-3">📦</span>
                No orders yet
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-4 border border-stone-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-heading font-bold text-sm text-brand-green">
                          {order.id}
                        </span>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order.id, e.target.value)
                        }
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-brand-green/30 ${
                          order.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "preparing"
                                ? "bg-purple-100 text-purple-700"
                                : order.status === "out_for_delivery"
                                  ? "bg-orange-100 text-orange-700"
                                  : order.status === "delivered"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                        }`}
                      >
                        {Object.entries(ORDER_STATUS_LABELS).map(
                          ([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="space-y-1 mb-3">
                      <p className="text-sm text-stone-800">
                        <span className="font-medium">
                          {order.customerName}
                        </span>{" "}
                        · {order.customerPhone}
                      </p>
                      <p className="text-xs text-stone-500">
                        {order.locationType === "maps_link"
                          ? "📍 "
                          : "📮 "}
                        {order.location}
                      </p>
                      <p className="text-xs text-stone-500">
                        {order.paymentMethod === "upi"
                          ? "UPI"
                          : "Cash on Delivery"}
                      </p>
                    </div>

                    <div className="border-t border-stone-100 pt-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-xs text-stone-500 py-0.5"
                        >
                          <span>
                            {item.productName} x {item.quantity}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold text-stone-900 mt-1 pt-1 border-t border-stone-50">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
