import type { TelemetryConfig } from "@sincpro/mobile";
import { appIdentity } from "@sincpro/mobile-tickets/infrastructure/app_identity";
import { Platform } from "react-native";

/**
 * Where the app's traces go, read from its environment — never written in the repository:
 *
 *   EXPO_PUBLIC_OTLP_ENDPOINT   the collector's base URL (`https://otlp.sincpro.dev`); the app
 *                               adds `/v1/traces`
 *   EXPO_PUBLIC_OTLP_API_KEY    its ingest key, sent as the `apikey` header
 *   EXPO_PUBLIC_APP_ENV         `production`, `preview`, `development`: the traces'
 *                               `deployment.environment`
 *
 * Every span carries who sent it (`appIdentity`), with sincpro_framework's keys: `service.name`
 * is the app's slug, `service.version` its version, `release` the same text GlitchTip shows
 * (`sincpro-mobile-tickets:0.2.0`); `app.id`, `app.build`, `os.type` and `os.version` say which
 * build on which phone.
 *
 * Context: the values come from `.env` (the deploy's) or `.env.development`, or from EAS. Expo
 * writes an `EXPO_PUBLIC_` variable into the bundle when it is read literally — never
 * destructured —, so the key travels inside the app: it is an ingest-only key, one per
 * environment, that can be rotated. Without an endpoint and a key, telemetry stays off.
 */
export function ticketsTelemetry(): TelemetryConfig | undefined {
  const endpoint = process.env.EXPO_PUBLIC_OTLP_ENDPOINT;
  const apiKey = process.env.EXPO_PUBLIC_OTLP_API_KEY;
  if (!endpoint || !apiKey) return undefined;
  const app = appIdentity();
  return {
    serviceName: app.name,
    serviceVersion: app.version,
    deploymentEnvironment: app.environment,
    resourceAttributes: {
      release: app.release,
      "app.id": app.id,
      "app.build": app.build,
      "os.type": Platform.OS,
      "os.version": String(Platform.Version),
    },
    otlp: { endpoint, headers: { apikey: apiKey } },
  };
}
