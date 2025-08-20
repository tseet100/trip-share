"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Failed to change password");
        return;
      }
      setSuccess("Password updated. Please sign in again.");
      // Redirect to sign-in after a short delay
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1200);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold">Account security</h1>
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {success && <p className="text-xs text-emerald-400">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}


