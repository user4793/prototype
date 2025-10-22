import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { slug, message } = body || {};
  if (!slug || !message) {
    return NextResponse.json({ reply: "Missing slug or message." });
  }

  // Demo local responses — later, replace with n8n webhook fetch
  const lower = message.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) {
    return NextResponse.json({ reply: `Hello! I’m ${slug}’s assistant.` });
  }
  if (lower.includes("book") || lower.includes("meeting")) {
    return NextResponse.json({ reply: "Sure — what day and time should I schedule?" });
  }
  return NextResponse.json({ reply: `You said: “${message}”. (Connect n8n to customize this.)` });
}
