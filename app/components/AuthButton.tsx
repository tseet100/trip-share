"use client";

// Header auth control. Fetches current session from our custom /api/session
// to avoid NextAuth client fetches on initial load. Shows Sign in/Sign out accordingly.
import { useEffect, useState } from "react";

export default function AuthButton() {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    // Fetch session once on mount; keep it simple for now
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (ignore) return;
        if (res.ok && data?.user) {
          setStatus("authenticated");
          setUser(data.user);
        } else {
          setStatus("unauthenticated");
          setUser(null);
        }
      } catch {
        if (ignore) return;
        setStatus("unauthenticated");
        setUser(null);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);
  console.log("status", status);
  if (status === "loading") {
    console.log("loading");
    return (
      <button className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-gray-300" disabled>
        …
      </button>
    );
  }

  if (status === "authenticated") {
    console.log("authenticated", user);
    return (
      <form action="/api/auth/signout?callbackUrl=/" method="post">
        <button className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-gray-300 hover:bg-neutral-800">
          Sign out {user?.name ? `(${user.name})` : ""}
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href="/signin"
        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-500"
      >
        Sign in
      </a>
      <a
        href="/signup"
        className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-neutral-800"
      >
        Create account
      </a>
    </div>
  );
}


