import { NextResponse } from "next/server";
import { draftItineraryFromPhotos } from "@/app/lib/ai";

export async function POST(request: Request) {
  try {
    const { photos, notes } = (await request.json()) as {
      photos?: string[];
      notes?: string;
    };
    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: "Provide photos[]" }, { status: 400 });
    }
    const text = await draftItineraryFromPhotos(photos, notes);
    return NextResponse.json({ summary: text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "AI failure" }, { status: 500 });
  }
}


