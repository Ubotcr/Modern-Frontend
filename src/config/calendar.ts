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
  title: string;
  start: string; // ISO 'YYYY-MM-DD'
  end?: string; // opcional, para rangos
  universities: string[];
  category: EventCategory;
  description?: string;
  link?: string; // fuente oficial
}
