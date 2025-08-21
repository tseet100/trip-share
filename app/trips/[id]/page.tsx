// Trip detail page: fetches a trip from Prisma and renders its fields.
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import EditButton from "@/app/trips/[id]/EditButton";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      destination: true,
      costCents: true,
      currency: true,
      bookingMethod: true,
      startDate: true,
      endDate: true,
      details: true,
      authorName: true,
      createdAt: true,
      photos: { select: { url: true, caption: true, id: true } },
      authorId: true,
      places: { select: { id: true, name: true, type: true, notes: true, address: true, url: true, position: true } },
    },
  });

  if (!trip) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-xl font-semibold">Trip not found</h1>
        <p className="mb-4 text-gray-400">The itinerary you are looking for does not exist.</p>
        <Link href="/" className="text-blue-400 hover:underline">
          ← Back to trips
        </Link>
      </div>
    );
  }

  const dateRange = trip.startDate && trip.endDate
    ? `${new Date(trip.startDate).toLocaleDateString()} – ${new Date(trip.endDate).toLocaleDateString()}`
    : "Dates TBA";

  const money = new Intl.NumberFormat(undefined, { style: "currency", currency: trip.currency }).format(
    trip.costCents / 100,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      <header className="border-b border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link href="/" className="text-sm text-blue-400 hover:underline">
            ← Back to trips
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{trip.destination}</h1>
          <p className="text-sm text-gray-400">by {trip.authorName ?? "Anonymous"}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <EditButton id={id} />
        {/* Prioritize places at the top */}
        {trip.places.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-medium">Restaurants & attractions</h2>
            <ul className="space-y-3">
              {trip.places
                .slice()
                .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                .map((pl) => (
                  <li key={pl.id} className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wide text-gray-400">{pl.type === "ATTRACTION" ? "Attraction" : "Restaurant"}</span>
                      <span className="text-sm font-semibold">{pl.name}</span>
                    </div>
                    {pl.notes && <p className="text-xs text-gray-400">{pl.notes}</p>}
                    {pl.address && <p className="text-xs text-gray-500">{pl.address}</p>}
                    {pl.url && (
                      <a href={pl.url} className="text-xs text-blue-400 hover:underline" target="_blank" rel="noreferrer">
                        Website
                      </a>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        )}

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4 text-sm text-gray-300">
            <div className="text-xs text-gray-400">Dates</div>
            <div>{dateRange}</div>
          </div>
          <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4 text-sm text-gray-300">
            <div className="text-xs text-gray-400">Cost</div>
            <div>{money}</div>
          </div>
          <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4 text-sm text-gray-300">
            <div className="text-xs text-gray-400">Booking</div>
            <div>{trip.bookingMethod || "—"}</div>
          </div>
          <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4 text-sm text-gray-300">
            <div className="text-xs text-gray-400">Created</div>
            <div>{new Date(trip.createdAt).toLocaleString()}</div>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium">Details</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-300">{trip.details || "No additional details"}</p>
        </section>

        {trip.photos.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-2 text-lg font-medium">Photos</h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {trip.photos.map((ph) => (
                <li key={ph.id} className="aspect-video overflow-hidden rounded-md border border-neutral-800">
                  <img src={ph.url} alt={ph.caption || "Trip photo"} className="h-full w-full object-cover" loading="lazy" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}


