import * as Application from "expo-application";
import Constants from "expo-constants";

/** Who is running — the same in its traces (OTLP) and in its reports (GlitchTip). */
export type AppIdentity = {
  /** The app's slug (`sincpro-mobile-tickets`): the traces' `service.name`. */
  readonly name: string;
  /** Its store id (`bo.com.sincpro.tickets`). */
  readonly id: string;
  /** app.json's `version` the bundle carries: an update (OTA) brings its own. */
  readonly version: string;
  /** The native build EAS numbers on every build (versionCode, CFBundleVersion). */
  readonly build: string;
  /** `production`, `preview` or `development`. */
  readonly environment: string;
  /**
   * `<name>:<version>` — sincpro_framework's release (`APP_RELEASE`, else `artifact:version`):
   * the same text in GlitchTip's release and the traces' `release`. The build goes apart
   * (GlitchTip's `dist`, the traces' `app.build`).
   */
  readonly release: string;
};

/**
 * Reads who is running from the app itself — its config (`expo-constants`) and its native
 * binary (`expo-application`) —, never from a value written by hand.
 * 1. The version is the bundle's, so an update shows its own; the build is the binary's.
 * Final: the environment is `EXPO_PUBLIC_APP_ENV`, else development in a debug build and
 *    production in a release one.
 */
export function appIdentity(): AppIdentity {
  const name = Constants.expoConfig?.slug ?? "sincpro-mobile-tickets";
  const id = Application.applicationId ?? name;
  const version =
    Constants.expoConfig?.version ?? Application.nativeApplicationVersion ?? "0.0.0";
  const build = Application.nativeBuildVersion ?? "0";
  return {
    name,
    id,
    version,
    build,
    environment: process.env.EXPO_PUBLIC_APP_ENV || (__DEV__ ? "development" : "production"),
    release: `${name}:${version}`,
  };
}
