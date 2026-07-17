# Calendario de fechas importantes — Design Spec

**Fecha:** 2026-07-17
**Proyecto:** Ubot NewLanding (sitio Astro)
**Objetivo:** Recopilar todas las fechas clave de admisión universitaria de Costa Rica (UCR/UNA/TEC) en un calendario con página propia, un widget en el index, y tarjetas de evento embebidas en posts del blog relevantes.

## Contexto

Sitio de marketing en Astro dirigido a estudiantes de secundaria en Costa Rica que preparan exámenes de admisión. Ya existen colecciones de contenido (blog, changelog) y 6 posts de blog nuevos (Jul 16, 2026) sobre admisión, becas, PAA y vida universitaria. La investigación de fechas ya se hizo y vive en claude-mem (obs 61, 62, 64, 65, 67).

MDX ya está integrado (`@astrojs/mdx` en `astro.config.mjs`). Posts del blog son `.md` renderizados vía `src/layouts/PostSingle.astro` con `<Content />`.

## Decisiones tomadas (brainstorming)

- **Almacenamiento:** archivo de datos único tipado (`src/config/calendar.ts`), no content collection. Datos estructurados, cortos, pocos, cambian en bloque una vez por ciclo.
- **Categorías (6):** `inscripcion`, `examen`, `beca`, `feria`, `resultados`, `matricula`.
- **Widget del index:** próximos 3 eventos futuros + botón "Ver calendario completo".
- **Filtros de la página:** dos ejes — universidad (Todas/UCR/UNA/TEC) + categoría.
- **Blog → calendario:** componente `<EventCard>` MDX embebido a mitad del post relevante, mostrando el/los evento(s) relacionado(s) a ese post. Posts que lo usen pasan a `.mdx`.
- **Estado de evento (pasado/actual/próximo):** calculado en runtime en el cliente contra `new Date()`, no en build → siempre fresco.

## Arquitectura

Única fuente de verdad: `src/config/calendar.ts`. Tres consumidores independientes:

```
src/config/calendar.ts  (datos + helpers)
        │
        ├── src/pages/calendario.astro       (página completa: timeline + filtros)
        ├── src/components/CalendarWidget.astro  (widget index: próximos 3)
        └── src/components/EventCard.astro    (tarjeta 1 evento, usada en posts .mdx)
```

### 1. Datos — `src/config/calendar.ts`

```ts
export type EventCategory =
  | 'inscripcion' | 'examen' | 'beca' | 'feria' | 'resultados' | 'matricula';
export type University = 'UCR' | 'UNA' | 'TEC';

export interface CalendarEvent {
  id: string;                 // 'paa-2026'
  title: string;
  start: string;              // ISO 'YYYY-MM-DD'
  end?: string;               // opcional, para rangos
  universities: University[];
  category: EventCategory;
  description?: string;
  link?: string;              // fuente oficial
}

export const calendarEvents: CalendarEvent[] = [ /* ... */ ];

// Helpers puros (usados por página, widget, card):
export function getEventById(id: string): CalendarEvent | undefined;
export function sortByStart(events: CalendarEvent[]): CalendarEvent[];
export function getUpcoming(events: CalendarEvent[], n: number, now?: Date): CalendarEvent[];
```

**Estado en runtime (cliente):** una función que, dado `event` y `now`, devuelve `'past' | 'current' | 'next' | 'future'`:
- `past` — `end` (o `start`) < hoy
- `current` — hoy dentro de `[start, end]`
- `next` — el evento futuro más próximo (primero tras hoy)
- `future` — resto de futuros

El servidor renderiza todos los eventos; un script inline (`is:inline`) recalcula clases/badges de estado al cargar la página según la fecha real del visitante.

### 2. Datos iniciales (de la investigación en memoria)

| id | title | start | end | universities | category | link |
|---|---|---|---|---|---|---|
| `sau-inscripcion-2026` | Inscripción SAU (₡7.000 c/u) | 2026-02-16 | 2026-03-20 | UCR,UNA,TEC | inscripcion | https://www.admision.ac.cr |
| `beca-ucr-solicitud-2026` | Solicitud de beca socioeconómica UCR | 2025-12-18 | 2026-01-07 | UCR | beca | https://becas.ucr.ac.cr |
| `feria-tec-2026` | Feria Vocacional TEC (Cartago) | 2026-04-16 | 2026-04-17 | TEC | feria | https://www.tec.ac.cr/feria-vocacional |
| `feria-ucr-2026` | Feria Vocacional UCR (San Pedro) | 2026-08-05 | 2026-08-07 | UCR | feria | https://www.orientacion.ucr.ac.cr |
| `examen-tec-1-2026` | Examen de admisión TEC (1ª convocatoria) | 2026-08-08 | | TEC | examen | https://www.tec.ac.cr/examen-admision |
| `examen-tec-2-2026` | Examen de admisión TEC (2ª convocatoria) | 2026-08-22 | | TEC | examen | https://www.tec.ac.cr/examen-admision |
| `examen-tec-3-2026` | Examen de admisión TEC (3ª convocatoria) | 2026-08-29 | | TEC | examen | https://www.tec.ac.cr/examen-admision |
| `examen-tec-4-2026` | Examen de admisión TEC (4ª convocatoria) | 2026-09-20 | | TEC | examen | https://www.tec.ac.cr/examen-admision |
| `paa-2026` | Examen PAA (UCR/UNA) | 2026-10-03 | 2026-10-04 | UCR,UNA | examen | https://www.admision.ac.cr |

`description` de cada uno se redacta corto en implementación. Nota: al 2026-07-17, inscripción SAU, beca UCR y feria TEC ya son `past`; feria UCR es el `next`.

### 3. Página — `src/pages/calendario.astro`

- Layout `Base.astro`, patrón visual de `changelog.astro`/blog.
- Header: título + intro corta ("Todas las fechas de admisión 2026 en un solo lugar").
- **Filtros (2 filas de botones):**
  - Universidad: `Todas | UCR | UNA | TEC`
  - Categoría: `Todas | Inscripción | Examen | Beca | Feria | Resultados | Matrícula`
  - Filtrado client-side con `data-*` attributes + JS vanilla (sin framework). AND entre ejes.
- **Timeline vertical agrupado por mes.** Cada evento = tarjeta con: fecha/rango, badge(s) de universidad, badge de categoría (color), título, descripción, enlace a fuente oficial, e indicador de estado (pasado atenuado / actual resaltado / próximo con acento).
- **Empty states:** sin resultados para el filtro activo → mensaje "No hay eventos con esos filtros".
- Colores de estado: `past` atenuado (opacidad/gris), `current` borde/acento primario + etiqueta "En curso", `next` acento + etiqueta "Próximo". Colores por categoría vía clases Tailwind (mapa categoría→color).

### 4. Widget del index — `src/components/CalendarWidget.astro`

- Muestra próximos 3 eventos (`getUpcoming(3)` recalculado en cliente).
- Cada fila: fecha compacta + título + badge universidad.
- Botón "Ver calendario completo" → `/calendario`.
- Se inserta como sección en `src/pages/index.astro` (ubicación: tras las secciones existentes de contenido, antes del CTA/footer — punto exacto se decide en implementación siguiendo el orden actual del index).
- Si no hay futuros (temporada cerrada) → estado vacío "Pronto se publicarán las fechas del próximo ciclo".

### 5. EventCard del blog — `src/components/EventCard.astro`

- Props: `eventId: string` (o `eventIds: string[]` para varios).
- Lee `getEventById` de `calendar.ts`.
- Renderiza tarjeta compacta destacada: título, fecha/rango, badge universidad + categoría, mini enlace "Ver en el calendario →" (`/calendario#<id>` o `#<categoria>`).
- Se importa en posts `.mdx` y se coloca a mitad del texto donde sea relevante.
- **Migración de posts:** los posts del blog relevantes (p.ej. guía de admisión, prep PAA, becas, recursos) pasan de `.md` a `.mdx` para poder importar el componente. Posts sin evento relacionado quedan `.md`. El glob de la colección ya incluye `.mdx`, y `[single].astro` no requiere cambios.

### 6. Navegación — `src/config/menu.json`

Agregar bajo "Recursos": `{ "name": "Calendario", "url": "/calendario" }` (junto a Blog y Registro de cambios). Opcional: también en `footer_company`.

## Aislamiento / responsabilidades

- `calendar.ts` — datos + helpers puros, sin UI. Testeable aislado.
- `EventCard.astro` — presenta 1 evento; depende solo de `getEventById`.
- `CalendarWidget.astro` — presenta próximos N; depende de `getUpcoming`.
- `calendario.astro` — página + filtros; depende de la lista + helpers.
- Lógica de estado (past/current/next) centralizada en una función reutilizada por los tres.

## Verificación

- `pnpm build` sin errores.
- `/calendario` renderiza timeline agrupado por mes con los 9 eventos.
- Filtros por universidad y categoría funcionan (client-side, AND).
- Widget del index muestra 3 próximos correctos y enlaza a `/calendario`.
- Un post `.mdx` de prueba renderiza `<EventCard>` con datos correctos.
- Estado (pasado/próximo) correcto contra fecha simulada.
- Enlace "Calendario" aparece en el menú.

## Fuera de alcance (YAGNI)

- CMS/edición no-código de eventos (se editan en el `.ts`).
- Suscripción/exportar a Google Calendar / iCal.
- Cuenta regresiva animada (el widget elegido es lista, no hero).
- Datos de UNED/UTN y fechas de resultados/matrícula (categorías existen en el modelo pero sin datos aún; se agregan cuando se investiguen).
