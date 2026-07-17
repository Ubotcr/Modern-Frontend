# Calendario de fechas importantes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un calendario de fechas de admisión universitaria (UCR/UNA/TEC) con página propia `/calendario`, un widget de "próximos 3 eventos" en el index, y tarjetas `<EventCard>` embebidas en posts del blog relevantes.

**Architecture:** Única fuente de verdad tipada en `src/config/calendar.ts`. Helpers puros en `src/lib/utils/calendar.ts` compartidos por servidor (render) y cliente (`<script>` bundleado). El estado pasado/actual/próximo se calcula en el cliente contra la fecha real del visitante. Filtrado por universidad + categoría es client-side con `data-*` attributes y JS vanilla.

**Tech Stack:** Astro 6 (static), TypeScript, Tailwind CSS v4, MDX (`@astrojs/mdx`), pnpm.

## Global Constraints

- Gestor de paquetes: **pnpm** (usar `pnpm`, no npm).
- Sin framework de tests en el repo — **no se agrega uno**. Verificación = `pnpm check` (astro check + tsc) + `pnpm build` + `grep` sobre `dist/` + chequeo en navegador para interactividad. `pnpm build` corre primero `scripts/themeGenerator.js`.
- Aliases de import: `@/components/*` → `src/layouts/components/*`; `@/partials/*` → `src/layouts/partials/*`; `@/*` → `src/*`.
- Fechas en formato ISO `YYYY-MM-DD`. Formateo visible en `es-CR`, **timeZone `UTC`** (igual que `src/lib/utils/blog.ts`) para evitar corrimientos.
- Clases de color/estilo: usar tokens existentes de Tailwind del proyecto (`text-text`, `text-text-light`, `text-gray`, `text-primary`, `bg-primary/10`, `border-border`, `bg-card`).
- Copy en español (Costa Rica).
- Categorías válidas (6): `inscripcion`, `examen`, `beca`, `feria`, `resultados`, `matricula`. Universidades: `UCR`, `UNA`, `TEC`.

---

## File Structure

- Create: `src/config/calendar.ts` — tipos + array de eventos (datos).
- Create: `src/lib/utils/calendar.ts` — helpers puros (estado, orden, próximos, formateo, mapas de etiqueta/color).
- Create: `src/layouts/components/EventCard.astro` — tarjeta de 1 evento (para posts MDX).
- Create: `src/layouts/components/CalendarWidget.astro` — widget "próximos 3" del index.
- Create: `src/pages/calendario.astro` — página completa (timeline + filtros).
- Modify: `src/pages/index.astro` — insertar `<CalendarWidget>`.
- Modify: `src/config/menu.json` — entrada "Calendario" bajo Recursos.
- Modify: `src/content/blog/como-entrar-universidad-publica-costa-rica.md` → renombrar a `.mdx` + embeber `<EventCard>`.

---

## Task 1: Datos y tipos — `src/config/calendar.ts`

**Files:**
- Create: `src/config/calendar.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `type EventCategory = 'inscripcion'|'examen'|'beca'|'feria'|'resultados'|'matricula'`
  - `type University = 'UCR'|'UNA'|'TEC'`
  - `interface CalendarEvent { id: string; title: string; start: string; end?: string; universities: University[]; category: EventCategory; description?: string; link?: string }`
  - `const calendarEvents: CalendarEvent[]`

- [ ] **Step 1: Crear el archivo con tipos y datos**

```ts
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
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm check`
Expected: PASS — 0 errors. (Puede reportar warnings preexistentes ajenos a este archivo; no debe haber errores nuevos que mencionen `calendar.ts`.)

- [ ] **Step 3: Commit**

```bash
git add src/config/calendar.ts
git commit -m "feat(calendar): add event data source and types"
```

---

## Task 2: Helpers puros — `src/lib/utils/calendar.ts`

**Files:**
- Create: `src/lib/utils/calendar.ts`

**Interfaces:**
- Consumes: `calendarEvents`, `CalendarEvent`, `EventCategory`, `University` de `@/config/calendar`.
- Produces:
  - `type EventState = 'past'|'current'|'next'|'future'`
  - `function getEventById(id: string): CalendarEvent | undefined`
  - `function sortByStart(events: CalendarEvent[]): CalendarEvent[]`
  - `function computeStates(events: CalendarEvent[], now: Date): Record<string, EventState>`
  - `function getUpcoming(n: number, now: Date): CalendarEvent[]`
  - `function formatEventDate(ev: CalendarEvent): string`
  - `const CATEGORY_LABELS: Record<EventCategory, string>`
  - `const CATEGORY_CLASSES: Record<EventCategory, string>`
  - `const STATE_LABELS: Record<EventState, string>`

- [ ] **Step 1: Crear el archivo de helpers**

```ts
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
    new Intl.DateTimeFormat("es-CR", { day: "numeric", timeZone: "UTC" }).format(
      new Date(iso),
    );
  const fmtFull = (iso: string) =>
    new Intl.DateTimeFormat("es-CR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
  if (!ev.end || ev.end === ev.start) return fmtFull(ev.start);
  const sameMonth = ev.start.slice(0, 7) === ev.end.slice(0, 7);
  return sameMonth ? `${fmtDay(ev.start)}–${fmtFull(ev.end)}` : `${fmtFull(ev.start)} – ${fmtFull(ev.end)}`;
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
```

- [ ] **Step 2: Verificación funcional de los helpers puros (throwaway)**

Escribir un chequeo temporal que ejerza `computeStates`, `getUpcoming` y `formatEventDate` con una fecha fija. Crear `scripts/_calendar_check.mjs`:

```js
// throwaway — verifica lógica de estado con fecha fija; se borra al final.
import {
  computeStates,
  getUpcoming,
  formatEventDate,
} from "../src/lib/utils/calendar.ts";
import { calendarEvents } from "../src/config/calendar.ts";

const now = new Date("2026-07-17T12:00:00");
const states = computeStates(calendarEvents, now);
console.assert(states["sau-inscripcion-2026"] === "past", "SAU debe ser past");
console.assert(states["feria-tec-2026"] === "past", "feria TEC debe ser past");
console.assert(states["feria-ucr-2026"] === "next", "feria UCR debe ser next");
console.assert(states["paa-2026"] === "future", "PAA debe ser future");

const up = getUpcoming(3, now).map((e) => e.id);
console.assert(up[0] === "feria-ucr-2026", "primer próximo = feria UCR");
console.assert(up.length === 3, "deben ser 3 próximos");

console.assert(
  formatEventDate(calendarEvents.find((e) => e.id === "paa-2026")) === "3–4 oct 2026",
  "formato rango PAA",
);
console.log("OK calendar helpers");
```

- [ ] **Step 3: Ejecutar el chequeo**

Run: `pnpm exec astro sync && node --experimental-strip-types scripts/_calendar_check.mjs`
Expected: imprime `OK calendar helpers` sin ningún mensaje `Assertion failed`.
(Si `--experimental-strip-types` no está disponible en la versión de Node del repo — ver `.nvmrc` —, correr con `pnpm exec tsx scripts/_calendar_check.mjs` sólo si `tsx` ya existe; si no, omitir este chequeo y confiar en `pnpm check` + la verificación en navegador de la Task 5.)

- [ ] **Step 4: Borrar el chequeo temporal**

```bash
rm scripts/_calendar_check.mjs
```

- [ ] **Step 5: Verificar tipos**

Run: `pnpm check`
Expected: PASS — sin errores nuevos que mencionen `calendar.ts`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/utils/calendar.ts
git commit -m "feat(calendar): add pure helpers for state, ordering, formatting"
```

---

## Task 3: EventCard — `src/layouts/components/EventCard.astro`

**Files:**
- Create: `src/layouts/components/EventCard.astro`

**Interfaces:**
- Consumes: `getEventById`, `formatEventDate`, `CATEGORY_LABELS`, `CATEGORY_CLASSES` de `@/lib/utils/calendar`.
- Produces: componente `<EventCard eventId="..." />` (renderiza tarjeta de 1 evento; nada si el id no existe).

- [ ] **Step 1: Crear el componente**

```astro
---
// src/layouts/components/EventCard.astro
import {
  getEventById,
  formatEventDate,
  CATEGORY_LABELS,
  CATEGORY_CLASSES,
} from "@/lib/utils/calendar";

interface Props {
  eventId: string;
}

const { eventId } = Astro.props;
const ev = getEventById(eventId);
---

{
  ev && (
    <aside class="my-8 rounded-xl border border-border bg-card p-5">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_CLASSES[ev.category]}`}
        >
          {CATEGORY_LABELS[ev.category]}
        </span>
        {ev.universities.map((u) => (
          <span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {u}
          </span>
        ))}
      </div>
      <p class="mt-3 text-sm font-semibold text-gray">{formatEventDate(ev)}</p>
      <h3 class="mt-1 text-lg font-bold text-text-light">{ev.title}</h3>
      {ev.description && <p class="mt-1 text-sm text-text">{ev.description}</p>}
      <a
        href={`/calendario#${ev.id}`}
        class="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
      >
        Ver en el calendario →
      </a>
    </aside>
  )
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm check`
Expected: PASS — sin errores nuevos que mencionen `EventCard.astro`.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/components/EventCard.astro
git commit -m "feat(calendar): add EventCard component for blog posts"
```

---

## Task 4: Widget del index — `src/layouts/components/CalendarWidget.astro` + integración

**Files:**
- Create: `src/layouts/components/CalendarWidget.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `calendarEvents` de `@/config/calendar`; `getUpcoming`, `formatEventDate` de `@/lib/utils/calendar`.
- Produces: componente `<CalendarWidget />` (sin props).

- [ ] **Step 1: Crear el widget**

El servidor renderiza un conjunto amplio de candidatos (los ordenados) con `data-*`; un `<script>` bundleado recalcula los 3 próximos reales contra la fecha del visitante y oculta el resto. Así el widget queda fresco sin depender del momento del build.

```astro
---
// src/layouts/components/CalendarWidget.astro
import { calendarEvents } from "@/config/calendar";
import { sortByStart, formatEventDate } from "@/lib/utils/calendar";

// Candidatos: todos ordenados. El cliente filtra a los 3 próximos.
const candidates = sortByStart(calendarEvents);
---

<section class="px-4 py-12 md:py-16">
  <div class="container mx-auto max-w-3xl">
    <div class="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-xl font-bold text-text-light md:text-2xl">
          📅 Fechas importantes
        </h2>
        <a
          href="/calendario"
          class="shrink-0 text-sm font-semibold text-primary hover:underline"
        >
          Ver calendario →
        </a>
      </div>

      <ul class="mt-5 flex flex-col divide-y divide-border" data-calendar-widget>
        {
          candidates.map((ev) => (
            <li
              class="hidden items-start gap-4 py-3"
              data-widget-item
              data-start={ev.start}
              data-end={ev.end ?? ev.start}
            >
              <span class="w-24 shrink-0 text-sm font-semibold text-gray">
                {formatEventDate(ev)}
              </span>
              <span class="flex-1 text-sm text-text-light">{ev.title}</span>
              <span class="flex shrink-0 gap-1">
                {ev.universities.map((u) => (
                  <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {u}
                  </span>
                ))}
              </span>
            </li>
          ))
        }
      </ul>

      <p class="mt-4 hidden text-sm text-gray" data-widget-empty>
        Pronto se publicarán las fechas del próximo ciclo.
      </p>
    </div>
  </div>
</section>

<script>
  const today = new Date();
  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const toUTC = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const items = Array.from(
    document.querySelectorAll<HTMLElement>("[data-widget-item]"),
  );
  const upcoming = items.filter(
    (el) => toUTC(el.dataset.end || el.dataset.start || "") >= todayUTC,
  );
  upcoming.slice(0, 3).forEach((el) => {
    el.classList.remove("hidden");
    el.classList.add("flex");
  });
  if (upcoming.length === 0) {
    document
      .querySelector<HTMLElement>("[data-widget-empty]")
      ?.classList.remove("hidden");
  }
</script>
```

- [ ] **Step 2: Integrar el widget en el index**

Modificar `src/pages/index.astro`. Añadir el import y colocar `<CalendarWidget />` entre `<FAQ ... />` y `<CallToAction ... />`.

Import (añadir junto a los demás imports, línea ~3):

```astro
import CalendarWidget from "@/components/CalendarWidget.astro";
```

Cuerpo (dejar así el bloque entre FAQ y CallToAction):

```astro
  <FAQ data={faq} />
  <CalendarWidget />
  <CallToAction data={callToAction} />
```

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: build OK, sin errores.

- [ ] **Step 4: Verificar que el widget está en el HTML generado**

Run: `grep -c "Fechas importantes" dist/index.html`
Expected: `1` (o mayor). Además: `grep -c "data-widget-item" dist/index.html` → 9.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/components/CalendarWidget.astro src/pages/index.astro
git commit -m "feat(calendar): add homepage widget with next 3 events"
```

---

## Task 5: Página `/calendario` — `src/pages/calendario.astro`

**Files:**
- Create: `src/pages/calendario.astro`

**Interfaces:**
- Consumes: `calendarEvents` de `@/config/calendar`; `sortByStart`, `formatEventDate`, `CATEGORY_LABELS`, `CATEGORY_CLASSES` de `@/lib/utils/calendar`.
- Produces: ruta estática `/calendario`.

- [ ] **Step 1: Crear la página con timeline agrupado por mes y filtros**

El servidor agrupa por mes y renderiza todos los eventos con `data-*` (id, universities, category, start, end). Un `<script>` bundleado aplica: (a) estado pasado/actual/próximo contra la fecha del visitante, y (b) filtrado por universidad + categoría (AND).

```astro
---
import Base from "@/layouts/Base.astro";
import CallToAction from "@/partials/CallToAction.astro";
import { calendarEvents } from "@/config/calendar";
import {
  sortByStart,
  formatEventDate,
  CATEGORY_LABELS,
  CATEGORY_CLASSES,
} from "@/lib/utils/calendar";

const sorted = sortByStart(calendarEvents);

// Agrupar por "YYYY-MM" preservando el orden cronológico.
const groups: { key: string; label: string; events: typeof sorted }[] = [];
for (const ev of sorted) {
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

const universities = ["UCR", "UNA", "TEC"] as const;
const categories = Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[];
---

<Base
  title="Calendario de admisión 2026"
  description="Todas las fechas clave de admisión universitaria en Costa Rica (UCR, UNA, TEC) en un solo lugar."
>
  <section class="px-4 py-12 md:py-16">
    <div class="container mx-auto max-w-3xl">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-text-light md:text-4xl">
          Calendario de admisión 2026
        </h1>
        <p class="mx-auto mt-3 max-w-2xl text-text">
          Todas las fechas de inscripción, exámenes, becas y ferias de la UCR,
          la UNA y el TEC en un solo lugar. Verificá siempre las fechas en las
          fuentes oficiales.
        </p>
      </div>

      <!-- Filtros -->
      <div class="mt-8 flex flex-col gap-3" data-calendar-filters>
        <div class="flex flex-wrap items-center gap-2">
          <span class="mr-1 text-sm font-semibold text-gray">Universidad:</span>
          <button
            class="rounded-full border border-primary bg-primary px-3 py-1 text-sm font-semibold text-white"
            data-filter-uni="all">Todas</button>
          {
            universities.map((u) => (
              <button
                class="rounded-full border border-border px-3 py-1 text-sm font-semibold text-text"
                data-filter-uni={u}
              >
                {u}
              </button>
            ))
          }
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="mr-1 text-sm font-semibold text-gray">Tipo:</span>
          <button
            class="rounded-full border border-primary bg-primary px-3 py-1 text-sm font-semibold text-white"
            data-filter-cat="all">Todas</button>
          {
            categories.map((c) => (
              <button
                class="rounded-full border border-border px-3 py-1 text-sm font-semibold text-text"
                data-filter-cat={c}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))
          }
        </div>
      </div>

      <!-- Timeline -->
      <div class="mt-10 flex flex-col gap-10" data-calendar-timeline>
        {
          groups.map((g) => (
            <div data-month-group data-month={g.key}>
              <h2 class="mb-4 text-lg font-bold capitalize text-text-light">
                {g.label}
              </h2>
              <div class="flex flex-col gap-4">
                {g.events.map((ev) => (
                  <article
                    id={ev.id}
                    class="rounded-xl border border-border bg-card p-5 transition-opacity"
                    data-event
                    data-universities={ev.universities.join(",")}
                    data-category={ev.category}
                    data-start={ev.start}
                    data-end={ev.end ?? ev.start}
                  >
                    <div class="flex flex-wrap items-center gap-2">
                      <span
                        class={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_CLASSES[ev.category]}`}
                      >
                        {CATEGORY_LABELS[ev.category]}
                      </span>
                      {ev.universities.map((u) => (
                        <span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {u}
                        </span>
                      ))}
                      <span
                        class="ml-auto hidden rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        data-state-badge
                      />
                    </div>
                    <p class="mt-3 text-sm font-semibold text-gray">
                      {formatEventDate(ev)}
                    </p>
                    <h3 class="mt-1 text-lg font-bold text-text-light">
                      {ev.title}
                    </h3>
                    {ev.description && (
                      <p class="mt-1 text-sm text-text">{ev.description}</p>
                    )}
                    {ev.link && (
                      <a
                        href={ev.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                      >
                        Fuente oficial →
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))
        }
      </div>

      <p class="mt-10 hidden text-center text-text" data-calendar-empty>
        No hay eventos con esos filtros.
      </p>
    </div>
  </section>

  <CallToAction data={undefined} />
</Base>

<script>
  // --- Estado (pasado/actual/próximo) contra la fecha del visitante ---
  const today = new Date();
  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const toUTC = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };

  const events = Array.from(
    document.querySelectorAll<HTMLElement>("[data-event]"),
  );

  let nextAssigned = false;
  for (const el of events) {
    const start = toUTC(el.dataset.start || "");
    const end = toUTC(el.dataset.end || el.dataset.start || "");
    const badge = el.querySelector<HTMLElement>("[data-state-badge]");
    let label = "";
    let cls = "";
    if (end < todayUTC) {
      el.classList.add("opacity-50");
      label = "Finalizado";
      cls = "bg-gray-500/10 text-gray-500";
    } else if (start <= todayUTC && todayUTC <= end) {
      el.classList.add("ring-2", "ring-primary");
      label = "En curso";
      cls = "bg-primary/10 text-primary";
    } else if (!nextAssigned) {
      nextAssigned = true;
      el.classList.add("ring-1", "ring-primary/40");
      label = "Próximo";
      cls = "bg-primary/10 text-primary";
    }
    if (badge && label) {
      badge.textContent = label;
      badge.className = `ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`;
    }
  }

  // --- Filtros universidad + categoría (AND) ---
  let uni = "all";
  let cat = "all";

  const apply = () => {
    let visible = 0;
    for (const el of events) {
      const unis = (el.dataset.universities || "").split(",");
      const okUni = uni === "all" || unis.includes(uni);
      const okCat = cat === "all" || el.dataset.category === cat;
      const show = okUni && okCat;
      el.classList.toggle("hidden", !show);
      if (show) visible++;
    }
    // Ocultar grupos de mes vacíos.
    document
      .querySelectorAll<HTMLElement>("[data-month-group]")
      .forEach((g) => {
        const anyVisible = g.querySelector("[data-event]:not(.hidden)");
        g.classList.toggle("hidden", !anyVisible);
      });
    document
      .querySelector<HTMLElement>("[data-calendar-empty]")
      ?.classList.toggle("hidden", visible > 0);
  };

  const wire = (attr: string, setter: (v: string) => void) => {
    document.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = document.querySelectorAll<HTMLElement>(`[${attr}]`);
        group.forEach((b) => {
          b.classList.remove("border-primary", "bg-primary", "text-white");
          b.classList.add("border-border", "text-text");
        });
        btn.classList.add("border-primary", "bg-primary", "text-white");
        btn.classList.remove("border-border", "text-text");
        setter(btn.getAttribute(attr) || "all");
        apply();
      });
    });
  };

  wire("data-filter-uni", (v) => (uni = v));
  wire("data-filter-cat", (v) => (cat = v));
</script>
```

- [ ] **Step 2: Verificar el prop de CallToAction**

`CallToAction` en el index recibe `data={callToAction}` (de `sections/call-to-action.md`). Confirmar cómo usa el prop antes de pasar `undefined`.

Run: `sed -n '1,40p' src/layouts/partials/CallToAction.astro`
Expected: ver si accede a `data.frontmatter...`. Si `data={undefined}` rompería el render:
- Opción elegida: cargar la misma sección que el index. Reemplazar en el frontmatter de `calendario.astro`:
  - Añadir `import { getListPage } from "@/lib/contentParser";`
  - Añadir `const callToAction = await getListPage("sections/call-to-action.md");`
  - Cambiar `<CallToAction data={undefined} />` por `<CallToAction data={callToAction} />`.

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: build OK; genera `dist/calendario/index.html` (o `dist/calendario.html` según `trailingSlash`).

- [ ] **Step 4: Verificar contenido estático generado**

Run: `grep -rc "data-event" dist/calendario* && grep -rc "Calendario de admisión 2026" dist/calendario*`
Expected: 9 elementos `data-event` y ≥1 del título.

- [ ] **Step 5: Verificación en navegador (interactividad)**

Iniciar preview y comprobar a mano: `pnpm preview` y abrir `/calendario`.
Verificar (usar el skill `run` o `claude-in-chrome` si está disponible):
- Timeline agrupado por mes, orden cronológico.
- Con fecha real ≥ 2026-07-17: feria UCR marcada "Próximo"; SAU/beca/feria TEC atenuados "Finalizado".
- Filtro Universidad = TEC → sólo eventos TEC; meses sin TEC ocultos.
- Filtro Tipo = Examen + Universidad = UCR → sólo `paa-2026`.
- Combinación sin resultados (ej. Beca + TEC) → mensaje "No hay eventos con esos filtros".

- [ ] **Step 6: Commit**

```bash
git add src/pages/calendario.astro
git commit -m "feat(calendar): add /calendario page with month timeline and filters"
```

---

## Task 6: Entrada de menú — `src/config/menu.json`

**Files:**
- Modify: `src/config/menu.json`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: enlace "Calendario" → `/calendario` bajo "Recursos".

- [ ] **Step 1: Añadir la entrada en `children` de "Recursos"**

En el objeto `main` → item `"Recursos"` → array `children`, añadir tras "Blog":

```json
        {
          "name": "Calendario",
          "url": "/calendario"
        },
```

Resultado del bloque `children`:

```json
      "children": [
        {
          "name": "Blog",
          "url": "/blog"
        },
        {
          "name": "Calendario",
          "url": "/calendario"
        },
        {
          "name": "Registro de cambios",
          "url": "/changelog"
        }
      ]
```

- [ ] **Step 2: Build y verificar el enlace**

Run: `pnpm build && grep -rc "/calendario" dist/index.html`
Expected: build OK; `grep` ≥ 1 (enlace del menú presente).

- [ ] **Step 3: Commit**

```bash
git add src/config/menu.json
git commit -m "feat(calendar): add Calendario link to Recursos menu"
```

---

## Task 7: Embeber EventCard en un post del blog (MDX)

**Files:**
- Modify (rename): `src/content/blog/como-entrar-universidad-publica-costa-rica.md` → `.mdx`

**Interfaces:**
- Consumes: `<EventCard>` de `@/components/EventCard.astro`.
- Produces: post con tarjeta de evento embebida a mitad del texto.

- [ ] **Step 1: Renombrar el post a `.mdx`**

```bash
git mv src/content/blog/como-entrar-universidad-publica-costa-rica.md src/content/blog/como-entrar-universidad-publica-costa-rica.mdx
```

- [ ] **Step 2: Importar el componente tras el frontmatter**

Abrir el `.mdx`. Justo debajo del cierre del frontmatter (`---`), añadir el import:

```mdx
import EventCard from "@/components/EventCard.astro";
```

- [ ] **Step 3: Insertar la tarjeta a mitad del post**

Localizar la sección del post que habla de fechas de inscripción/examen (cerca de la línea que menciona "Verificá siempre las fechas en los calendarios oficiales"). Insertar en un punto relevante del cuerpo:

```mdx
<EventCard eventId="sau-inscripcion-2026" />
```

(Si el post trata más del examen PAA en ese punto, usar `eventId="paa-2026"` en su lugar. Elegir el evento cuyo tema coincide con el párrafo.)

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: build OK; el post `.mdx` se genera sin errores de MDX.

- [ ] **Step 5: Verificar la tarjeta en el HTML del post**

Run: `grep -rl "Ver en el calendario" dist/blog/`
Expected: al menos el archivo del post renombrado aparece en el resultado.

- [ ] **Step 6: Commit**

```bash
git add src/content/blog/como-entrar-universidad-publica-costa-rica.mdx
git commit -m "feat(calendar): embed EventCard in admission-guide blog post"
```

---

## Verificación final (todo el feature)

- [ ] `pnpm check` — sin errores nuevos.
- [ ] `pnpm build` — OK; existen `dist/calendario*`, widget en `dist/index.html`, tarjeta en el post.
- [ ] Navegador (`pnpm preview`): `/calendario` con timeline+filtros funcionando; widget del index con 3 próximos correctos y enlace a `/calendario`; enlace "Calendario" en el menú; post con `<EventCard>` renderizado a mitad de texto.
- [ ] Estado (pasado/próximo) correcto contra la fecha real del visitante.

---

## Notas / fuera de alcance

- Categorías `resultados` y `matricula` existen en el modelo pero aún sin datos; se agregan al array cuando se investiguen (sin cambios de código). Igual para UNED/UTN.
- No se agrega framework de tests, exportar a iCal/Google Calendar, ni cuenta regresiva animada (YAGNI).
