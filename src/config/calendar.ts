// src/config/calendar.ts
// Fuente única de verdad del calendario de admisión: backend events API
// (build-time fetch, sitio es SSG). Ver src/lib/api/events.ts para el fetch.

export type EventCategory =
  | "inscripcion"
  | "examen"
  | "beca"
  | "feria"
  | "resultado"
  | "general";

export interface CalendarEvent {
  id: string;
  slug?: string; // identificador estable para referenciar desde artículos (EventCard)
  title: string;
  start: string; // ISO 'YYYY-MM-DD'
  end?: string; // opcional, para rangos
  universities: string[];
  category: EventCategory;
  description?: string;
  link?: string; // fuente oficial
  calendarStatus: string; // en_curso | manana | cuenta_regresiva | proximo | pasado (calculado por backend)
  daysRemaining: number; // calculado por backend, no recalcular con la zona horaria del visitante
}
