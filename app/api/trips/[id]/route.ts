import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const me = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email.toLowerCase() }, select: { id: true } })
    : null;

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      destination: true,
      costCents: true,
      currency: true,
      bookingMethod: true,
      startDate: true,
      endDate: true,
      details: true,
      isPublic: true,
      authorId: true,
      authorName: true,
      points: { select: { lat: true, lng: true, position: true } },
      photos: { select: { id: true, url: true, caption: true } },
    },
  });
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const canEdit = !!(me?.id && trip.authorId && me.id === trip.authorId);
  return NextResponse.json({ ...trip, canEdit });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email.toLowerCase() } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.trip.findUnique({ where: { id: params.id }, select: { authorId: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.authorId && existing.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      destination?: string;
      cost?: number;
      currency?: string;
      bookingMethod?: string;
      startDate?: string;
      endDate?: string;
      details?: string;
      isPublic?: boolean;
      points?: { lat: number; lng: number }[];
      photos?: { url: string; caption?: string }[];
      places?: { name: string; type: string; notes?: string; address?: string; url?: string }[];
    };

    const data: any = {};
    if (body.destination !== undefined) data.destination = String(body.destination).trim();
    if (body.cost !== undefined) data.costCents = Math.max(0, Math.round(Number(body.cost) * 100));
    if (body.currency !== undefined) data.currency = String(body.currency).toUpperCase();
    if (body.bookingMethod !== undefined) data.bookingMethod = String(body.bookingMethod).trim();
    if (body.details !== undefined) data.details = String(body.details);
    if (body.isPublic !== undefined) data.isPublic = Boolean(body.isPublic);
    if (body.startDate !== undefined) data.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined) data.endDate = body.endDate ? new Date(body.endDate) : null;

    // Update core fields
    await prisma.trip.update({ where: { id: params.id }, data });

    // Replace points if provided
    if (Array.isArray(body.points)) {
      await prisma.tripPoint.deleteMany({ where: { tripId: params.id } });
      if (body.points.length > 0) {
        await prisma.tripPoint.createMany({
          data: body.points.map((p, idx) => ({ tripId: params.id, lat: p.lat, lng: p.lng, position: idx })),
        });
      }
    }

    // Replace photos if provided
    if (Array.isArray(body.photos)) {
      await prisma.tripPhoto.deleteMany({ where: { tripId: params.id } });
      if (body.photos.length > 0) {
        await prisma.tripPhoto.createMany({
          data: body.photos.map((p) => ({ tripId: params.id, url: p.url, caption: p.caption })),
        });
      }
    }

    // Replace places if provided
    if (Array.isArray(body.places)) {
      await prisma.tripPlace.deleteMany({ where: { tripId: params.id } });
      if (body.places.length > 0) {
        await prisma.tripPlace.createMany({
          data: body.places.map((pl, idx) => ({
            tripId: params.id,
            name: pl.name,
            type: (pl.type || "").toUpperCase() === "ATTRACTION" ? "ATTRACTION" : "RESTAURANT",
            notes: pl.notes,
            address: pl.address,
            url: pl.url,
            position: idx,
          })),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email.toLowerCase() } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.trip.findUnique({ where: { id: params.id }, select: { authorId: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.authorId && existing.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.trip.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}


