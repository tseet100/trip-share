-- CreateTable
CREATE TABLE "TripPlace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "address" TEXT,
    "url" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TripPlace_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
