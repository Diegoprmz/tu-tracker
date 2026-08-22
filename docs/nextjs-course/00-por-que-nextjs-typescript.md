# Lección 0 — Por qué Next.js, por qué TypeScript

*Tipo: referencia (conceptual, sin código portado todavía)*

## El problema real, en tu propio código

`index.html` tiene tres tríos casi idénticos de funciones:

- `openHabitEditor` → `renderHabitEditor` → `saveHabitEditor` (líneas 1148–1172)
- `openRoutineEditor` → `renderRoutineEditor` → `saveRoutine` (líneas 1173–1193)
- `openGoalEditor` → `renderGoalEditor` → `saveGoals` (líneas 1194–1215)

Mismo patrón: clonar a un array de trabajo → sembrar una fila vacía por defecto → dibujar la lista armando `innerHTML` a mano → filtrar/recortar y guardar. La única diferencia entre los tres son los campos de cada fila. Este patrón se repetiría 6 veces más con las primitivas nuevas (checklist, contador, métricas, tarea con fecha, registro, nota) si seguimos así.

## Componente = describir el resultado, no los pasos

Hoy: `DB` es un objeto global mutable. Cada click hace *mutar → `persist()` → `renderAll()`* (o un puñado de `renderX()` sueltos) — y toca acordarse a mano de qué repintar. Fuente de bugs reales que ya tuvimos esta sesión (una pieza de UI que se nos olvidó refrescar).

React: un componente es una función que devuelve *"así se ve la UI dado este estado"*. Cambias el estado, React decide qué repintar. Los 3 tríos de arriba se vuelven **un solo componente reusable** (ej. `<EditableList>`), parametrizado por qué campos tiene cada fila.

## TypeScript — el riesgo concreto que evita

`MEDALS` (línea ~685) tiene pruebas como `a=>a.best>=7` sobre el objeto que devuelve `agg()`. En JS puro, renombrar un campo en `agg()` sin actualizar una prueba de `MEDALS` no truena — la insignia deja de desbloquearse en silencio. Con TypeScript, el archivo se marca en rojo antes de guardar.

Para hábitos, ese bug es molesto. Para un webhook de Stripe o una respuesta de la API de Claude con la forma equivocada, cuesta dinero o revienta frente a un usuario pagando. TypeScript es la red que hace falta antes de meter dinero real a la app.

## Next.js encima de React

- **Rutas por carpetas** (`app/modulos/estudiante/page.tsx`) en vez de otro `<div class="card">` — mapea directo al plan de pestañas Hoy/Módulos/Métricas/Perfil.
- **Build pipeline** (`npm run build`) — Vercel (donde ya se despliega) es del mismo equipo que Next.js, el deploy se siente casi igual de simple.
- **API routes** — lugar en servidor para lógica de backend (ej. webhook de Stripe), como complemento o alternativa a las Edge Functions de Supabase.

## Qué NO cambia

- Supabase entero (tablas, RLS, Auth, Edge Functions, cron) — cero cambios.
- La lógica de negocio (`dayXP`, `computeStreak`, `mergeDB`, `agg`) — se traslada casi textual, solo se le agregan tipos.
- El diseño visual — intacto en el puerto 1:1; el rediseño es una fase aparte, después.

## Siguiente

Lección 1: crear el proyecto con `create-next-app`, ver la carpeta que genera, y ubicar ahí el CSS/manifest/iconos actuales.
