# Sincpro Mobile Tickets

The Tickets app, on `@sincpro/mobile`, `@sincpro/mobile-odoo` and `@sincpro/client-framework`. The
stack's rules are in [AGENTS.md](AGENTS.md).

## Configuration by environment

Values that change by environment (the trace collector and its key, GlitchTip's DSN) never go to
the repository. The repository names the variables (`.env.example`); each machine keeps them in
files git ignores:

| File               | Whose                     | Who reads it                                                                   |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------ |
| `.env`             | The deploy's (production) | `eas build` (uploaded through `.easignore`) and `eas update` (on this machine) |
| `.env.development` | The developer's           | `expo start`, `make android` / `make ios`: it wins over `.env`                 |

```bash
cp .env.example .env               # fill the production values
cp .env.example .env.development   # fill the development ones (EXPO_PUBLIC_APP_ENV=development)
```

| Variable                    | What it is                                                                                        | EAS visibility |
| --------------------------- | ------------------------------------------------------------------------------------------------- | -------------- |
| `EXPO_PUBLIC_OTLP_ENDPOINT` | The collector's base URL (`https://otlp.sincpro.dev`); the app adds `/v1/traces`                  | `plaintext`    |
| `EXPO_PUBLIC_LOKI_ENDPOINT` | Loki's base URL (`https://loki.sincpro.dev`); the app adds `/loki/api/v1/push`                    | `plaintext`    |
| `EXPO_PUBLIC_OTLP_API_KEY`  | The telemetry key OTLP and Loki accept (Kong's `telemetry-key-auth`), sent as the `apikey` header | `sensitive`    |
| `EXPO_PUBLIC_APP_ENV`       | `production`, `preview` or `development`: `deployment.environment` of the traces                  | `plaintext`    |
| `EXPO_PUBLIC_SENTRY_DSN`    | GlitchTip's DSN (Sentry protocol): where unexpected failures are reported                         | `sensitive`    |

The OTLP collector takes traces only: logs go to Loki, each line's stream labelled `app` and
`service_name` (both the app's slug, stable across versions), `env`, `version` and `level` — the
labels Grafana already filters by. Without an endpoint and a key, telemetry stays off; without a DSN, nothing is reported. Only
what is unexpected reaches GlitchTip: a printer off, none chosen or Bluetooth denied end
`refused` and are never reported. Source maps are not uploaded (the Sentry config plugin is not
used, so a build needs no Sentry token).

### Deploying

- **Build:** `make eas-build` (`eas build --profile production`). EAS uploads the project as
  `.easignore` says — the same as `.gitignore`, except `.env` —, so the build bundles the
  deploy's values.
- **Update (OTA):** `eas update --channel production`. The bundle is made on this machine, from
  `.env`.
- **Development:** `make start` or `make android`: `.env.development` over `.env`.

### Or in EAS, for a shared machine or CI

The same variables can live in EAS instead; a variable created there wins over the files, and
each build profile says which environment it loads (`environment` in `eas.json`):

```bash
eas env:create --environment production --name EXPO_PUBLIC_OTLP_ENDPOINT --value https://otlp.sincpro.dev --visibility plaintext
eas env:create --environment production --name EXPO_PUBLIC_OTLP_API_KEY  --value <key> --visibility sensitive
eas env:create --environment production --name EXPO_PUBLIC_APP_ENV       --value production --visibility plaintext
eas env:create --environment production --name EXPO_PUBLIC_SENTRY_DSN    --value <dsn> --visibility sensitive
```

An update then takes them with `eas update --channel production --environment production`, and
`eas env:pull --environment development` writes them to `.env.local`.

### Checking that it works

```bash
make check-observability              # the values of .env (production)
make check-observability ENV=development
```

It prints the identity every trace and report carries — with sincpro_framework's keys:
`service.name` (the app's slug), `service.version`, `release` (`sincpro-mobile-tickets:0.2.0`,
the same text in GlitchTip and in the traces), `deployment.environment` — and sends one test
span to the OTLP collector, one test line to Loki and one test error to GlitchTip, over the same wire as the app. No
secret is printed; it fails when a value is missing or refused. On the phone each span and report
also carries the native build (`app.build`, GlitchTip's `dist`), `app.id`, `os.type` and
`os.version`.

### What this protects, and what it does not

An `EXPO_PUBLIC_` variable is written into the app's bundle: it stays out of the repository, but
it travels inside the APK. So the key is an ingest-only key, one per environment, that can be
rotated without a commit. The code reads each variable literally
(`process.env.EXPO_PUBLIC_OTLP_API_KEY`), never destructured, because Expo only replaces it that
way.
