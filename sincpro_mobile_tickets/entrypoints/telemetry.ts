import type { TelemetryConfig } from "@sincpro/mobile";
import Constants from "expo-constants";

/**
 * Where the app's traces go, read from its environment — never written in the repository:
 *
 *   EXPO_PUBLIC_OTLP_ENDPOINT   the collector's base URL (`https://otlp.sincpro.dev`); the app
 *                               adds `/v1/traces`
 *   EXPO_PUBLIC_OTLP_API_KEY    its ingest key, sent as the `apikey` header
 *   EXPO_PUBLIC_APP_ENV         `production`, `preview`, `development`: the traces'
 *                               `deployment.environment`
 *
 * Context: EAS sets them per environment (`eas env:create`, and the build profile's
 * `environment` in eas.json); `.env.local` sets them while developing (`eas env:pull`). Expo
 * writes an `EXPO_PUBLIC_` variable into the bundle when it is read literally — never
 * destructured —, so the key travels inside the app: it is an ingest-only key, one per
 * environment, that can be rotated. Without an endpoint and a key, telemetry stays off.
 */
export function ticketsTelemetry(): TelemetryConfig | undefined {
  const endpoint = process.env.EXPO_PUBLIC_OTLP_ENDPOINT;
  const apiKey = process.env.EXPO_PUBLIC_OTLP_API_KEY;
  if (!endpoint || !apiKey) return undefined;
  return {
    serviceName: "sincpro-mobile-tickets",
    serviceVersion: Constants.expoConfig?.version,
    deploymentEnvironment:
      process.env.EXPO_PUBLIC_APP_ENV || (__DEV__ ? "development" : "production"),
    otlp: { endpoint, headers: { apikey: apiKey } },
  };
}
