"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MapSnippet = dynamic(() => import("@/app/components/MapSnippet"), { ssr: false });

type LatLng = { lat: number; lng: number };

type Trip = {
  id: string;
  destination: string;
  costCents: number;
  currency: string;
  bookingMethod: string;
  startDate?: string;
  endDate?: string;
  summary: string;
  authorName?: string;
  points: LatLng[];
};

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export default function TripList({ trips }: { trips: Trip[] }) {
  const router = useRouter();
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {trips.map((trip) => (
        <li key={trip.id}>
          <div
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/trips/${trip.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/trips/${trip.id}`);
              }
            }}
            className="group cursor-pointer rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold leading-6 transition-colors group-hover:text-white">
                  {trip.destination}
                </h3>
                <p className="text-xs text-gray-400">
                  {trip.startDate && trip.endDate
                    ? new Date(trip.startDate).toLocaleDateString() +
                      " – " +
                      new Date(trip.endDate).toLocaleDateString()
                    : "Dates TBA"}
                </p>
                <p className="text-xs text-gray-400">
                  by {" "}
                  <Link
                    href={`/authors/${encodeURIComponent(trip.authorName ?? "Anonymous")}`}
                    className="text-blue-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {trip.authorName ?? "Anonymous"}
                  </Link>
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-gray-200">
                {formatMoney(trip.costCents, trip.currency)}
              </span>
            </div>

            <div className="mb-3">
              <MapSnippet points={trip.points} />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                Booked via {trip.bookingMethod}
                {" "}•{" "}
                by {trip.authorName ?? "Anonymous"}
              </span>
              <span className="inline-flex items-center gap-1 text-blue-400 transition-transform group-hover:translate-x-0.5">
                View details
                <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}


