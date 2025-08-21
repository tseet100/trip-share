"use client";

import { useState } from "react";

export default function NewTripPage() {
  const [destination, setDestination] = useState("");
  const [cost, setCost] = useState<string>("");
  const [currency, setCurrency] = useState("USD");
  const [bookingMethod, setBookingMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [details, setDetails] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [pointsText, setPointsText] = useState("");
  const [photoUrls, setPhotoUrls] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!destination.trim()) {
      setError("Destination is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          cost: cost ? Number(cost) : 0,
          currency,
          bookingMethod,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          details,
          isPublic,
          points: pointsText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((line) => {
              const [lat, lng] = line.split(",").map((x) => Number(x.trim()));
              return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
            })
            .filter(Boolean),
          photos: photoUrls
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((url) => ({ url })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Failed to create trip");
        return;
      }
      setSuccess("Trip created!");
      setTimeout(() => {
        window.location.href = `/trips/${data.id}`;
      }, 800);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onAiDraft() {
    const photos = photoUrls
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (photos.length === 0) {
      setError("Add at least one photo URL to draft an itinerary.");
      return;
    }
    setError(null);
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos, notes: details || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "AI drafting failed");
        return;
      }
      setDetails(data.summary || "");
    } catch (e) {
      setError("AI drafting failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-semibold">Add a new trip</h1>
        <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Destination</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              placeholder="e.g., Kyoto, Japan"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Estimated cost</label>
              <input
                inputMode="decimal"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
                placeholder="e.g., 1500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Currency</label>
              <input
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
                placeholder="USD"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Booking method</label>
            <input
              value={bookingMethod}
              onChange={(e) => setBookingMethod(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              placeholder="e.g., Airbnb + Skyscanner"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs text-gray-400">Details</label>
              <button type="button" onClick={onAiDraft} disabled={aiLoading} className="rounded-md border border-neutral-700 px-2 py-1 text-xs text-gray-200 hover:bg-neutral-800">
                {aiLoading ? "AI drafting…" : "AI Draft from photos"}
              </button>
            </div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="h-28 w-full resize-y rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              placeholder="Describe the itinerary, highlights, and tips"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Map points (lat,lng per line)</label>
              <textarea
                value={pointsText}
                onChange={(e) => setPointsText(e.target.value)}
                className="h-24 w-full resize-y rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
                placeholder={`43.6591, -70.2568\n44.1037, -69.1086`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Photo URLs (one per line)</label>
              <textarea
                value={photoUrls}
                onChange={(e) => setPhotoUrls(e.target.value)}
                className="h-24 w-full resize-y rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
                placeholder={`https://.../image1.jpg\nhttps://.../image2.jpg`}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Make public
          </label>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {success && <p className="text-xs text-emerald-400">{success}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60">
            {loading ? "Creating…" : "Create trip"}
          </button>
        </form>
      </div>
    </div>
  );
}


