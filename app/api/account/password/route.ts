import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

// Allows a signed-in user to change their password by submitting the current
// password and a new password. On success, the user's hashedPassword is updated.
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Accept JSON body: { currentPassword, newPassword }
    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user?.hashedPassword) {
      return NextResponse.json(
        { error: "No password is set for this account" },
        { status: 400 },
      );
    }

    const ok = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashed },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
}


