// Author page: lists all trips created by a given author name from the database
import Link from "next/link";
import TripList from "@/app/components/TripList";
import { prisma } from "@/app/lib/prisma";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ author: string }>;
}) {
  // Next.js 15: await params before use
  const { author } = await params;
  const decoded = decodeURIComponent(author);
  const rows = await prisma.trip.findMany({
    where: { authorName: decoded },
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
  const trips = rows.map((t) => ({
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
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      {/* Local header for author context */}
      <header className="border-b border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link href="/" className="text-sm text-blue-400 hover:underline">
            ← Back to trips
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Trips by {decoded}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {trips.length === 0 ? (
          <p className="text-sm text-gray-400">No trips found for this author.</p>
        ) : (
          <TripList trips={trips} />
        )}
      </main>
    </div>
  );
}


