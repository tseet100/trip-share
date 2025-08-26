import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const files = form.getAll("files");
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const results: string[] = [];
    for (const entry of files) {
      if (!(entry instanceof File)) continue;
      if (entry.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
      }
      const arrayBuffer = await entry.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = (entry.type?.split("/")[1] || "bin").toLowerCase();
      const filename = `${randomUUID()}.${ext}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      results.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls: results }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}


