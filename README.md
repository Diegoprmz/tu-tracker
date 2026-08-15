# TuTracker by Dipzon.Dev

PWA de seguimiento de objetivos y hábitos. Offline-first, instalable, con sincronización entre dispositivos.

**En vivo:** https://dipzon-tracker.vercel.app

## Qué hace

- **Hábitos personalizables por usuario** — cada quien define sus acciones diarias (título, emoji, XP 5–30).
- **Racha, XP y niveles** — gamificación para sostener la constancia.
- **Snapshots por día** — al editar tus hábitos, el historial pasado nunca cambia.
- **Fechas importantes** — cuenta regresiva a exámenes, carreras o competencias.
- **Medallas genéricas** por racha (7 / 15 / 30 / 60 / 90 días) y logros acumulados.
- **Botón "Día pesado"** — rompe la inercia y salva la racha.
- **Heatmap** de los últimos 14 días.

## Stack

- HTML/CSS/JS autocontenido (sin build) — `index.html`
- **Supabase** — auth (email + contraseña) + sincronización (`tracker_state`, jsonb por usuario, protegido con RLS)
- **PWA** — `manifest.webmanifest` + `sw.js` (service worker, cache offline-first)
- **Vercel** — hosting + CI/CD

## Marca

Identidad **Dipzon.Dev**: navy premium + acento oliva + plata, tipografía Playfair Display + Inter, estética liquid glass.

## Desarrollo

Es un sitio estático. Para previsualizar localmente basta abrir `index.html` con un servidor estático (el service worker requiere `http(s)://`, no `file://`).

Deploy: cada push a `main` publica vía Vercel. Los PR generan preview automático.

---

Hecho por **Ing. Diego Prmz** · Dipzon.Dev
