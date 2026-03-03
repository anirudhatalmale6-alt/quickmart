import { NextResponse } from "next/server";
import { getOrders, addOrder, checkAdminToken } from "@/lib/store";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !checkAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getOrders());
}

export async function POST(request: Request) {
  const data = await request.json();

  if (
    !data.customerName ||
    !data.customerPhone ||
    !data.location ||
    !data.items?.length
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const order = addOrder(data);
  return NextResponse.json(order, { status: 201 });
}
