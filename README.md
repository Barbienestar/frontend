# Decision 360

Plataforma de monitoreo y reporte de desabasto de medicamentos en México.

**Ciudadanos**: buscan disponibilidad de medicamentos por hospital en un mapa interactivo, reportan faltantes (con foto) y dan seguimiento a sus reportes.

**Personal de salud**: dashboard con KPIs, mapa coroplético por estado, tendencias, carga masiva de stocks, y gestión de medicamentos críticos.

**Administradores**: moderan reportes (aceptar/rechazar), crean cuentas de usuario, acceden a panel centralizado.

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind v4 · shadcn/ui · React Router v7 · Firebase Auth · Leaflet · Recharts · Formik + Yup · Sonner

## Prerrequisitos

- **Node.js** >= 22
- **Yarn** >= 1.22
- **Firebase project** con Authentication (email/password + Google)
- **Google Maps API key** con Maps JavaScript API habilitado

## Configurar entorno

Copia el archivo de ejemplo y completa las variables:

```bash
cp .env.example .env
```

Las variables requeridas en `.env`:

| Variable                    | Descripción                                      |
| --------------------------- | ------------------------------------------------ |
| `VITE_FIREBASE_API_KEY`     | Firebase API Key                                 |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain                             |
| `VITE_FIREBASE_PROJECT_ID`  | Firebase Project ID                              |
| `VITE_FIREBASE_APP_ID`      | Firebase App ID                                  |
| `VITE_API_URL`              | URL del backend (local: `http://localhost:8080`) |
| `VITE_GOOGLE_MAPS_API_KEY`  | Google Maps API Key                              |

> ⚠️ `.env` tiene valores locales de desarrollo. **No** está versionado (`.gitignore` lo excluye). Cada developer configura el suyo.

## Correr en desarrollo

```bash
yarn install
yarn dev
```

Abre `http://localhost:5173`.

## Comandos útiles

| Comando          | Acción                                     |
| ---------------- | ------------------------------------------ |
| `yarn dev`       | Dev server con HMR                         |
| `yarn build`     | `tsc -b && vite build` (typecheck + build) |
| `yarn lint`      | ESLint sobre todo el proyecto              |
| `yarn format`    | Prettier — escribe formato                 |
| `yarn storybook` | Storybook en `http://localhost:6006`       |
| `yarn preview`   | Preview del build de producción            |

Build en prod corre typecheck antes que vite build. Errores de tipo bloquean el build.

Pruebas de componentes via Storybook + Vitest + Playwright — no hay script `yarn test`.

## Husky pre-commit

Cada commit ejecuta `yarn format && yarn lint && yarn build`.

## Despliegue

Cloud Build → Docker (multi-stage: `node:22-alpine` build, `nginx:1.27-alpine` serve) → Cloud Run. Ver `cloudbuild.yaml`.
