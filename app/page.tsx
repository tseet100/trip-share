import TripList from "@/app/components/TripList";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import AuthButton from "@/app/components/AuthButton";

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export default async function Home() {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      destination: true,
      costCents: true,
      currency: true,
      bookingMethod: true,
      startDate: true,
      endDate: true,
      details: true,
      authorName: true,
      points: { select: { lat: true, lng: true, position: true } },
    },
  });
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      <header className="border-b border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Trip Share</h1>
            <p className="text-sm text-gray-400">Discover and share itineraries</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium">Latest itineraries</h2>
          <Link
            href="/trips/new"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            title="Create a new trip"
          >
            + Add your trip
          </Link>
        </div>

        <TripList
          trips={trips.map((t) => ({
            id: t.id,
            destination: t.destination,
            costCents: t.costCents,
            currency: t.currency,
            bookingMethod: t.bookingMethod,
            startDate: t.startDate ? new Date(t.startDate).toISOString() : undefined,
            endDate: t.endDate ? new Date(t.endDate).toISOString() : undefined,
            summary: t.details,
            authorName: t.authorName ?? undefined,
            points: (t.points || [])
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
              .map((p) => ({ lat: p.lat, lng: p.lng })),
          }))}
        />
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6 text-center text-xs text-gray-400">
          Built with Next.js + Tailwind
        </div>
      </footer>
    </div>
  );
}
