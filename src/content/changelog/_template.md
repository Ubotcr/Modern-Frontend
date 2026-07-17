---
title: "Plantilla de changelog"
draft: false
---

# Cómo agregar una entrada al changelog

Las entradas del changelog **no** son archivos individuales: se agregan al arreglo
`changelog_list` dentro de `src/content/changelog/-index.md`.

Copia el bloque siguiente y pégalo al inicio de `changelog_list`:

    - version: "1.1.0"
      date: "2025-01"
      title: "Título corto del cambio"
      description: "Descripción de las novedades, mejoras o correcciones."

## Campos

- **version**: número de versión (texto, ej: `"1.1.0"`).
- **date**: fecha en texto libre, ej: `"2025-01"` o `"Enero 2025"`.
- **title**: título corto del cambio.
- **description**: resumen de las novedades.

> Este archivo es solo una referencia y no se renderiza en el sitio.
