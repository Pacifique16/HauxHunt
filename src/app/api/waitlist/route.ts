import { NextRequest, NextResponse } from "next/server";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeLg0YFsAUTXcR4Y17CqPSpmYf2-tYrXLJhNqjyDkEGm4pscA/formResponse";

const ROLE_MAP: Record<string, string> = {
  renter: "Renter",
  owner: "Property owner",
  property_manager: "Property manager",
  agent: "Agent",
};

const VALID_ROLES = new Set(Object.values(ROLE_MAP));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{9,15}$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // --- Validate name ---
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!name) {
    return NextResponse.json({ field: "fullName", error: "Full name is required." }, { status: 422 });
  }

  // --- Validate email ---
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ field: "email", error: "A valid email address is required." }, { status: 422 });
  }

  // --- Validate phone ---
  const phone = typeof raw.phone === "string" ? raw.phone.trim() : "";
  if (!phone || !PHONE_RE.test(phone)) {
    return NextResponse.json({ field: "phone", error: "A valid phone number is required (9–15 digits)." }, { status: 422 });
  }

  // --- Validate role ---
  const rawRole = typeof raw.role === "string" ? raw.role.trim() : "";
  const role = ROLE_MAP[rawRole] ?? (VALID_ROLES.has(rawRole) ? rawRole : null);
  if (!role) {
    return NextResponse.json({ field: "role", error: "Please select a valid role." }, { status: 422 });
  }

  // --- Submit to Google Forms ---
  const formData = new URLSearchParams({
    "entry.290393496": name,
    "entry.1381189264": email,
    "entry.1899925226": phone,
    "entry.1283363607": role,
  });

  try {
    await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }

  // Google Forms always redirects (3xx) on success — we treat any response as success
  // since a network error would have thrown above.
  return NextResponse.json({ success: true }, { status: 200 });
}
