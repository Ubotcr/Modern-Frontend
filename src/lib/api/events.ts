// src/lib/api/events.ts
// Build-time fetch del calendario de eventos desde backend (SSG, sin runtime).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CalendarEvent } from "@/config/calendar";
import { parseEventsPayload } from "@/lib/api/events-shared";

const API_BASE = import.meta.env.EVENTS_API_URL || "https://api.ubotcr.com";
const FETCH_TIMEOUT_MS = 8000;

// En CI/producción un fetch inválido debe romper el build (no publicar
// calendario vacío). En dev local, cae al último snapshot bueno conocido.
const IS_CI = process.env.CI === "true" || import.meta.env.PROD;

const DATA_DIR = join(process.cwd(), "src", "data");

// "Last known good" snapshot: se sobrescribe SOLO con datos válidos y no
// vacíos. Nunca se pisa con un resultado vacío o de error.
function snapshotPath(name: string): string {
  return join(DATA_DIR, `${name}.json`);
}

function readSnapshot(name: string): CalendarEvent[] | null {
  try {
    const path = snapshotPath(name);
    if (!existsSync(path)) return null;
    const raw = JSON.parse(readFileSync(path, "utf-8"));
    return Array.isArray(raw) && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

function writeSnapshot(name: string, events: CalendarEvent[]): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(snapshotPath(name), JSON.stringify(events, null, 2) + "\n");
  } catch (err) {
    console.warn(`[events] no se pudo escribir el snapshot '${name}':`, err);
  }
}

async function fetchEvents(path: string): Promise<CalendarEvent[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        // Algunos WAF/CDN bloquean el UA por defecto de undici con 403.
        "User-Agent": "NewLanding-build/1.0 (+https://ubotcr.com)",
      },
    });
    if (!res.ok) throw new Error(`events API respondió ${res.status}`);

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      throw new Error("events API devolvió JSON inválido");
    }

    return parseEventsPayload(data);
  } finally {
    clearTimeout(timeout);
  }
}

// Fábrica de getters con caché en memoria + last-known-good por snapshot,
// una por endpoint (evita que /calendario y /upcoming se pisen el caché).
function makeEventsGetter(name: string, path: string) {
  let cached: CalendarEvent[] | null = null;

  return async function getEvents(): Promise<CalendarEvent[]> {
    if (cached) return cached;

    try {
      cached = await fetchEvents(path);
      writeSnapshot(name, cached);
      return cached;
    } catch (err) {
      // Snapshot commiteado (src/data/*.json) vale también en CI: un 403 o
      // caída del API no debe tumbar todo el build. Solo se aborta si no hay
      // snapshot previo al cual caer.
      const snapshot = readSnapshot(name);
      if (snapshot) {
        console.warn(
          `[events] fetch de '${name}' falló, usando último snapshot bueno conocido:`,
          err,
        );
        cached = snapshot;
        return cached;
      }

      if (IS_CI) {
        // No publicar calendario vacío/roto: se rompe el build a propósito.
        throw new Error(
          `[events] fetch de '${name}' falló en build de CI/producción, abortando: ${
            err instanceof Error ? err.message : err
          }`,
        );
      }

      console.warn(
        `[events] fetch de '${name}' falló en dev y no hay snapshot previo, usando lista vacía:`,
        err,
      );
      cached = [];
      return cached;
    }
  };
}

// Próximos eventos (lead_days=365): usado en el widget de home y como
// fuente de "próximo evento" en /calendario.
export const getCalendarEvents = makeEventsGetter(
  "events-snapshot",
  "/api/events/upcoming?audience=landing&lead_days=365",
);

// Calendario completo (pasado + futuro): usado en /calendario para "Todas
// las fechas" y el estado "Finalizado", que /upcoming nunca puede llenar.
export const getFullCalendarEvents = makeEventsGetter(
  "events-calendar-snapshot",
  "/api/events/calendar?audience=landing",
);
