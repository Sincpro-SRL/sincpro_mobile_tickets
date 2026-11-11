import * as Sentry from "@sentry/react-native";
import type { ErrorReporter } from "@sincpro/client-framework";
import { sentryReporter } from "@sincpro/client-framework/sentry";
import Constants from "expo-constants";

/**
 * Where an unexpected failure of a use case is reported: GlitchTip, which speaks Sentry's
 * protocol. The app initializes the client; the framework only wraps it (`sentryReporter`).
 * What the phone answers — a printer off, none chosen, Bluetooth denied — ends `refused` and is
 * never reported.
 *
 *   EXPO_PUBLIC_SENTRY_DSN   the GlitchTip project's DSN
 *   EXPO_PUBLIC_APP_ENV      `production`, `preview`, `development`: the report's environment
 *
 * Context: Expo writes an `EXPO_PUBLIC_` variable into the bundle when it is read literally —
 * never destructured —, so its value comes from EAS or `.env.local`, never from the repository.
 * Only errors: traces go to OTLP (`ticketsTelemetry`) and no session is tracked. Without a DSN
 * nothing is reported.
 */
export function ticketsReporter(): ErrorReporter | undefined {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return undefined;
  Sentry.init({
    dsn,
    environment: process.env.EXPO_PUBLIC_APP_ENV || (__DEV__ ? "development" : "production"),
    release: Constants.expoConfig?.version,
    tracesSampleRate: 0,
    enableAutoSessionTracking: false,
  });
  return sentryReporter(Sentry);
}
