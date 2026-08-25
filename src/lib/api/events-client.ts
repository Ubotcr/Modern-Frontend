// src/lib/api/events-client.ts
// Fetch de calendario en el navegador (CSR). Corre después del paint
// estático (SSG) para reflejar cambios de Firebase/backend sin esperar al
// próximo deploy. Nunca lanza: si falla, el HTML estático ya pintado se
// queda como está.
import type { CalendarEvent } from "@/config/calendar";
import { parseEventsPayload } from "@/lib/api/events-shared";

const API_BASE =
  import.meta.env.PUBLIC_EVENTS_API_URL || "https://api.ubotcr.com";
const FETCH_TIMEOUT_MS = 5000;

async function fetchClient(path: string): Promise<CalendarEvent[] | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (data === null) return null;
    return parseEventsPayload(data);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Próximos eventos — usado por el widget de home.
export function fetchEventsClient(): Promise<CalendarEvent[] | null> {
  return fetchClient("/api/events/upcoming?audience=landing&lead_days=365");
}

// Calendario completo (pasado + futuro) — usado por /calendario.
export function fetchFullCalendarClient(): Promise<CalendarEvent[] | null> {
  return fetchClient("/api/events/calendar?audience=landing");
}
