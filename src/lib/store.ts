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
    description: "Creamy Amul pasteurized butter",
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
    description: "Fresh pasteurized toned milk",
    price: 68,
    emoji: "🥛",
    category: "Dairy",
    unit: "1 L",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p8",
    name: "Paneer (Cottage Cheese)",
    description: "Fresh and soft paneer, great for curries",
    price: 90,
    emoji: "🧀",
    category: "Dairy",
    unit: "200 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p9",
    name: "Basmati Rice",
    description: "Premium long-grain aged basmati rice",
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
    description: "Whole wheat flour for soft rotis",
    price: 320,
    emoji: "🌾",
    category: "Staples",
    unit: "5 kg",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p11",
    name: "Toor Dal",
    description: "Premium quality toor dal for everyday cooking",
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
    description: "Crispy and spicy classic namkeen snack",
    price: 99,
    emoji: "🍿",
    category: "Snacks",
    unit: "400 g",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p13",
    name: "Parle-G Biscuits",
    description: "India's favourite glucose biscuits",
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
    description: "Light and crispy salted potato chips",
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
    description: "Refreshing raw mango drink",
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
    description: "Chilled Coca-Cola for refreshment",
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
    description: "Powerful grease-cutting dishwash gel",
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
    description: "Tough stain removal washing powder",
    price: 215,
    emoji: "🧹",
    category: "Household",
    unit: "1 kg",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
];

// In-memory store
let products: Product[] = [...seedProducts];
const orders: Order[] = [];
let nextProductNum = 19;

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
