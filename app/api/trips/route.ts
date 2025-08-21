import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/app/lib/prisma";

// Create a new trip for the signed-in user
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      destination?: string;
      cost?: number; // dollars
      currency?: string;
      bookingMethod?: string;
      startDate?: string; // ISO date
      endDate?: string;   // ISO date
      details?: string;
      isPublic?: boolean;
      points?: { lat: number; lng: number }[];
      photos?: { url: string; caption?: string }[];
    };

    const destination = (body.destination ?? "").trim();
    const bookingMethod = (body.bookingMethod ?? "").trim();
    const details = (body.details ?? "").trim();
    const currency = (body.currency ?? "USD").toUpperCase();
    const isPublic = body.isPublic ?? true;

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 });
    }

    const costCents = Math.max(0, Math.round((body.cost ?? 0) * 100));

    const startDate = body.startDate ? new Date(body.startDate) : null;
    const endDate = body.endDate ? new Date(body.endDate) : null;

    const author = await prisma.user.findUnique({ where: { email: session.user.email.toLowerCase() } });

    const trip = await prisma.trip.create({
      data: {
        destination,
        costCents,
        currency,
        bookingMethod,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
        details,
        isPublic,
        authorId: author?.id,
        authorName: session.user.name || session.user.email || "Anonymous",
        points: body.points && body.points.length > 0 ? {
          create: body.points.map((p, idx) => ({ lat: p.lat, lng: p.lng, position: idx }))
        } : undefined,
        photos: body.photos && body.photos.length > 0 ? {
          create: body.photos.map((p) => ({ url: p.url, caption: p.caption }))
        } : undefined,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: trip.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}


