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
  updatePaymentStatus as storeUpdatePaymentStatus,
  deleteOrder as storeDeleteOrder,
  cleanupOldOrders,
  isAdminLoggedIn,
  logoutAdmin,
  changePassword,
  getSettings,
  saveSettings,
  StoreSettings,
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
  const [tab, setTab] = useState<"products" | "orders" | "settings">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({ upiId: "", storeName: "QuickMart", storePhone: "", deliveryCharge: 0, handlingCharge: 0, freeDeliveryAbove: 0, discountPercent: 0, discountLabel: "" });
  const [settingsSaved, setSettingsSaved] = useState(false);
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

  // Change password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  const handleChangePassword = () => {
    setPassError("");
    if (!oldPass || !newPass || !confirmPass) {
      setPassError("Please fill in all fields");
      return;
    }
    if (newPass.length < 6) {
      setPassError("New password must be at least 6 characters");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("New passwords don't match");
      return;
    }
    if (!changePassword(oldPass, newPass)) {
      setPassError("Current password is incorrect");
      return;
    }
    setPassSuccess(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setPassError("");
      setPassSuccess(false);
    }, 1500);
  };

  const refreshData = () => {
    setProducts(getAllProducts());
    setOrders(getOrders());
    setSettings(getSettings());
  };

  const handleSaveSettings = () => {
    saveSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-xs text-stone-400 hover:text-brand-green transition-colors flex items-center gap-1"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Password
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              Logout
            </button>
          </div>
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
          <button
            onClick={() => setTab("settings")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === "settings"
                ? "bg-brand-green text-white"
                : "bg-white text-stone-600 border border-stone-200"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Settings Tab */}
        {tab === "settings" && (
          <div>
            <h2 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Store Settings
            </h2>

            <div className="bg-white rounded-2xl p-5 border border-stone-100 space-y-5">
              {/* UPI Settings */}
              <div>
                <h3 className="font-heading font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-green rounded-full text-white text-xs flex items-center justify-center font-bold">
                    ₹
                  </span>
                  UPI Payment Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">
                      Your UPI ID *
                    </label>
                    <input
                      type="text"
                      value={settings.upiId}
                      onChange={(e) =>
                        setSettings({ ...settings, upiId: e.target.value })
                      }
                      placeholder="yourname@paytm or 9876543210@ybl"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                    />
                    <p className="text-xs text-stone-400 mt-1">
                      Customers will pay to this UPI ID. Find it in GPay/PhonePe/Paytm under your profile.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">
                      Store Name (shown to customer)
                    </label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) =>
                        setSettings({ ...settings, storeName: e.target.value })
                      }
                      placeholder="QuickMart"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">
                      Store Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settings.storePhone}
                      onChange={(e) =>
                        setSettings({ ...settings, storePhone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                    />
                    <p className="text-xs text-stone-400 mt-1">
                      Customers can contact you on this number for order queries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Charges Section */}
              <div className="border-t border-stone-100 pt-5">
                <h3 className="font-heading font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-orange rounded-full text-white text-xs flex items-center justify-center font-bold">
                    🛵
                  </span>
                  Delivery &amp; Handling Charges
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">
                        Delivery Charge (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={settings.deliveryCharge || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, deliveryCharge: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="25"
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">
                        Handling Charge (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={settings.handlingCharge || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, handlingCharge: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="4"
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">
                      Free Delivery Above (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settings.freeDeliveryAbove || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, freeDeliveryAbove: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="200"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                    />
                    <p className="text-xs text-stone-400 mt-1">
                      Set to 0 to always charge delivery. Customer sees &quot;Shop for ₹X more to get FREE delivery&quot;.
                    </p>
                  </div>
                </div>
              </div>

              {/* Offers Section */}
              <div className="border-t border-stone-100 pt-5">
                <h3 className="font-heading font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    %
                  </span>
                  Offers &amp; Discounts
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.discountPercent || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, discountPercent: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="10"
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">
                        Offer Label
                      </label>
                      <input
                        type="text"
                        value={settings.discountLabel || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, discountLabel: e.target.value })
                        }
                        placeholder="Grand Opening Sale!"
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-stone-400">
                    Set discount to 0 for no offer. The label and savings amount will show on checkout.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Save Settings
                </button>
                {settingsSaved && (
                  <span className="text-sm text-emerald-600 font-medium animate-fade-in">
                    Saved!
                  </span>
                )}
              </div>

              {/* UPI Status */}
              {!settings.upiId && (
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                  <p className="text-xs text-amber-800">
                    UPI ID not set yet. Customers choosing UPI at checkout will be asked to contact you for payment details.
                  </p>
                </div>
              )}
              {settings.upiId && (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <p className="text-xs text-emerald-800">
                    UPI is active! Customers choosing UPI at checkout will see a &quot;Pay Now&quot; button that opens their UPI app with your ID and the order amount pre-filled.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

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
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-lg text-stone-900">
                All Orders
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const removed = cleanupOldOrders(30);
                    if (removed > 0) {
                      refreshData();
                      alert(`Removed ${removed} orders older than 30 days`);
                    } else {
                      alert("No orders older than 30 days to clean up");
                    }
                  }}
                  className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  Clean 30d+
                </button>
              </div>
            </div>

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
                      {/* Payment Method + Status */}
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-stone-500">
                          {order.paymentMethod === "upi"
                            ? "UPI"
                            : "Cash on Delivery"}
                        </p>
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
                        {order.paymentMethod === "upi" &&
                          order.paymentStatus !== "paid" && (
                            <button
                              onClick={() => {
                                storeUpdatePaymentStatus(order.id, "paid");
                                refreshData();
                              }}
                              className="text-xs text-emerald-600 hover:text-emerald-700 underline font-medium"
                            >
                              Mark Paid
                            </button>
                          )}
                      </div>
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

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
                      <button
                        onClick={() => {
                          const itemsList = order.items
                            .map(
                              (item) =>
                                `${item.productName} x${item.quantity} = ₹${item.price * item.quantity}`
                            )
                            .join("\n");
                          const msg = `🛵 *Delivery Order*\n\n*Order:* ${order.id}\n*Customer:* ${order.customerName}\n*Phone:* ${order.customerPhone}\n*Location:* ${order.location}\n*Payment:* ${order.paymentMethod === "upi" ? "UPI" : "COD"}${order.paymentMethod === "upi" ? ` (${order.paymentStatus === "paid" ? "PAID" : "NOT PAID"})` : ""}\n\n*Items:*\n${itemsList}\n\n*Total: ₹${order.total}*`;
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(msg)}`,
                            "_blank"
                          );
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Share to Delivery
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this order permanently?")) {
                            storeDeleteOrder(order.id);
                            refreshData();
                          }
                        }}
                        className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Change Password
            </h3>

            {passSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-sm text-emerald-700 font-medium">
                  Password changed successfully!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                  />
                </div>

                {passError && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 border border-red-200">
                    {passError}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setOldPass("");
                      setNewPass("");
                      setConfirmPass("");
                      setPassError("");
                    }}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
