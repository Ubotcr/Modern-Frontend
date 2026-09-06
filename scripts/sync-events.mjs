// scripts/sync-events.mjs
// Refresca los snapshots del calendario con datos en vivo del backend.
// Uso local: pnpm events:sync
//
// Por qué existe: el build (local y CI) intenta fetch en vivo primero, pero
// si el API falla (p.ej. el WAF devuelve 403 a las IPs de GitHub Actions),
// cae al último snapshot bueno commiteado en src/data/*.json. Correr este
// script en tu PC y commitear el resultado garantiza que el fallback de CI
// siempre tenga datos frescos.
//
// Env: EVENTS_API_URL (default https://api.ubotcr.com)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API_BASE =
  process.env.EVENTS_API_URL || "https://api.ubotcr.com";
const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data");

const KNOWN_CATEGORIES = [
  "inscripcion",
  "examen",
  "beca",
  "feria",
  "resultado",
  "general",
];

const JOBS = [
  ["events-snapshot", "/api/events/upcoming?audience=landing&lead_days=365"],
  ["events-calendar-snapshot", "/api/events/calendar?audience=landing"],
];

function mapEvent(ev) {
  return {
    id: ev.event_id,
    slug: ev.slug,
    title: ev.title,
    start: ev.start,
    end: ev.end,
    universities: ev.universities ?? [],
    category: KNOWN_CATEGORIES.includes(ev.type) ? ev.type : "general",
    description: ev.description,
    link: ev.source_url,
    calendarStatus: ev.calendar_status,
    daysRemaining: ev.days_remaining,
  };
}

async function syncOne(name, path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "NewLanding-sync/1.0 (+https://ubotcr.com)",
      },
    });
    if (!res.ok) throw new Error(`events API respondió ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data?.events) || data.events.length === 0) {
      throw new Error("events API devolvió payload vacío o inválido");
    }
    const mapped = data.events.map(mapEvent);
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(join(DATA_DIR, `${name}.json`), JSON.stringify(mapped, null, 2) + "\n");
    console.log(`[events:sync] ${name}.json: ${mapped.length} eventos`);
  } finally {
    clearTimeout(timeout);
  }
}

for (const [name, path] of JOBS) {
  await syncOne(name, path);
}
console.log("[events:sync] listo — revisá git diff y commiteá src/data/");
