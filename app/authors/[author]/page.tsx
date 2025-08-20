// Author page: lists all trips created by a given author name from dummy data
import Link from "next/link";
import TripList from "@/app/components/TripList";
import { dummyTrips } from "@/app/page";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ author: string }>;
}) {
  // Next.js 15: await params before use
  const { author } = await params;
  const decoded = decodeURIComponent(author);
  const trips = dummyTrips.filter((t) => (t.authorName ?? "Anonymous") === decoded);

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


