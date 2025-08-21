"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type TripResponse = {
  id: string;
  destination: string;
  costCents: number;
  currency: string;
  bookingMethod: string;
  startDate: string | null;
  endDate: string | null;
  details: string;
  isPublic: boolean;
  authorId: string | null;
  authorName: string | null;
  points: { lat: number; lng: number; position: number }[];
  photos: { id: string; url: string; caption?: string | null }[];
  places?: { id: string; name: string; type: string; notes?: string | null; address?: string | null; url?: string | null; position?: number | null }[];
};

export default function EditTripPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const [placesText, setPlacesText] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`/api/trips/${id}`);
        const data: TripResponse = await res.json();
        if (!res.ok) throw new Error((data as any)?.error || "Failed to load");
        if (ignore) return;
        setDestination(data.destination);
        setCost(String((data.costCents ?? 0) / 100));
        setCurrency(data.currency ?? "USD");
        setBookingMethod(data.bookingMethod ?? "");
        setStartDate(data.startDate ? data.startDate.slice(0, 10) : "");
        setEndDate(data.endDate ? data.endDate.slice(0, 10) : "");
        setDetails(data.details ?? "");
        setIsPublic(Boolean(data.isPublic));
        setPointsText((data.points || [])
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((p) => `${p.lat}, ${p.lng}`)
          .join("\n"));
        setPhotoUrls((data.photos || []).map((p) => p.url).join("\n"));
        setPlacesText((data.places || [])
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((pl) => `${pl.name}|${pl.type}|${pl.notes || ""}|${pl.address || ""}|${pl.url || ""}`)
          .join("\n"));
      } catch (e: any) {
        setError(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "PUT",
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
          places: placesText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((line) => {
              const [name, type, notes, address, url] = line.split("|").map((x) => (x ?? "").trim());
              return name ? { name, type, notes, address, url } : null;
            })
            .filter(Boolean),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Failed to update trip");
        return;
      }
      router.push(`/trips/${id}`);
    } catch (e: any) {
      setError(e?.message || "Failed to update trip");
    }
  }

  if (loading) return <div className="mx-auto max-w-2xl px-6 py-10 text-sm text-gray-400">Loading…</div>;
  if (error) return <div className="mx-auto max-w-2xl px-6 py-10 text-sm text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-semibold">Edit trip</h1>
        <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Destination</label>
            <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Estimated cost</label>
              <input inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Currency</label>
              <input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Booking method</label>
            <input value={bookingMethod} onChange={(e) => setBookingMethod(e.target.value)} className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Details</label>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="h-28 w-full resize-y rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Map points (lat,lng per line)</label>
              <textarea value={pointsText} onChange={(e) => setPointsText(e.target.value)} className="h-24 w-full resize-y rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Photo URLs (one per line)</label>
              <textarea value={photoUrls} onChange={(e) => setPhotoUrls(e.target.value)} className="h-24 w-full resize-y rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Places (one per line: name|type|notes|address|url)</label>
            <textarea value={placesText} onChange={(e) => setPlacesText(e.target.value)} className="h-24 w-full resize-y rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500" placeholder={`Claws|RESTAURANT|Great lobster roll|Rockland, ME|https://...`}/>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Make public
          </label>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">Save changes</button>
        </form>
      </div>
    </div>
  );
}


