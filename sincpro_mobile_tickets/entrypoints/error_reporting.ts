import * as Sentry from "@sentry/react-native";
import type { ErrorReporter } from "@sincpro/client-framework";
import { sentryReporter } from "@sincpro/client-framework/sentry";
import { appIdentity } from "@sincpro/mobile-tickets/infrastructure/app_identity";

/**
 * Where an unexpected failure of a use case is reported: GlitchTip, which speaks Sentry's
 * protocol. The app initializes the client; the framework only wraps it (`sentryReporter`).
 * What the phone answers — a printer off, none chosen, Bluetooth denied — ends `refused` and is
 * never reported.
 *
 *   EXPO_PUBLIC_SENTRY_DSN   the GlitchTip project's DSN
 *   EXPO_PUBLIC_APP_ENV      `production`, `preview`, `development`: the report's environment
 *
 * A report says which build failed (`appIdentity`), with sincpro_framework's keys: its release
 * is `<name>:<version>` (`sincpro-mobile-tickets:0.2.0`), its `dist` the native build, and its
 * tags `release`, `service_name` and `service_version` — the same text as its traces.
 *
 * Context: Expo writes an `EXPO_PUBLIC_` variable into the bundle when it is read literally —
 * never destructured —, so its value comes from `.env` / `.env.development` or EAS, never from the repository.
 * Only errors: traces go to OTLP (`ticketsTelemetry`) and no session is tracked. Without a DSN
 * nothing is reported.
 */
export function ticketsReporter(): ErrorReporter | undefined {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return undefined;
  const app = appIdentity();
  Sentry.init({
    dsn,
    environment: app.environment,
    release: app.release,
    dist: app.build,
    initialScope: {
      tags: { release: app.release, service_name: app.name, service_version: app.version },
    },
    tracesSampleRate: 0,
    enableAutoSessionTracking: false,
  });
  return sentryReporter(Sentry);
}
