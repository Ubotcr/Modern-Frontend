// src/config/calendar.ts
// Fuente única de verdad del calendario de admisión.
// Fechas ISO 'YYYY-MM-DD'. Al editar por nuevo ciclo, actualizar este array.

export type EventCategory =
  | "inscripcion"
  | "examen"
  | "beca"
  | "feria"
  | "resultados"
  | "matricula";

export type University = "UCR" | "UNA" | "TEC";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO 'YYYY-MM-DD'
  end?: string; // opcional, para rangos
  universities: University[];
  category: EventCategory;
  description?: string;
  link?: string; // fuente oficial
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: "beca-ucr-solicitud-2026",
    title: "Solicitud de beca socioeconómica UCR",
    start: "2025-12-18",
    end: "2026-01-07",
    universities: ["UCR"],
    category: "beca",
    description:
      "Ventana para solicitar beca socioeconómica en la UCR y entregar documentos (dic 18–20 + ene 5–7).",
    link: "https://becas.ucr.ac.cr",
  },
  {
    id: "sau-inscripcion-2026",
    title: "Inscripción SAU (₡7.000 por universidad)",
    start: "2026-02-16",
    end: "2026-03-20",
    universities: ["UCR", "UNA", "TEC"],
    category: "inscripcion",
    description:
      "Registro en el Sistema de Admisión Universitaria para UCR, UNA, TEC, UNED y UTN con una sola cuenta.",
    link: "https://www.admision.ac.cr",
  },
  {
    id: "feria-tec-2026",
    title: "Feria Vocacional TEC (Cartago)",
    start: "2026-04-16",
    end: "2026-04-17",
    universities: ["TEC"],
    category: "feria",
    description:
      "Feria vocacional del TEC en el Campus Central de Cartago, 8am–4pm. También disponible en modalidad virtual.",
    link: "https://www.tec.ac.cr/feria-vocacional",
  },
  {
    id: "feria-ucr-2026",
    title: "Feria Vocacional UCR (San Pedro)",
    start: "2026-08-05",
    end: "2026-08-07",
    universities: ["UCR"],
    category: "feria",
    description:
      "Feria vocacional de la UCR en el campus Rodrigo Facio, con 179 programas en 9 áreas del conocimiento.",
    link: "https://www.orientacion.ucr.ac.cr",
  },
  {
    id: "examen-tec-1-2026",
    title: "Examen de admisión TEC (1ª convocatoria)",
    start: "2026-08-08",
    universities: ["TEC"],
    category: "examen",
    description: "Primera convocatoria del examen de admisión del TEC.",
    link: "https://www.tec.ac.cr/examen-admision",
  },
  {
    id: "examen-tec-2-2026",
    title: "Examen de admisión TEC (2ª convocatoria)",
    start: "2026-08-22",
    universities: ["TEC"],
    category: "examen",
    description: "Segunda convocatoria del examen de admisión del TEC.",
    link: "https://www.tec.ac.cr/examen-admision",
  },
  {
    id: "examen-tec-3-2026",
    title: "Examen de admisión TEC (3ª convocatoria)",
    start: "2026-08-29",
    universities: ["TEC"],
    category: "examen",
    description: "Tercera convocatoria del examen de admisión del TEC.",
    link: "https://www.tec.ac.cr/examen-admision",
  },
  {
    id: "examen-tec-4-2026",
    title: "Examen de admisión TEC (4ª convocatoria)",
    start: "2026-09-20",
    universities: ["TEC"],
    category: "examen",
    description: "Cuarta convocatoria del examen de admisión del TEC.",
    link: "https://www.tec.ac.cr/examen-admision",
  },
  {
    id: "paa-2026",
    title: "Examen PAA (UCR/UNA)",
    start: "2026-10-03",
    end: "2026-10-04",
    universities: ["UCR", "UNA"],
    category: "examen",
    description:
      "Prueba de Aptitud Académica compartida por UCR y UNA. Mismo examen, misma fecha.",
    link: "https://www.admision.ac.cr",
  },
];
