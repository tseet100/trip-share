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
};

export type Place = {
  name: string;
  type: "restaurant" | "attraction";
  notes?: string;
  address?: string;
  url?: string;
};

export const tripDetails: Record<string, { summary: string; places: Place[] }> = {
  t1: {
    summary:
      "Lobster rolls, oysters, coastline scenery, and unforgettable sunrises at Acadia National Park.",
    places: [
      { name: "Claws", type: "restaurant", notes: "Great lobster roll, seafood salad was a good deal", address: "Rockland, Maine" },
      { name: "Fushimi Inari Shrine", type: "attraction", notes: "Go at sunrise to avoid crowds" },
      { name: "Arashiyama Bamboo Grove", type: "attraction" },
      { name: "Ippudo Ramen", type: "restaurant", notes: "Classic tonkotsu" },
    ],
  },
  t2: {
    summary:
      "Explored Alfama, LX Factory, and Sintra. Ate way too many pastéis de nata. Tram 28 was worth it early morning.",
    places: [
      { name: "Time Out Market", type: "restaurant", notes: "Many options under one roof" },
      { name: "Castelo de S. Jorge", type: "attraction" },
      { name: "Pastéis de Belém", type: "restaurant", notes: "The original nata" },
      { name: "Pena Palace (Sintra)", type: "attraction" },
    ],
  },
  t3: {
    summary:
      "Hikes around Lake Louise and Moraine Lake. Rented a car from Calgary. Pack layers—weather changes fast!",
    places: [
      { name: "Lake Louise", type: "attraction" },
      { name: "Moraine Lake", type: "attraction" },
      { name: "Park Distillery Restaurant", type: "restaurant" },
      { name: "Johnston Canyon", type: "attraction" },
    ],
  },
};

import MapSnippet from "@/app/components/MapSnippet";
import Link from "next/link";

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
  points: LatLng[]; // map points (single city or multiple for road trips)
};

const dummyTrips: Trip[] = [
  {
    id: "t1",
    destination: "Maine Road Trip",
    costCents: 185000,
    currency: "USD",
    bookingMethod: "Airbnb + Expedia",
    startDate: "2024-10-12",
    endDate: "2024-10-20",
    summary: tripDetails.t1.summary,
    authorName: "Alex",
    points: [
      { lat: 43.6591, lng: -70.2568 }, // Portland, ME
      { lat: 44.1037, lng: -69.1086 }, // Rockland, ME
      { lat: 44.3876, lng: -68.2039 }, // Bar Harbor / Acadia
    ],
  },
  {
    id: "t2",
    destination: "Lisbon, Portugal",
    costCents: 98000,
    currency: "USD",
    bookingMethod: "Booking.com + TAP",
    startDate: "2025-03-05",
    endDate: "2025-03-12",
    summary: tripDetails.t2.summary,
    authorName: "Sam",
    points: [
      { lat: 38.7223, lng: -9.1393 }, // Lisbon
    ],
  },
  {
    id: "t3",
    destination: "Banff, Canada",
    costCents: 142500,
    currency: "USD",
    bookingMethod: "Direct hotel + car rental",
    startDate: "2025-06-18",
    endDate: "2025-06-23",
    summary: tripDetails.t3.summary,
    authorName: "Jess",
    points: [
      { lat: 51.1784, lng: -115.5708 }, // Banff
    ],
  },
];

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-gray-100">
      <header className="border-b border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Trip Share</h1>
          <p className="text-sm text-gray-400">Discover and share itineraries</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium">Latest itineraries</h2>
          <button
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50"
            disabled
            title="Coming soon"
          >
            + Add your trip
          </button>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2">
          {dummyTrips.map((trip) => (
            <li key={trip.id}>
              <Link
                href={`/trips/${trip.id}`}
                className="group block rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
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
                  </div>
                  <span className="shrink-0 rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-gray-200">
                    {formatMoney(trip.costCents, trip.currency)}
                  </span>
                </div>

                <div className="mb-3">
                  <MapSnippet points={trip.points} />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Booked via {trip.bookingMethod}</span>
                  <span className="inline-flex items-center gap-1 text-blue-400 transition-transform group-hover:translate-x-0.5">
                    View details
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6 text-center text-xs text-gray-400">
          Built with Next.js + Tailwind
        </div>
      </footer>
    </div>
  );
}
