export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  images?: string[]; // base64 data URLs or external URLs (max 5)
  category: string;
  unit: string;
  inStock: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  locationType: "maps_link" | "manual";
  location: string;
  paymentMethod: "upi" | "cod";
  paymentStatus: "pending" | "paid" | "not_paid";
  items: OrderItem[];
  total: number;
  deliveryCharge: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export const CATEGORIES = [
  "All",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Staples",
  "Snacks",
  "Beverages",
  "Household",
  "Electronics",
  "Personal Care",
] as const;

export const CATEGORY_CONFIG: Record<
  string,
  { emoji: string; gradient: string }
> = {
  Fruits: { emoji: "🍎", gradient: "from-rose-100 to-red-50" },
  Vegetables: { emoji: "🥬", gradient: "from-emerald-100 to-green-50" },
  Dairy: { emoji: "🥛", gradient: "from-sky-100 to-blue-50" },
  Staples: { emoji: "🌾", gradient: "from-amber-100 to-orange-50" },
  Snacks: { emoji: "🍿", gradient: "from-yellow-100 to-amber-50" },
  Beverages: { emoji: "🥤", gradient: "from-violet-100 to-purple-50" },
  Household: { emoji: "🧹", gradient: "from-teal-100 to-cyan-50" },
  Electronics: { emoji: "🔌", gradient: "from-indigo-100 to-blue-50" },
  "Personal Care": { emoji: "🧴", gradient: "from-pink-100 to-rose-50" },
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
