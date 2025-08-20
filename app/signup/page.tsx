"use client";

// Simple signup form posting to our signup API to create a new user
import { useState } from "react";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold">Create account</h1>
        <form
          action="/api/auth/signup"
          method="POST"
          className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6"
          onSubmit={(e) => {
            // Quick client-side check for required fields
            const form = e.currentTarget as HTMLFormElement;
            const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
            const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
            if (!email || !password) {
              e.preventDefault();
              setError("Email and password required");
            }
          }}
        >
          <div>
            <label className="mb-1 block text-xs text-gray-400">Name</label>
            <input name="name" className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Email</label>
            <input type="email" name="email" className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Password</label>
            <input type="password" name="password" className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" required />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">Sign up</button>
          <p className="text-xs text-gray-400">Already have an account? <a href="/signin" className="text-blue-400 hover:underline">Sign in</a></p>
        </form>
      </div>
    </div>
  );
}


