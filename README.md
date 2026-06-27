# sincpro-mobile-tickets

App móvil de **Tickets** (React Native / Expo). Es una **app host** del framework Sincpro Mobile: compone `@sincpro/mobile` (core) + `@sincpro/mobile-odoo` (integración Odoo) + `@sincpro/mobile-ui` (design system) y registra su propio dominio.

> 🤖 **Agentes de IA:** leé [`AGENTS.md`](AGENTS.md) (orientación del ecosistema, patrones) y [`docs/GOTCHAS.md`](docs/GOTCHAS.md) (trampas conocidas).

## Características

- Consume los 3 paquetes del framework **desde el registry** (`dependencies` + `resolutions`); una sola copia de cada (peerDependencies).
- **Con impresora térmica**: registra `PrinterAdapter` (`@sincpro/printer-expo`) vía `printerService.setDriver(...)`.
- Tema propio **celeste** (`#0EA5E9`), assets en `assets/TICKETS/`.
- Composición en `sincpro_mobile_tickets/entrypoints/main.tsx` (`TicketsModule` + `createTicketsApp`).

## Correr

```bash
make init          # instala dependencias + pre-commit
make start         # Expo dev server
make android       # build nativo Android
make prebuild      # regenera android/ios desde app.json (icono/splash)
```

## Calidad

```bash
make format         # auto-fix: eslint --fix + prettier + typecheck
make verify-format  # gate de CI: format + falla si quedó algo (cubre lint + formato + tipos)
```
