import OpenAI from "openai";

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function draftItineraryFromPhotos(
  photos: string[],
  notes?: string,
): Promise<string> {
  const client = getOpenAI();
  if (!client) throw new Error("OpenAI API key not configured");

  const photoList = photos.map((u) => `- ${u}`).join("\n");
  const userPrompt = `I have a set of trip photos. Infer a concise itinerary summary (markdown), including:
- destination(s), rough date range if discernible, highlights, restaurants/attractions
- suggested ordering and must-know tips
- keep it under 200-300 words

Photos:\n${photoList}\n\nAdditional notes (optional): ${notes || "(none)"}`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful travel assistant. Produce practical, well-structured markdown summaries. Avoid fabricating specific venues unless strongly implied.",
      },
      { role: "user", content: userPrompt },
    ],
  });

  const text = completion.choices?.[0]?.message?.content || "";
  return text.trim();
}


