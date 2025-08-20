// Trip detail page: renders summary and per-place info (with images) for a given trip id.
import Link from "next/link";
import { tripDetails, type Place } from "@/app/page";
import PlaceGallery from "@/app/components/PlaceGallery";

function Badge({ type }: { type: Place["type"] }) {
  const text = type === "restaurant" ? "Restaurant" : "Attraction";
  const color = type === "restaurant" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${color}`}>{text}</span>;
}

// Next.js 15: params is a Promise in Server Components; await before use
export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = tripDetails[id];

  if (!trip) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-xl font-semibold">Trip not found</h1>
        <p className="mb-4 text-gray-600">The itinerary you are looking for does not exist.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to trips
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      {/* Local header with back link and meta */}
      <header className="border-b border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to trips
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Trip details</h1>
          <p className="text-sm text-gray-400">by {trip.authorName ?? "Anonymous"}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Summary section */}
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-medium">Summary</h2>
          <p className="text-sm text-gray-700">{trip.summary}</p>
        </section>

        {/* Places section */}
        <section>
          <h2 className="mb-3 text-lg font-medium">Restaurants & attractions</h2>
          <ul className="space-y-3">
            {trip.places.map((place, idx) => (
              <li key={`${place.name}-${idx}`} className="flex items-start justify-between rounded-md border border-neutral-800 bg-neutral-900 p-4">
                <div className="w-full">
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="text-sm font-semibold">{place.name}</h3>
                    <Badge type={place.type} />
                  </div>
                  {place.notes && <p className="text-xs text-gray-400">{place.notes}</p>}
                  {place.address && <p className="text-xs text-gray-400">{place.address}</p>}
                  {/* Conditionally render a small image gallery */}
                  <PlaceGallery images={place.images} name={place.name} />
                  {place.url && (
                    <a href={place.url} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                      Website
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}


