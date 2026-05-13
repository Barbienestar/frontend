# Skill: Agregar código nuevo al proyecto

Cuando el usuario pida agregar un componente, sección o feature, sigue estos pasos **en orden y de uno en uno**. No avances al siguiente sin confirmación explícita.

---

## Antes de escribir cualquier código

1. **Lee el scope asignado.** Pregunta al usuario exactamente qué parte le toca implementar en este PR/rama. Si no está claro, pregunta antes de tocar cualquier archivo.

2. **Verifica qué ya existe.** Busca en `src/components/` si ya hay un componente similar. Revisa `App.tsx` y los archivos relacionados. No reimplementes algo que ya está.

3. **No implementes lo que no te toca.** Si la tarea menciona partes que pertenecen a otro compañero (ej: "Carga de Datos", "Medicamentos Críticos", "KPIs"), déjalas fuera. Comunícalo al usuario antes de continuar.

---

## Convenciones del proyecto

- **Stack:** React 19 + TypeScript + Vite + Tailwind v4 + shadcn/ui pattern
- **Estructura de componentes:**
  ```
  src/components/<NombreComponente>/
    <nombre>.tsx          ← componente
    <nombre>.stories.tsx  ← Storybook (obligatorio)
  src/pages/<NombrePage>.tsx  ← páginas/rutas
  ```
- **Rutas:** react-router-dom, definidas en `src/App.tsx`.
- **Estilos:** solo Tailwind v4 con `cn()` de `src/lib/utils.ts`. Sin CSS inline salvo casos excepcionales (ej: altura de mapas).
- **Variantes:** usa `cva` (class-variance-authority) si el componente tiene más de un estilo posible.
- **Tipos:** exporta las interfaces TypeScript desde el mismo archivo del componente.
- **Imports:** usa alias `@/` (ej: `import { cn } from "@/lib/utils"`).

---

## Pasos para agregar un componente nuevo

**Paso 1 — Solo el componente base**
Crea `src/components/<Nombre>/<nombre>.tsx` con la estructura mínima que pide el usuario. Sin lógica extra, sin props que no se usen.

**Paso 2 — Confirma con el usuario** antes de continuar.

**Paso 3 — Storybook**
Crea `src/components/<Nombre>/<nombre>.stories.tsx` con al menos una story por variante.

**Paso 4 — Integración en App.tsx u otra página**
Solo si el usuario lo pide explícitamente para este PR.

---

## Lo que NO hacer

- No agregues features que el usuario no mencionó en este paso.
- No refactorices código existente que no está en scope.
- No crees archivos de documentación (README, etc.) salvo que se pidan.
- No instales dependencias sin preguntar primero.
- No hagas todo de golpe: un paso a la vez, siempre confirma antes de avanzar.

---

## Secciones ya implementadas (no tocar sin autorización)

| Componente | Archivo | Estado |
|---|---|---|
| Button | `src/components/Button/button.tsx` | Completo + Storybook |
| Map (heatmap + normal) | `src/components/Map/map.tsx` | Completo + Storybook |
| StatCard (progress + number) | `src/components/StatCard/stat-card.tsx` | Completo + Storybook |
| MapaPage (título + stats + mapa) | `src/pages/MapaPage.tsx` | Implementado en ruta `/mapa` |

Las secciones **NO asignadas a este branch** (no tocar):
- Panel derecho: "Carga de Datos Oficiales" → `src/components/FileUpload/`
- Panel derecho: "Medicamentos Críticos" → pendiente otro compañero
- "Discrepancia de Reportes" → pendiente otro compañero
- "Datos Históricos" → pendiente otro compañero
