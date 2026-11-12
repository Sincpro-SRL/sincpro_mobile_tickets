import * as Sentry from "@sentry/react-native";
import type { ObservabilityConfig } from "@sincpro/mobile";

/**
 * The app's observability — what `defineAppShell({ observability })` instruments. Only the
 * values are the app's; @sincpro/mobile reads who is running from the app itself (its release
 * `<slug>:<version>`, its native build) and puts it on every span, log line and report.
 *
 *   EXPO_PUBLIC_APP_ENV         `production`, `preview` or `development`
 *   EXPO_PUBLIC_OTLP_ENDPOINT   traces — `https://otlp.sincpro.dev`
 *   EXPO_PUBLIC_LOKI_ENDPOINT   log lines — `https://loki.sincpro.dev`
 *   EXPO_PUBLIC_OTLP_API_KEY    the telemetry key both accept, sent as `apikey`
 *   EXPO_PUBLIC_LOG_LEVEL       `debug`, `info` (default) or `warn`: the console's and Loki's
 *   EXPO_PUBLIC_SENTRY_DSN      GlitchTip: unexpected failures only
 *
 * Context: the values come from `.env` (the deploy's), `.env.development` or EAS — never from
 * the repository. Expo writes an `EXPO_PUBLIC_` variable into the bundle only when it is read
 * literally, never destructured. Without an endpoint and the key nothing is shipped; without a
 * DSN nothing is reported.
 */
const apiKey = process.env.EXPO_PUBLIC_OTLP_API_KEY;
const otlpEndpoint = process.env.EXPO_PUBLIC_OTLP_ENDPOINT;
const lokiEndpoint = process.env.EXPO_PUBLIC_LOKI_ENDPOINT;
const level = process.env.EXPO_PUBLIC_LOG_LEVEL;
const headers = apiKey ? { apikey: apiKey } : undefined;

export const ticketsObservability: ObservabilityConfig = {
  ...(process.env.EXPO_PUBLIC_APP_ENV
    ? { environment: process.env.EXPO_PUBLIC_APP_ENV }
    : {}),
  ...(otlpEndpoint && headers ? { traces: { endpoint: otlpEndpoint, headers } } : {}),
  logs: {
    ...(lokiEndpoint && headers ? { endpoint: lokiEndpoint, headers } : {}),
    level: level === "debug" || level === "warn" ? level : "info",
  },
  errors: (app) => {
    const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
    if (!dsn) return undefined;
    Sentry.init({
      dsn,
      release: app.release,
      dist: app.build,
      environment: app.environment,
      // Only errors: traces go to OTLP, and no session is tracked.
      tracesSampleRate: 0,
      enableAutoSessionTracking: false,
      // No breadcrumbs from the console or the network: Sentry would wrap `console.*`, so every
      // line in Metro and LogBox would point at its wrapper (`log?.apply(GLOBAL_OBJ.console, …)`)
      // instead of who wrote it, and a line may carry an invoice or a customer to GlitchTip.
      integrations: [
        Sentry.breadcrumbsIntegration({ console: false, fetch: false, xhr: false }),
      ],
    });
    return Sentry;
  },
};
