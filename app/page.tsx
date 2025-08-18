// (Removed duplicate Trip type; unified type is defined below)

export type Place = {
  name: string;
  type: "restaurant" | "attraction";
  notes?: string;
  address?: string;
  url?: string;
  images?: string[]; // image URLs
};

export const tripDetails: Record<string, { summary: string; places: Place[]; authorName?: string }> = {
  t1: {
    summary:
      "Lobster rolls, oysters, coastline scenery, and unforgettable sunrises at Acadia National Park.",
    authorName: "Alex",
    places: [
      {
        name: "Claws",
        type: "restaurant",
        notes: "Great lobster roll, seafood salad was a good deal",
        address: "Rockland, Maine",
        images: [
          "https://media-cdn.tripadvisor.com/media/photo-s/08/9e/a8/8b/claws.jpg",
          "https://potatorolls.com/wp-content/uploads/NE-Style-Lobster-Roll_Sweet-Dinner7.jpg",
        ],
      },
      {
        name: "Fushimi Inari Shrine",
        type: "attraction",
        notes: "Go at sunrise to avoid crowds",
        images: [
          "https://i0.wp.com/www.touristjapan.com/wp-content/uploads/2023/04/fujiyoshida-view-scaled-e1680427764989.jpg?resize=2000%2C800&ssl=1",
        ],
      },
      {
        name: "Arashiyama Bamboo Grove",
        type: "attraction",
        images: [
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Ippudo Ramen",
        type: "restaurant",
        notes: "Classic tonkotsu",
        images: [
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=60",
        ],
      },
    ],
  },
  t2: {
    summary:
      "Explored Alfama, LX Factory, and Sintra. Ate way too many pastéis de nata. Tram 28 was worth it early morning.",
    authorName: "Sam",
    places: [
      {
        name: "Time Out Market",
        type: "restaurant",
        notes: "Many options under one roof",
        images: [
          "https://images.unsplash.com/photo-1541542684-4a5c6fd0d2f3?w=1200&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Castelo de S. Jorge",
        type: "attraction",
        images: [
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Pastéis de Belém",
        type: "restaurant",
        notes: "The original nata",
        images: [
          "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=1200&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Pena Palace (Sintra)",
        type: "attraction",
        images: [
          "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=60",
        ],
      },
    ],
  },
  t3: {
    summary:
      "Hikes around Lake Louise and Moraine Lake. Rented a car from Calgary. Pack layers—weather changes fast!",
    authorName: "Jess",
    places: [
      {
        name: "Lake Louise",
        type: "attraction",
        images: [
          "https://images.unsplash.com/photo-1500496733680-167c3db6931d?w=1200&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Moraine Lake",
        type: "attraction",
        images: [
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Park Distillery Restaurant",
        type: "restaurant",
        images: [
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Johnston Canyon",
        type: "attraction",
        images: [
          "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=1200&auto=format&fit=crop&q=60",
        ],
      },
    ],
  },
};

import TripList from "@/app/components/TripList";

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

export const dummyTrips: Trip[] = [
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
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            disabled
            title="Coming soon"
          >
            + Add your trip
          </button>
        </div>

        <TripList trips={dummyTrips} />
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6 text-center text-xs text-gray-400">
          Built with Next.js + Tailwind
        </div>
      </footer>
    </div>
  );
}
