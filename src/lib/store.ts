import { Product, Order } from "./types";

const seedProducts: Product[] = [
  {
    id: "p1",
    name: "Alphonso Mango",
    description: "Sweet and juicy Ratnagiri Alphonso mangoes, perfect for the season",
    price: 350,
    emoji: "🥭",
    category: "Fruits",
    unit: "1 kg",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Fresh Bananas",
    description: "Ripe yellow bananas, rich in potassium",
    price: 45,
    emoji: "🍌",
    category: "Fruits",
    unit: "1 dozen",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "Fresh Tomatoes",
    description: "Farm-fresh red tomatoes for your daily cooking",
    price: 30,
    emoji: "🍅",
    category: "Vegetables",
    unit: "500 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p4",
    name: "Green Onions",
    description: "Crisp fresh onions, a kitchen essential",
    price: 40,
    emoji: "🧅",
    category: "Vegetables",
    unit: "1 kg",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p5",
    name: "Palak (Spinach)",
    description: "Fresh green spinach leaves, washed and ready",
    price: 25,
    emoji: "🥬",
    category: "Vegetables",
    unit: "250 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p6",
    name: "Amul Butter",
    description: "Creamy Amul pasteurized butter — India's #1 butter brand",
    price: 280,
    emoji: "🧈",
    category: "Dairy",
    unit: "500 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p7",
    name: "Amul Toned Milk",
    description: "Fresh pasteurized toned milk by Amul",
    price: 68,
    emoji: "🥛",
    category: "Dairy",
    unit: "1 L",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p8",
    name: "Amul Paneer",
    description: "Fresh and soft paneer by Amul, great for curries and tikka",
    price: 90,
    emoji: "🧀",
    category: "Dairy",
    unit: "200 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p9",
    name: "India Gate Basmati Rice",
    description: "Premium long-grain aged basmati rice — Classic variety",
    price: 180,
    emoji: "🍚",
    category: "Staples",
    unit: "1 kg",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p10",
    name: "Aashirvaad Atta",
    description: "Aashirvaad whole wheat flour — makes soft rotis every time",
    price: 320,
    emoji: "🌾",
    category: "Staples",
    unit: "5 kg",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p11",
    name: "Tata Toor Dal",
    description: "Tata Sampann premium quality unpolished toor dal",
    price: 150,
    emoji: "🫘",
    category: "Staples",
    unit: "1 kg",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p12",
    name: "Haldiram's Aloo Bhujia",
    description: "Haldiram's crispy and spicy classic namkeen snack",
    price: 99,
    emoji: "🍿",
    category: "Snacks",
    unit: "400 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p13",
    name: "Parle-G Gold Biscuits",
    description: "India's favourite glucose biscuits — Parle-G Gold",
    price: 55,
    emoji: "🍪",
    category: "Snacks",
    unit: "800 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p14",
    name: "Lays Classic Salted",
    description: "Lays light and crispy salted potato chips",
    price: 40,
    emoji: "🥔",
    category: "Snacks",
    unit: "130 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p15",
    name: "Paper Boat Aam Panna",
    description: "Paper Boat refreshing raw mango drink — traditional taste",
    price: 30,
    emoji: "🧃",
    category: "Beverages",
    unit: "250 ml",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p16",
    name: "Coca-Cola",
    description: "Chilled Coca-Cola bottle for refreshment",
    price: 40,
    emoji: "🥤",
    category: "Beverages",
    unit: "750 ml",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p17",
    name: "Vim Dishwash Liquid",
    description: "Vim powerful grease-cutting dishwash gel with lemon",
    price: 120,
    emoji: "🧴",
    category: "Household",
    unit: "500 ml",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p18",
    name: "Surf Excel Detergent",
    description: "Surf Excel easy wash — tough stain removal powder",
    price: 215,
    emoji: "🧹",
    category: "Household",
    unit: "1 kg",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p19",
    name: "Ambrane Power Bank 10000mAh",
    description: "Ambrane Stylo 10K — 10000mAh Li-Polymer, 20W fast charging, dual USB output",
    price: 799,
    emoji: "🔋",
    category: "Electronics",
    unit: "1 pc",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p20",
    name: "boAt Airdopes 141",
    description: "boAt Airdopes 141 TWS — Bluetooth 5.1, 42hr battery, IPX4, mic",
    price: 1299,
    emoji: "🎧",
    category: "Electronics",
    unit: "1 pc",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p21",
    name: "Mi 20W USB-C Charger",
    description: "Xiaomi 20W USB Type-C fast charger — BIS certified, compact design",
    price: 599,
    emoji: "🔌",
    category: "Electronics",
    unit: "1 pc",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p22",
    name: "USB-C Data Cable (1m)",
    description: "Braided USB-C to USB-C cable — 3A fast charging, durable nylon",
    price: 199,
    emoji: "🔗",
    category: "Electronics",
    unit: "1 pc",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p23",
    name: "Dettol Handwash",
    description: "Dettol Original antibacterial liquid handwash — germ protection",
    price: 99,
    emoji: "🧼",
    category: "Personal Care",
    unit: "200 ml",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p24",
    name: "Colgate MaxFresh Toothpaste",
    description: "Colgate MaxFresh with cooling crystals — blue gel toothpaste",
    price: 85,
    emoji: "🪥",
    category: "Personal Care",
    unit: "150 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
];

// In-memory store
let products: Product[] = [...seedProducts];
const orders: Order[] = [];
let nextProductNum = 25;

// Admin credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const ADMIN_TOKEN = "qm-admin-" + Date.now().toString(36);

// Products
export function getProducts(): Product[] {
  return products.filter((p) => p.inStock);
}

export function getAllProducts(): Product[] {
  return [...products];
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function addProduct(
  data: Omit<Product, "id" | "createdAt">
): Product {
  const product: Product = {
    ...data,
    id: "p" + nextProductNum++,
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  return product;
}

export function updateProduct(
  id: string,
  data: Partial<Product>
): Product | null {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data };
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const len = products.length;
  products = products.filter((p) => p.id !== id);
  return products.length < len;
}

// Orders
export function getOrders(): Order[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function addOrder(
  data: Omit<Order, "id" | "createdAt" | "status">
): Order {
  const order: Order = {
    ...data,
    id: "ORD-" + Date.now().toString(36).toUpperCase(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  return order;
}

export function updateOrderStatus(
  id: string,
  status: Order["status"]
): Order | null {
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  return order;
}

// Auth
export function verifyAdmin(
  username: string,
  password: string
): string | null {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return ADMIN_TOKEN;
  }
  return null;
}

export function checkAdminToken(token: string): boolean {
  return token === ADMIN_TOKEN;
}
