// Returns the current NextAuth session as JSON and logs basic request/response info
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function GET(request: Request) {
  const { method } = request as any;
  const url = (request as any).url as string | undefined;
  const headers = Object.fromEntries(request.headers);

  try {
    const session = await getServerSession(authOptions);

    console.log("[api/session]", { method, url, hasUser: Boolean(session?.user) });

    const body = { user: session?.user ?? null };

    console.log("[api/session] response", body);

    return NextResponse.json(body, { status: 200 });
  } catch (err: any) {
    console.error("[api/session] error", err?.message || err);
    const res = NextResponse.json({ user: null }, { status: 200 });
    const expired = new Date(0);
    res.cookies.set("next-auth.session-token", "", { expires: expired, path: "/" });
    res.cookies.set("__Secure-next-auth.session-token", "", { expires: expired, path: "/" });
    res.cookies.set("next-auth.csrf-token", "", { expires: expired, path: "/" });
    return res;
  }
}