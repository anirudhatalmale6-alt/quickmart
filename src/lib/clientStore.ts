import { Product, Order } from "./types";

const PRODUCTS_KEY = "quickmart-products";
const ORDERS_KEY = "quickmart-orders";
const SETTINGS_KEY = "quickmart-settings";

const seedProducts: Product[] = [
  {
    id: "p1",
    name: "Alphonso Mango",
    description: "Sweet and juicy Ratnagiri Alphonso mangoes, perfect for the season",
    price: 350,
    emoji: "\u{1F96D}",
    category: "Fruits",
    unit: "1 kg",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p2",
    name: "Fresh Bananas",
    description: "Ripe yellow bananas, rich in potassium",
    price: 45,
    emoji: "\u{1F34C}",
    category: "Fruits",
    unit: "1 dozen",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p3",
    name: "Fresh Tomatoes",
    description: "Farm-fresh red tomatoes for your daily cooking",
    price: 30,
    emoji: "\u{1F345}",
    category: "Vegetables",
    unit: "500 g",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p4",
    name: "Green Onions",
    description: "Crisp fresh onions, a kitchen essential",
    price: 40,
    emoji: "\u{1F9C5}",
    category: "Vegetables",
    unit: "1 kg",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p5",
    name: "Palak (Spinach)",
    description: "Fresh green spinach leaves, washed and ready",
    price: 25,
    emoji: "\u{1F96C}",
    category: "Vegetables",
    unit: "250 g",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p6",
    name: "Amul Butter",
    description: "Creamy Amul pasteurized butter \u2014 India\u2019s #1 butter brand",
    price: 280,
    emoji: "\u{1F9C8}",
    category: "Dairy",
    unit: "500 g",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p7",
    name: "Amul Toned Milk",
    description: "Fresh pasteurized toned milk by Amul",
    price: 68,
    emoji: "\u{1F95B}",
    category: "Dairy",
    unit: "1 L",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p8",
    name: "Amul Paneer",
    description: "Fresh and soft paneer by Amul, great for curries and tikka",
    price: 90,
    emoji: "\u{1F9C0}",
    category: "Dairy",
    unit: "200 g",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p9",
    name: "India Gate Basmati Rice",
    description: "Premium long-grain aged basmati rice \u2014 Classic variety",
    price: 180,
    emoji: "\u{1F35A}",
    category: "Staples",
    unit: "1 kg",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p10",
    name: "Aashirvaad Atta",
    description: "Aashirvaad whole wheat flour \u2014 makes soft rotis every time",
    price: 320,
    emoji: "\u{1F33E}",
    category: "Staples",
    unit: "5 kg",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p11",
    name: "Tata Toor Dal",
    description: "Tata Sampann premium quality unpolished toor dal",
    price: 150,
    emoji: "\u{1FAD8}",
    category: "Staples",
    unit: "1 kg",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p12",
    name: "Haldiram\u2019s Aloo Bhujia",
    description: "Haldiram\u2019s crispy and spicy classic namkeen snack",
    price: 99,
    emoji: "\u{1F37F}",
    category: "Snacks",
    unit: "400 g",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p13",
    name: "Parle-G Gold Biscuits",
    description: "India\u2019s favourite glucose biscuits \u2014 Parle-G Gold",
    price: 55,
    emoji: "\u{1F36A}",
    category: "Snacks",
    unit: "800 g",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p14",
    name: "Lays Classic Salted",
    description: "Lays light and crispy salted potato chips",
    price: 40,
    emoji: "\u{1F954}",
    category: "Snacks",
    unit: "130 g",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p15",
    name: "Paper Boat Aam Panna",
    description: "Paper Boat refreshing raw mango drink \u2014 traditional taste",
    price: 30,
    emoji: "\u{1F9C3}",
    category: "Beverages",
    unit: "250 ml",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p16",
    name: "Coca-Cola",
    description: "Chilled Coca-Cola bottle for refreshment",
    price: 40,
    emoji: "\u{1F964}",
    category: "Beverages",
    unit: "750 ml",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p17",
    name: "Vim Dishwash Liquid",
    description: "Vim powerful grease-cutting dishwash gel with lemon",
    price: 120,
    emoji: "\u{1F9F4}",
    category: "Household",
    unit: "500 ml",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p18",
    name: "Surf Excel Detergent",
    description: "Surf Excel easy wash \u2014 tough stain removal powder",
    price: 215,
    emoji: "\u{1F9F9}",
    category: "Household",
    unit: "1 kg",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p19",
    name: "Ambrane Power Bank 10000mAh",
    description: "Ambrane Stylo 10K \u2014 10000mAh Li-Polymer, 20W fast charging, dual USB output",
    price: 799,
    emoji: "\u{1F50B}",
    category: "Electronics",
    unit: "1 pc",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p20",
    name: "boAt Airdopes 141",
    description: "boAt Airdopes 141 TWS \u2014 Bluetooth 5.1, 42hr battery, IPX4, mic",
    price: 1299,
    emoji: "\u{1F3A7}",
    category: "Electronics",
    unit: "1 pc",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p21",
    name: "Mi 20W USB-C Charger",
    description: "Xiaomi 20W USB Type-C fast charger \u2014 BIS certified, compact design",
    price: 599,
    emoji: "\u{1F50C}",
    category: "Electronics",
    unit: "1 pc",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p22",
    name: "USB-C Data Cable (1m)",
    description: "Braided USB-C to USB-C cable \u2014 3A fast charging, durable nylon",
    price: 199,
    emoji: "\u{1F517}",
    category: "Electronics",
    unit: "1 pc",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p23",
    name: "Dettol Handwash",
    description: "Dettol Original antibacterial liquid handwash \u2014 germ protection",
    price: 99,
    emoji: "\u{1F9FC}",
    category: "Personal Care",
    unit: "200 ml",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p24",
    name: "Colgate MaxFresh Toothpaste",
    description: "Colgate MaxFresh with cooling crystals \u2014 blue gel toothpaste",
    price: 85,
    emoji: "\u{1FAA5}",
    category: "Personal Care",
    unit: "150 g",
    inStock: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function loadProducts(): Product[] {
  const stored = getStored<Product[] | null>(PRODUCTS_KEY, null);
  if (stored !== null) return stored;
  setStored(PRODUCTS_KEY, seedProducts);
  return [...seedProducts];
}

// Products
export function getProducts(): Product[] {
  return loadProducts().filter((p) => p.inStock);
}

export function getAllProducts(): Product[] {
  return loadProducts();
}

export function addProduct(data: Omit<Product, "id" | "createdAt">): Product {
  const products = loadProducts();
  const product: Product = {
    ...data,
    id: "p" + Date.now(),
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  setStored(PRODUCTS_KEY, products);
  return product;
}

export function updateProduct(id: string, data: Partial<Product>): Product | null {
  const products = loadProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data };
  setStored(PRODUCTS_KEY, products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = loadProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  setStored(PRODUCTS_KEY, filtered);
  return true;
}

// Orders
export function getOrders(): Order[] {
  return getStored<Order[]>(ORDERS_KEY, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addOrder(data: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus">): Order {
  const orders = getStored<Order[]>(ORDERS_KEY, []);
  const order: Order = {
    ...data,
    id: "ORD-" + Date.now().toString(36).toUpperCase(),
    status: "pending",
    paymentStatus: data.paymentMethod === "cod" ? "paid" : "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  setStored(ORDERS_KEY, orders);
  return order;
}

export function updateOrderStatus(id: string, status: Order["status"]): Order | null {
  const orders = getStored<Order[]>(ORDERS_KEY, []);
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  setStored(ORDERS_KEY, orders);
  return order;
}

export function updatePaymentStatus(id: string, paymentStatus: Order["paymentStatus"]): Order | null {
  const orders = getStored<Order[]>(ORDERS_KEY, []);
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.paymentStatus = paymentStatus;
  setStored(ORDERS_KEY, orders);
  return order;
}

export function getOrderById(id: string): Order | null {
  const orders = getStored<Order[]>(ORDERS_KEY, []);
  return orders.find((o) => o.id === id) || null;
}

export function cancelOrder(id: string): Order | null {
  const orders = getStored<Order[]>(ORDERS_KEY, []);
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  // Can only cancel pending orders
  if (order.status !== "pending") return null;
  order.status = "cancelled";
  setStored(ORDERS_KEY, orders);
  return order;
}

export function deleteOrder(id: string): boolean {
  const orders = getStored<Order[]>(ORDERS_KEY, []);
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  setStored(ORDERS_KEY, filtered);
  return true;
}

export function cleanupOldOrders(daysOld: number): number {
  const orders = getStored<Order[]>(ORDERS_KEY, []);
  const cutoff = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const filtered = orders.filter((o) => new Date(o.createdAt).getTime() > cutoff);
  const removed = orders.length - filtered.length;
  if (removed > 0) setStored(ORDERS_KEY, filtered);
  return removed;
}

// Store Settings
export interface StoreSettings {
  upiId: string;
  storeName: string;
  storePhone: string;
}

const defaultSettings: StoreSettings = {
  upiId: "",
  storeName: "QuickMart",
  storePhone: "",
};

export function getSettings(): StoreSettings {
  return { ...defaultSettings, ...getStored<Partial<StoreSettings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: Partial<StoreSettings>): StoreSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  setStored(SETTINGS_KEY, updated);
  return updated;
}

// Auth
const ADMIN_CREDS_KEY = "quickmart-admin-creds";
const DEFAULT_USER = "admin";
const DEFAULT_PASS = "admin123";

function getAdminCreds(): { username: string; password: string } {
  const stored = getStored<{ username: string; password: string } | null>(
    ADMIN_CREDS_KEY,
    null
  );
  if (stored) return stored;
  return { username: DEFAULT_USER, password: DEFAULT_PASS };
}

export function verifyAdmin(username: string, password: string): boolean {
  const creds = getAdminCreds();
  return username === creds.username && password === creds.password;
}

export function changePassword(oldPassword: string, newPassword: string): boolean {
  const creds = getAdminCreds();
  if (oldPassword !== creds.password) return false;
  setStored(ADMIN_CREDS_KEY, { username: creds.username, password: newPassword });
  return true;
}

export function resetPassword(): void {
  setStored(ADMIN_CREDS_KEY, { username: DEFAULT_USER, password: DEFAULT_PASS });
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("quickmart-admin-token") === "authenticated";
}

export function loginAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("quickmart-admin-token", "authenticated");
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("quickmart-admin-token");
}
