"use client";

import { useEffect, useState } from "react";

export default function SignInPage() {
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/csrf", { cache: "no-store" });
        const data = await res.json();
        if (!ignore && data?.csrfToken) setCsrfToken(data.csrfToken);
      } catch {
        // ignore
      }
      const url = new URL(window.location.href);
      const err = url.searchParams.get("error");
      if (err) setError(err);
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
        <form action="/api/auth/callback/credentials" method="POST" className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value="/" />
          <div>
            <label className="mb-1 block text-xs text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Password</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}


