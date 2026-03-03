import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/store";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password required" },
      { status: 400 }
    );
  }

  const token = verifyAdmin(username, password);
  if (!token) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({ token });
}
