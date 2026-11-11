# Sincpro Mobile Tickets

The Tickets app, on `@sincpro/mobile`, `@sincpro/mobile-odoo` and `@sincpro/client-framework`. The
stack's rules are in [AGENTS.md](AGENTS.md).

## Configuration by environment

Values that change by environment (the trace collector and its key, GlitchTip's DSN) live in
EAS, never in the repository. The repository names the variables (`.env.example`) and says which environment each
build profile uses (`environment` in `eas.json`).

| Variable                    | What it is                                                                       | EAS visibility |
| --------------------------- | -------------------------------------------------------------------------------- | -------------- |
| `EXPO_PUBLIC_OTLP_ENDPOINT` | The collector's base URL (`https://otlp.sincpro.dev`); the app adds `/v1/traces` | `plaintext`    |
| `EXPO_PUBLIC_OTLP_API_KEY`  | The ingest key, sent as the `apikey` header                                      | `sensitive`    |
| `EXPO_PUBLIC_APP_ENV`       | `production`, `preview` or `development`: `deployment.environment` of the traces | `plaintext`    |
| `EXPO_PUBLIC_SENTRY_DSN`    | GlitchTip's DSN (Sentry protocol): where unexpected failures are reported        | `sensitive`    |

Without an endpoint and a key, telemetry stays off; without a DSN, nothing is reported. Only
what is unexpected reaches GlitchTip: a printer off, none chosen or Bluetooth denied end
`refused` and are never reported. Source maps are not uploaded (the Sentry config plugin is not
used, so a build needs no Sentry token).

### Creating them, once per environment

```bash
eas env:create --environment production --name EXPO_PUBLIC_OTLP_ENDPOINT --value https://otlp.sincpro.dev --visibility plaintext
eas env:create --environment production --name EXPO_PUBLIC_OTLP_API_KEY  --value <key> --visibility sensitive
eas env:create --environment production --name EXPO_PUBLIC_APP_ENV       --value production --visibility plaintext
eas env:create --environment production --name EXPO_PUBLIC_SENTRY_DSN    --value <dsn> --visibility sensitive
```

Then the same for `preview`, with its own key. `eas env:list --environment production` shows what
each environment has.

### Using them

- **Build:** `eas build --profile production` loads the `production` environment (`eas.json`).
- **Update (OTA):** `eas update --channel production --environment production`. Without
  `--environment`, the bundle takes whatever is in your `.env.local`, or nothing.
- **Development:** `eas env:pull --environment development` writes `.env.local`, which git ignores.
  `.env.example` lists the variables.

### What this protects, and what it does not

An `EXPO_PUBLIC_` variable is written into the app's bundle: it stays out of the repository, but
it travels inside the APK. So the key is an ingest-only key, one per environment, that can be
rotated without a commit. The code reads each variable literally
(`process.env.EXPO_PUBLIC_OTLP_API_KEY`), never destructured, because Expo only replaces it that
way.
