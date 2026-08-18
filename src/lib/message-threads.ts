// Shared, session-persisted store for messages the renter sends from ANY
// entry point in the app — a property enquiry form, "Message Property
// Manager" on a rental, a maintenance update, a flatmate chat, etc. The
// central Messages inbox (renter-dashboard/messages) reads this on load and
// merges it with its built-in demo threads, so wherever a message is sent
// from, it shows up there too.

export type ThreadType = "flatmate" | "landlord" | "manager" | "support";

export type StoredMessage = {
  sender: "user" | "them";
  text: string;
  timestamp: string;
  ts: number;
};

export type ThreadMeta = {
  id: string;
  name: string;
  subtitle: string;
  metaContext: string;
  type: ThreadType;
};

export type StoredThread = ThreadMeta & { messages: StoredMessage[] };

// Bumped to "-v2" so any thread data written before every message carried a
// real `ts` (used to sort the inbox by recency) gets abandoned instead of
// being read back with a missing/invalid timestamp.
const STORAGE_KEY = "hauxhunt-message-threads-v2";

function readThreads(): StoredThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeThreads(threads: StoredThread[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — fail silently,
    // the message still shows for the rest of this page view.
  }
}

export function getStoredThreads(): StoredThread[] {
  return readThreads();
}

// Records a message the renter just sent so it appears in the Messages
// inbox, creating the thread if this is the first message to that
// recipient.
export function recordSentMessage(meta: ThreadMeta, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const threads = readThreads();
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const message: StoredMessage = { sender: "user", text: trimmed, timestamp, ts: Date.now() };

  const existing = threads.find((t) => t.id === meta.id);
  if (existing) {
    existing.messages.push(message);
  } else {
    threads.push({ ...meta, messages: [message] });
  }
  writeThreads(threads);
}

// Turns a free-text name/title (a host name, a property title) into a
// stable id so the same recipient/thread is reused across visits instead of
// spawning a new one each time.
export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "conversation";
}
