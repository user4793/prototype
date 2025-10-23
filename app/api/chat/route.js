import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { slug, message, conversation_id } = body || {};
  if (!slug || !message) {
    return NextResponse.json({ reply: "Missing slug or message." }, { status: 400 });
  }

  const url = process.env.N8N_WEBHOOK_URL;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ slug, message, conversation_id })
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ reply: "Assistant error. Please try again." }, { status: 200 });
    }

    const data = await res.json().catch(async () => ({ reply: await res.text() }));
    return NextResponse.json({ reply: data?.reply ?? "…" });
  } catch (e) {
    return NextResponse.json({ reply: "Could not reach the assistant." }, { status: 200 });
  }
}
