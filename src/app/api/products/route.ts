import { NextResponse } from "next/server";
import {
  getProducts,
  getAllProducts,
  addProduct,
  checkAdminToken,
} from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all");
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (all === "true" && token && checkAdminToken(token)) {
    return NextResponse.json(getAllProducts());
  }

  return NextResponse.json(getProducts());
}

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !checkAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const product = addProduct(data);
  return NextResponse.json(product, { status: 201 });
}
