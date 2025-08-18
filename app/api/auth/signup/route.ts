import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const email = String(form.get("email") || "").toLowerCase();
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "");
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, name, hashedPassword, role: "USER" } });
    return NextResponse.redirect(new URL("/signin", request.url), { status: 303 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}


