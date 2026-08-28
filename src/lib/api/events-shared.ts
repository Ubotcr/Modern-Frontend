// src/lib/api/events-shared.ts
// Mapeo del payload del backend events API a CalendarEvent.
// Puro, sin I/O: lo usan tanto el fetch de build (server) como el de
// navegador (cliente) en events.ts / events-client.ts.
import type { CalendarEvent, EventCategory } from "@/config/calendar";

export const KNOWN_CATEGORIES: EventCategory[] = [
  "inscripcion",
  "examen",
  "beca",
  "feria",
  "resultado",
  "general",
];

export interface ApiEvent {
  event_id: string;
  slug?: string;
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

export function mapEvent(ev: ApiEvent): CalendarEvent {
  const category = KNOWN_CATEGORIES.includes(ev.type as EventCategory)
    ? (ev.type as EventCategory)
    : "general";
  return {
    id: ev.event_id,
    slug: ev.slug,
    title: ev.title,
    start: ev.start,
    end: ev.end,
    universities: ev.universities ?? [],
    category,
    description: ev.description,
    link: ev.source_url,
    calendarStatus: ev.calendar_status,
    daysRemaining: ev.days_remaining,
  };
}

// Valida el shape mínimo esperado de la respuesta del events API.
// Lanza si el payload no es utilizable (usado por server y cliente para
// decidir si aceptan la respuesta o mantienen lo que ya tenían).
export function parseEventsPayload(data: unknown): CalendarEvent[] {
  const events = (data as { events?: unknown })?.events;
  if (!Array.isArray(events)) {
    throw new Error("events API devolvió un shape inválido (falta 'events')");
  }
  if (events.length === 0) {
    throw new Error("events API devolvió una lista vacía");
  }
  return (events as ApiEvent[]).map(mapEvent);
}
