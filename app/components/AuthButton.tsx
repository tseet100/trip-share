"use client";

import { useEffect, useState } from "react";

export default function AuthButton() {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!res.ok) throw new Error("session not ok");
        const text = await res.text();
        let data: any = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }
        if (ignore) return;
        if (data?.user) {
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

  if (status === "loading") {
    return (
      <button className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-gray-300" disabled>
        …
      </button>
    );
  }

  if (status === "authenticated") {
    return (
      <form action="/api/auth/signout" method="post">
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


