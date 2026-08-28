// src/lib/utils/calendar.ts
// Helpers puros del calendario. Compartidos por servidor (render) y cliente (<script>).
import type { CalendarEvent, EventCategory } from "@/config/calendar";

// Convierte 'YYYY-MM-DD' a epoch UTC de medianoche (evita corrimientos de zona).
// Solo para orden/agrupación de fechas civiles, nunca para calcular estado.
function toUTC(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

// Badge de estado del evento. Usa exclusivamente `calendarStatus` /
// `daysRemaining` calculados por el backend — nunca la hora del visitante.
export function calendarStatusBadge(
  ev: CalendarEvent,
): { label: string; cls: string } | null {
  switch (ev.calendarStatus) {
    case "pasado":
      return { label: "Finalizado", cls: "bg-gray-500/10 text-gray-500" };
    case "en_curso":
      return { label: "En curso", cls: "bg-primary/10 text-primary" };
    case "manana":
      return { label: "Mañana", cls: "bg-primary/10 text-primary" };
    case "cuenta_regresiva":
      return {
        label: `Faltan ${ev.daysRemaining} día${ev.daysRemaining === 1 ? "" : "s"}`,
        cls: "bg-primary/10 text-primary",
      };
    case "proximo":
      return { label: "Próximo", cls: "bg-primary/10 text-primary" };
    default:
      return null;
  }
}

// Clases de énfasis de la tarjeta según el mismo `calendarStatus`.
export function calendarStateClasses(ev: CalendarEvent): string[] {
  switch (ev.calendarStatus) {
    case "pasado":
      return ["opacity-50"];
    case "en_curso":
      return ["ring-2", "ring-primary"];
    case "manana":
    case "cuenta_regresiva":
    case "proximo":
      return ["ring-1", "ring-primary/40"];
    default:
      return [];
  }
}

// `id` acá es en realidad el identificador estable publicado en artículos
// (EventCard eventId="..."), que es el `slug` del backend, no el doc ID de
// Firestore (aleatorio). Fallback a `id` para eventos sin slug todavía.
export function getEventById(
  events: CalendarEvent[],
  id: string,
): CalendarEvent | undefined {
  return events.find((e) => e.slug === id) ?? events.find((e) => e.id === id);
}

export function sortByStart(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => toUTC(a.start) - toUTC(b.start));
}

// Próximos n eventos no pasados, ordenados por fecha. `calendarStatus` ya
// viene calculado por el backend — no se recalcula "hoy" en el cliente.
export function getUpcoming(
  events: CalendarEvent[],
  n: number,
): CalendarEvent[] {
  return sortByStart(events)
    .filter((e) => e.calendarStatus !== "pasado")
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
  resultado: "Resultados",
  general: "General",
};

// Clases Tailwind para el badge de categoría.
export const CATEGORY_CLASSES: Record<EventCategory, string> = {
  inscripcion: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  examen: "bg-red-500/10 text-red-600 dark:text-red-400",
  beca: "bg-green-500/10 text-green-600 dark:text-green-400",
  feria: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  resultado: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  general: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
};

export interface MonthGroup {
  key: string;
  label: string;
  events: CalendarEvent[];
}

// Agrupa por "YYYY-MM" preservando el orden cronológico de entrada.
export function groupByMonth(events: CalendarEvent[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const ev of events) {
    const key = ev.start.slice(0, 7);
    let g = groups.find((x) => x.key === key);
    if (!g) {
      const label = new Intl.DateTimeFormat("es-CR", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(ev.start));
      g = { key, label, events: [] };
      groups.push(g);
    }
    g.events.push(ev);
  }
  return groups;
}
