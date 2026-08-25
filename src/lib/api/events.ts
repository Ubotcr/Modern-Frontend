// src/lib/api/events.ts
// Build-time fetch del calendario de eventos desde backend (SSG, sin runtime).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { CalendarEvent, EventCategory } from "@/config/calendar";

const API_BASE = import.meta.env.EVENTS_API_URL || "https://api.ubotcr.com";
const FETCH_TIMEOUT_MS = 8000;
const KNOWN_CATEGORIES: EventCategory[] = [
  "inscripcion",
  "examen",
  "beca",
  "feria",
  "resultado",
  "general",
];

// "Last known good" snapshot: se sobrescribe SOLO con datos válidos y no
// vacíos. Nunca se pisa con un resultado vacío o de error.
const SNAPSHOT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/events-snapshot.json",
);

// En CI/producción un fetch inválido debe romper el build (no publicar
// calendario vacío). En dev local, cae al último snapshot bueno conocido.
const IS_CI = process.env.CI === "true" || import.meta.env.PROD;

interface ApiEvent {
  event_id: string;
  title: string;
  start: string;
  end?: string;
  type: string;
  audience: string[];
  universities: string[];
  status: string;
  calendar_status: string;
  days_remaining: number;
  description?: string;
  source_url?: string;
}

function mapEvent(ev: ApiEvent): CalendarEvent {
  const category = KNOWN_CATEGORIES.includes(ev.type as EventCategory)
    ? (ev.type as EventCategory)
    : "general";
  return {
    id: ev.event_id,
    title: ev.title,
    start: ev.start,
    end: ev.end,
    universities: ev.universities ?? [],
    category,
    description: ev.description,
    link: ev.source_url,
  };
}

function readSnapshot(): CalendarEvent[] | null {
  try {
    if (!existsSync(SNAPSHOT_PATH)) return null;
    const raw = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf-8"));
    return Array.isArray(raw) && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

function writeSnapshot(events: CalendarEvent[]): void {
  try {
    mkdirSync(dirname(SNAPSHOT_PATH), { recursive: true });
    writeFileSync(SNAPSHOT_PATH, JSON.stringify(events, null, 2) + "\n");
  } catch (err) {
    console.warn("[events] no se pudo escribir el snapshot:", err);
  }
}

async function fetchEvents(): Promise<CalendarEvent[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(
      `${API_BASE}/api/events/upcoming?audience=landing&lead_days=365`,
      { signal: controller.signal },
    );
    if (!res.ok) throw new Error(`events API respondió ${res.status}`);

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      throw new Error("events API devolvió JSON inválido");
    }

    const events = (data as { events?: unknown })?.events;
    if (!Array.isArray(events)) {
      throw new Error("events API devolvió un shape inválido (falta 'events')");
    }
    if (events.length === 0) {
      throw new Error("events API devolvió una lista vacía");
    }

    return (events as ApiEvent[]).map(mapEvent);
  } finally {
    clearTimeout(timeout);
  }
}

let cached: CalendarEvent[] | null = null;

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  if (cached) return cached;

  try {
    cached = await fetchEvents();
    writeSnapshot(cached);
    return cached;
  } catch (err) {
    if (IS_CI) {
      // No publicar calendario vacío/roto: se rompe el build a propósito.
      throw new Error(
        `[events] fetch de calendario falló en build de CI/producción, abortando: ${
          err instanceof Error ? err.message : err
        }`,
      );
    }

    const snapshot = readSnapshot();
    if (snapshot) {
      console.warn(
        "[events] fetch falló en dev, usando último snapshot bueno conocido:",
        err,
      );
      cached = snapshot;
      return cached;
    }

    console.warn(
      "[events] fetch falló en dev y no hay snapshot previo, usando lista vacía:",
      err,
    );
    cached = [];
    return cached;
  }
}
