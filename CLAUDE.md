# FoodMesh Frontend

App web (mobile-first) del hogar de FoodMesh: factura → OCR → validar → despensa → recetas.
Prototipo académico (Fase 0, curso TDSE). Backend: `foodmesh-backend` (FastAPI), ya funcionando.

## Referencias obligatorias (léelas antes de cada feature)
- `docs/backend-avisos.md`: contrato del API, formas de datos, errores y qué mostrar en cada caso. Es la fuente de verdad: si algo de este archivo choca con él, manda él.
- `docs/mockups/*.dc.html`: mockups aprobados (Despensa, Validar, Recetas). Son HTML con estilos inline: úsalos para medidas, colores, tipografía y jerarquía. Ignora `<x-dc>`, `<helmet>`, `support.js` y el bloque `data-dc-script`: son del editor de mockups, no se copian.

## Stack
- React 18 + TypeScript (strict) + Vite
- React Router (data router: `createBrowserRouter`)
- TanStack Query para TODO acceso al backend (nada de `useEffect` + `fetch`)
- Tailwind CSS v4 (tokens en `src/index.css` con `@theme`)
- Auth0: `@auth0/auth0-react`
- Tipos del API generados con `openapi-typescript` en `src/api/schema.d.ts` (script `npm run gen:api`). Nunca escribir a mano tipos que existan en el OpenAPI.
- Iconos: `lucide-react`, trazo 1.8, nunca emojis en la UI.
- Sin librerías de componentes (nada de MUI, shadcn, Chakra). Componentes propios y pocos.

## Estructura
```
src/
  api/        schema.d.ts (generado), client.ts (apiFetch), hooks por recurso (inventario.ts, facturas.ts, recetas.ts, preferencias.ts)
  auth/       AuthGate, useApiToken
  components/ piezas reutilizables (Button, Field, Select, Stepper, ExpiryBadge, Sheet, EmptyState, ErrorState…)
  features/   una carpeta por pantalla: despensa/, facturas/, recetas/, hogar/
  lib/        fechas.ts, dinero.ts, categorias.ts
  App.tsx, router.tsx, main.tsx, index.css
```

## Rutas
- `/` sin sesión: pantalla de bienvenida con "Entrar" (`loginWithRedirect`; Auth0 Universal Login cubre login y registro). Con sesión: redirige a `/despensa`.
- `/despensa`: inventario (pestañas Comida/Otros con `es_alimento`), crear/editar/borrar ítem en un bottom sheet.
- `/facturas`: historial + botón "Escanear factura". `/facturas/:id`: revisar y confirmar.
- `/recetas`: recetas sugeridas + feedback.
- `/hogar`: preferencias del hogar + datos del usuario (de `useAuth0().user`) + cerrar sesión.
- Todas menos `/` van dentro de un layout con barra inferior de 4 pestañas: Despensa, Facturas, Recetas, Hogar.

## API: reglas
- Una sola función `apiFetch` en `src/api/client.ts`: pone `Authorization: Bearer <token>` (de `getAccessTokenSilently`), usa `VITE_API_URL`, parsea JSON, maneja 204, y lanza un `ApiError { status, detail }`.
- `401` → `loginWithRedirect`. El resto de errores se muestran con el `detail` del backend, que ya viene en español y listo para el usuario.
- `POST /facturas` es `multipart/form-data`, campo `archivo`. NO poner `Content-Type` a mano.
- Nunca mandar `hogar_id`, `es_alimento`, `origen`, `revisar` ni precios al confirmar (ver avisos).
- `PUT /preferencias` reemplaza todo: mandar siempre el objeto completo.
- Invalidar queries al mutar: crear/editar/borrar ítem y confirmar factura invalidan `inventario` y `recetas`; guardar preferencias invalida `preferencias` y `recetas`.
- Si falta un endpoint o un campo, NO inventar lógica en el front: dejar un `// TODO(back):` y avisar.

## Variables de entorno (`.env.local`, nunca se sube)
```
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=https://api.foodmesh
VITE_API_URL=http://localhost:8000
```
Mantener `.env.example` actualizado (sin valores secretos).

## Diseño: dirección aprobada
Inspirado en la factura impresa y la despensa. Sobrio, funcional, nada de "plantilla de IA".

**Prohibido:** degradados, glassmorphism, sombras difusas grandes, emojis, bordes de color a la izquierda en tarjetas genéricas, `rounded-2xl` + sombra en todo, morado/índigo, Inter.

**Tipografía** (Google Fonts):
- `IBM Plex Sans` (400/500/600/700) para todo el texto.
- `IBM Plex Mono` (400/500/600) para números: cantidades, precios, fechas, días para vencer, totales, contadores.
- Etiquetas de sección: 13px, 600, MAYÚSCULAS, `tracking-[0.06em]`, color `muted`.
- H1 de pantalla: 32px/700, `tracking-tight`. Cuerpo 15px. Secundario 13–14px.

**Tokens de color** (definir en `@theme` con estos nombres):
| Token | Hex | Uso |
|---|---|---|
| paper | #F6F3EC | fondo de la app |
| surface | #FFFDF8 | listas, tarjetas, barra inferior |
| sunken | #EFEBE1 | ítems no alimento, bloques apagados |
| ink | #1C1F1A | texto principal, botón secundario relleno |
| ink-2 | #3C4038 | texto secundario fuerte |
| muted | #5E6259 | texto secundario, etiquetas |
| line | #E2DCCD | bordes de contenedores |
| line-strong | #D6CFBF | bordes de inputs |
| divider | #EEE9DD | separadores entre filas |
| dashed-line | #9C9586 | bordes punteados (acciones "agregar"). No se llama `dashed`: chocaría con la utilidad `border-dashed` de Tailwind. Uso: `border-dashed border-dashed-line` |
| brand | #2F5D3A | ÚNICO acento: botón primario, links, pestaña activa |
| brand-strong | #1F4128 | hover/pressed del primario |
| urgent | #B23A1E | badge HOY / VENCIDO (texto blanco) |
| urgent-stripe | #C8472B | franja de vencimiento hoy/vencido |
| urgent-bg | #F5DCD3 | fondo de "Usa primero" en recetas |
| urgent-text | #6E2312 | texto sobre urgent-bg; encabezado "Úsalo primero" usa #9A3A1E |
| soon-stripe | #D99A1E | franja 1–3 días, borde de renglón a revisar |
| soon-bg | #F6E6BF | badge 1–3 días, avisos |
| soon-text | #7A4F00 | texto de badge; avisos usan #4A3300 |
| nodate-stripe | #C9C2B2 | sin fecha de vencimiento |

El color se reserva para significar algo (vencimiento, revisión, acción primaria). Todo lo demás es tinta sobre papel.

**Regla de vencimiento** (`src/lib/fechas.ts`, función única y testeable):
- días < 0 → "VENCIDO" (urgent) · 0 → "HOY" (urgent) · 1–3 → "1 DÍA"/"N DÍAS" (soon) · >3 → "9 días", "3 meses" en texto normal mono · `null` → franja gris + botón "+ Fecha".
- `fecha_vencimiento` llega como `YYYY-MM-DD`: parsearla como fecha LOCAL (no `new Date("2026-11-15")`, que la toma en UTC y en Bogotá resta un día). Comparar contra el día local de hoy.
- "Úsalo primero" = días ≤ 3 (incluye vencidos). Coincide con el umbral de `usa_proximos_a_vencer` del backend.

**Dinero** (`src/lib/dinero.ts`): `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })` → `$130.690`.

**Categorías** (`src/lib/categorias.ts`): la lista cerrada de los avisos con su etiqueta en pantalla. Siempre `<select>`, nunca texto libre.

**Componentes y patrones**
- Listas de inventario: una lista contenedora (`surface`, borde `line`, radio 12px) con filas separadas por `divider`; cada fila: franja de 4px a la izquierda, nombre 15/600, línea secundaria "Categoría · cantidad unidad" (cantidad en mono), badge o texto de días a la derecha. NO tarjetas sueltas.
- Revisar factura: encabezado tipo tiquete (mono, separador punteado, borde inferior dentado con SVG) con supermercado, fecha, total impreso vs detectado; aviso ámbar si `requiere_revision`; cada ítem es una tarjeta editable (nombre, categoría, vence, stepper de cantidad, quitar); renglones `revisar: true` con borde 2px `soon-stripe` y la etiqueta "Revisa cantidad × precio"; no alimentos colapsados en `sunken`; botón punteado "+ Agregar producto que falta"; pie fijo con "Confirmar N productos".
- Recetas: tarjeta con franja superior `urgent-bg` "Usa primero: X (hoy), Y (1 día)"; título 20/700; `por_que`; meta en mono MAYÚSCULAS ("20 MIN · 2 PORCIONES"); ingredientes con check verde si tienen `item_id`; bloque "Te falta"; pasos plegables; "¿Te sirvió?" con dos botones 44×44. Primera receta expandida, las demás compactas. Aviso de alergias SIEMPRE visible arriba.
- Botón primario: `brand`, texto `surface`, alto 52px, radio 12px. Secundario: borde `ink` o `line-strong`, fondo transparente. Acciones de agregar: borde punteado `dashed-line`.
- Estados de carga honestos: "Leyendo tu factura…" (el OCR tarda segundos, deshabilitar el botón), "Pensando recetas…". Skeletons sobrios, sin spinners de colores.
- Estados vacíos y de error con texto útil y la acción siguiente (ver tabla de errores en los avisos).

**Accesibilidad y layout**
- Objetivos táctiles ≥ 44px. `<button>`, `<a>`, `<label>` reales. `aria-label` en botones de solo ícono.
- Contraste ≥ 4.5:1 (los tokens ya cumplen; no aclarar los grises).
- Mobile-first. En pantallas anchas, la app es una columna centrada de máx. 480px sobre fondo `paper` (no estirar a escritorio).
- Subir factura: `<input type="file" accept="image/jpeg,image/png,image/webp" capture="environment">`. Comprimir en el front si pesa > 10 MB.

## Convenciones
- Textos de UI en español de Colombia, tuteo, frases cortas.
- Nombres de dominio en español como en el backend (`item`, `factura`, `receta`, `preferencias`); código en inglés solo para lo genérico (`Button`, `useApiToken`).
- Un componente por archivo; sin `any`; sin `// @ts-ignore`.
- Nada de lógica de negocio que ya hace el backend (filtrar alérgenos, calcular `es_alimento`, etc.).

## Antes de dar una tarea por terminada
1. `npm run lint`
2. `npm run typecheck` (`tsc --noEmit`)
3. `npm run build`
4. Revisar la pantalla en el navegador a 390px de ancho.

## Forma de trabajar
- Antes de cada feature, propón un plan corto y espera mi OK.
- No hagas commit ni push; yo reviso y subo.
- Al terminar, explica brevemente qué hiciste y en qué archivos.
- Si algo es ambiguo, pregunta antes de inventar.
