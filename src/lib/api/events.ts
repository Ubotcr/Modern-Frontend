// src/lib/api/events.ts
// Build-time fetch del calendario de eventos desde backend (SSG, sin runtime).
import type { CalendarEvent, EventCategory } from "@/config/calendar";

const API_BASE = import.meta.env.EVENTS_API_URL || "https://api.ubotcr.com";
const KNOWN_CATEGORIES: EventCategory[] = [
  "inscripcion",
  "examen",
  "beca",
  "feria",
  "resultado",
  "general",
];

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

let cached: CalendarEvent[] | null = null;

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  if (cached) return cached;
  try {
    const res = await fetch(
      `${API_BASE}/api/events/upcoming?audience=landing&lead_days=365`,
    );
    if (!res.ok) throw new Error(`events API ${res.status}`);
    const data = await res.json();
    cached = (data.events ?? []).map(mapEvent) as CalendarEvent[];
  } catch (err) {
    console.warn("[events] build-time fetch failed, using empty list:", err);
    cached = [];
  }
  return cached ?? [];
}
