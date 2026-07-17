// src/lib/utils/calendar.ts
// Helpers puros del calendario. Compartidos por servidor (render) y cliente (<script>).
import {
  calendarEvents,
  type CalendarEvent,
  type EventCategory,
} from "@/config/calendar";

export type EventState = "past" | "current" | "next" | "future";

// Convierte 'YYYY-MM-DD' a epoch UTC de medianoche (evita corrimientos de zona).
function toUTC(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

// Medianoche UTC del "hoy" según la fecha local del visitante.
function todayUTC(now: Date): number {
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getEventById(id: string): CalendarEvent | undefined {
  return calendarEvents.find((e) => e.id === id);
}

export function sortByStart(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => toUTC(a.start) - toUTC(b.start));
}

// Estado de cada evento contra `now`. El primer evento cuyo inicio es > hoy
// (tras ordenar) es 'next'; el resto de futuros son 'future'.
export function computeStates(
  events: CalendarEvent[],
  now: Date,
): Record<string, EventState> {
  const today = todayUTC(now);
  const sorted = sortByStart(events);
  const result: Record<string, EventState> = {};
  let nextAssigned = false;
  for (const ev of sorted) {
    const start = toUTC(ev.start);
    const end = ev.end ? toUTC(ev.end) : start;
    if (end < today) {
      result[ev.id] = "past";
    } else if (start <= today && today <= end) {
      result[ev.id] = "current";
    } else if (!nextAssigned) {
      result[ev.id] = "next";
      nextAssigned = true;
    } else {
      result[ev.id] = "future";
    }
  }
  return result;
}

// Próximos n eventos con inicio >= hoy, ordenados por fecha.
export function getUpcoming(n: number, now: Date): CalendarEvent[] {
  const today = todayUTC(now);
  return sortByStart(calendarEvents)
    .filter((e) => (e.end ? toUTC(e.end) : toUTC(e.start)) >= today)
    .slice(0, n);
}

// Formatea la fecha o el rango en es-CR (UTC). Ej: "3–4 oct 2026" o "8 ago 2026".
export function formatEventDate(ev: CalendarEvent): string {
  const fmtDay = (iso: string) =>
    new Intl.DateTimeFormat("es-CR", {
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
  const fmtFull = (iso: string) =>
    new Intl.DateTimeFormat("es-CR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
  if (!ev.end || ev.end === ev.start) return fmtFull(ev.start);
  const sameMonth = ev.start.slice(0, 7) === ev.end.slice(0, 7);
  return sameMonth
    ? `${fmtDay(ev.start)}–${fmtFull(ev.end)}`
    : `${fmtFull(ev.start)} – ${fmtFull(ev.end)}`;
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  inscripcion: "Inscripción",
  examen: "Examen",
  beca: "Beca",
  feria: "Feria",
  resultados: "Resultados",
  matricula: "Matrícula",
};

// Clases Tailwind para el badge de categoría.
export const CATEGORY_CLASSES: Record<EventCategory, string> = {
  inscripcion: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  examen: "bg-red-500/10 text-red-600 dark:text-red-400",
  beca: "bg-green-500/10 text-green-600 dark:text-green-400",
  feria: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  resultados: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  matricula: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
};

export const STATE_LABELS: Record<EventState, string> = {
  past: "Finalizado",
  current: "En curso",
  next: "Próximo",
  future: "",
};
