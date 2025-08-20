"use client";

// Credentials sign-in form using next-auth/react signIn API
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  console.log("SignInPage");
  async function onSubmit(e: React.FormEvent) {
    // Prevent default submit; call NextAuth client helper
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    setLoading(false);
    if (!res || res.error) {
      setError(res?.error || "Sign in failed");
      return;
    }
    window.location.href = res.url || "/";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
        {/* Basic email/password form */}
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}


