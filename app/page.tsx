type Trip = {
  id: string;
  destination: string;
  costCents: number;
  currency: string;
  bookingMethod: string;
  startDate?: string;
  endDate?: string;
  details: string;
  authorName?: string;
};

const dummyTrips: Trip[] = [
  {
    id: "t1",
    destination: "Kyoto, Japan",
    costCents: 185000,
    currency: "USD",
    bookingMethod: "Airbnb + Skyscanner",
    startDate: "2024-10-12",
    endDate: "2024-10-20",
    details:
      "Autumn leaves, temples, and amazing food. Stayed near Gion, booked tea ceremony and a day trip to Arashiyama.",
    authorName: "Alex",
  },
  {
    id: "t2",
    destination: "Lisbon, Portugal",
    costCents: 98000,
    currency: "USD",
    bookingMethod: "Booking.com + TAP",
    startDate: "2025-03-05",
    endDate: "2025-03-12",
    details:
      "Explored Alfama, LX Factory, and Sintra. Ate way too many pastéis de nata. Tram 28 was worth it early morning.",
    authorName: "Sam",
  },
  {
    id: "t3",
    destination: "Banff, Canada",
    costCents: 142500,
    currency: "USD",
    bookingMethod: "Direct hotel + car rental",
    startDate: "2025-06-18",
    endDate: "2025-06-23",
    details:
      "Hikes around Lake Louise and Moraine Lake. Rented a car from Calgary. Pack layers—weather changes fast!",
    authorName: "Jess",
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Trip Share</h1>
          <p className="text-sm text-gray-600">Discover and share itineraries</p>
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
            <li
              key={trip.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold leading-6">
                    {trip.destination}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {trip.startDate && trip.endDate
                      ? new Date(trip.startDate).toLocaleDateString() +
                        " – " +
                        new Date(trip.endDate).toLocaleDateString()
                      : "Dates TBA"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {formatMoney(trip.costCents, trip.currency)}
                </span>
              </div>

              <p className="mb-3 text-sm text-gray-700 line-clamp-3">{trip.details}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Booked via {trip.bookingMethod}</span>
                <span>by {trip.authorName ?? "Anonymous"}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="border-t border-gray-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-6 text-center text-xs text-gray-500">
          Built with Next.js + Tailwind
        </div>
      </footer>
    </div>
  );
}
