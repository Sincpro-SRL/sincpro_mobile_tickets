#!/usr/bin/env node
/**
 * Checks, from this machine, that the app's observability works with the values of an
 * environment — the same ones the app bundles:
 *   1. which identity a trace and a report carry (name, id, version, release, environment);
 *   2. the OTLP collector accepts a span over the same wire as the app (JSON, `apikey` header);
 *   3. Loki accepts a log line with the stream labels the app sends (`app`, `service_name`,
 *      `env`, `version`, `level`), over Loki's push API and the same key;
 *   4. GlitchTip accepts an error event over the Sentry protocol (DSN), with its release.
 *
 *   node scripts/check-observability.mjs [production|development]
 *
 * `production` reads `.env`; `development` reads `.env` and then `.env.development` over it, as
 * Expo does. No secret is printed. Exits 1 when something is missing or refused.
 */
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { hostname } from "node:os";

const environment = process.argv[2] ?? "production";
const files = environment === "development" ? [".env", ".env.development"] : [".env"];

/** KEY=VALUE lines, later files over earlier ones; comments and blanks skipped. */
function readEnv(paths) {
  const values = {};
  for (const path of paths.filter((file) => existsSync(file))) {
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (match && !line.trimStart().startsWith("#")) values[match[1]] = match[2];
    }
  }
  return values;
}

const env = readEnv(files);
const expo = JSON.parse(readFileSync("app.json", "utf8")).expo;
const hex = (bytes) => randomBytes(bytes).toString("hex");
const masked = (value) =>
  value ? `${value.slice(0, 4)}… (${value.length} chars)` : "MISSING";

// The identity the app builds at runtime (infrastructure/app_identity.ts), with
// sincpro_framework's keys. The native build is only known on the phone: here it is `check`.
const app = {
  name: expo.slug,
  id: expo.android?.package ?? expo.slug,
  version: expo.version,
  build: "check",
  environment: env.EXPO_PUBLIC_APP_ENV || environment,
};
app.release = `${app.name}:${app.version}`;

let failed = false;
const report = (ok, what, detail) => {
  if (!ok) failed = true;
  console.log(`${ok ? "✓" : "✘"} ${what}${detail ? ` — ${detail}` : ""}`);
};

console.log(`Environment: ${environment} (${files.join(" + ")})\n`);
console.log("Identity every trace and report carries:");
console.log(`  service.name            ${app.name}`);
console.log(`  service.version         ${app.version}`);
console.log(`  deployment.environment  ${app.environment}`);
console.log(
  `  release                 ${app.release}   (GlitchTip release, traces' release)`,
);
console.log(`  app.id                  ${app.id}`);
console.log(`  dist / app.build        <the native build, on the phone>`);
console.log("\nValues:");
console.log(`  EXPO_PUBLIC_OTLP_ENDPOINT  ${env.EXPO_PUBLIC_OTLP_ENDPOINT || "MISSING"}`);
console.log(`  EXPO_PUBLIC_LOKI_ENDPOINT  ${env.EXPO_PUBLIC_LOKI_ENDPOINT || "MISSING"}`);
console.log(`  EXPO_PUBLIC_OTLP_API_KEY   ${masked(env.EXPO_PUBLIC_OTLP_API_KEY)}`);
console.log(`  EXPO_PUBLIC_SENTRY_DSN     ${masked(env.EXPO_PUBLIC_SENTRY_DSN)}\n`);

async function checkOtlp() {
  const endpoint = env.EXPO_PUBLIC_OTLP_ENDPOINT;
  const apiKey = env.EXPO_PUBLIC_OTLP_API_KEY;
  if (!endpoint || !apiKey) return report(false, "OTLP", "endpoint or key missing");
  const traceId = hex(16);
  const now = BigInt(Date.now()) * 1_000_000n;
  const attribute = (key, value) => ({ key, value: { stringValue: String(value) } });
  const body = {
    resourceSpans: [
      {
        resource: {
          attributes: [
            attribute("service.name", app.name),
            attribute("service.version", app.version),
            attribute("deployment.environment", app.environment),
            attribute("release", app.release),
            attribute("app.id", app.id),
            attribute("app.build", app.build),
          ],
        },
        scopeSpans: [
          {
            scope: { name: "@sincpro/mobile" },
            spans: [
              {
                traceId,
                spanId: hex(8),
                name: "tickets/ObservabilityCheck",
                kind: 1,
                startTimeUnixNano: String(now - 5_000_000n),
                endTimeUnixNano: String(now),
                attributes: [
                  attribute("sincpro.check", "true"),
                  attribute("host", hostname()),
                ],
                status: { code: 1 },
              },
            ],
          },
        ],
      },
    ],
  };
  try {
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/v1/traces`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: apiKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    const text = (await response.text()).slice(0, 200);
    report(
      response.ok,
      "OTLP accepted the span",
      response.ok
        ? `HTTP ${response.status} · trace_id ${traceId} (search service.name=${app.name})`
        : `HTTP ${response.status} ${text}`,
    );
  } catch (error) {
    report(false, "OTLP", error instanceof Error ? error.message : String(error));
  }
}

async function checkLoki() {
  const endpoint = env.EXPO_PUBLIC_LOKI_ENDPOINT;
  const apiKey = env.EXPO_PUBLIC_OTLP_API_KEY;
  if (!endpoint || !apiKey) return report(false, "Loki", "endpoint or key missing");
  const labels = {
    app: app.name,
    service_name: app.name,
    env: app.environment,
    version: app.version,
    level: "info",
  };
  const line = `[infrastructure] Observability check from ${hostname()}: Loki receives the app's logs release=${app.release} sincpro_check=true`;
  try {
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/loki/api/v1/push`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: apiKey },
      body: JSON.stringify({
        streams: [
          { stream: labels, values: [[String(BigInt(Date.now()) * 1_000_000n), line]] },
        ],
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const text = (await response.text()).slice(0, 200);
    report(
      response.ok,
      "Loki accepted the line",
      response.ok
        ? `HTTP ${response.status} · {app="${app.name}", env="${app.environment}", version="${app.version}"}`
        : `HTTP ${response.status} ${text}`,
    );
  } catch (error) {
    report(false, "Loki", error instanceof Error ? error.message : String(error));
  }
}

async function checkGlitchtip() {
  const dsn = env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return report(false, "GlitchTip", "DSN missing");
  let url;
  try {
    url = new URL(dsn);
  } catch {
    return report(false, "GlitchTip", "the DSN is not a URL");
  }
  const project = url.pathname.replace(/^\//, "");
  const eventId = hex(16);
  const event = {
    event_id: eventId,
    timestamp: Date.now() / 1000,
    platform: "javascript",
    level: "error",
    logger: "sincpro.check",
    release: app.release,
    dist: app.build,
    environment: app.environment,
    server_name: hostname(),
    tags: {
      release: app.release,
      service_name: app.name,
      service_version: app.version,
      "sincpro.check": "true",
    },
    exception: {
      values: [
        {
          type: "ObservabilityCheck",
          value: `Check from ${hostname()}: GlitchTip receives the app's errors`,
        },
      ],
    },
  };
  const envelope = [
    JSON.stringify({ event_id: eventId, sent_at: new Date().toISOString(), dsn }),
    JSON.stringify({ type: "event" }),
    JSON.stringify(event),
  ].join("\n");
  try {
    const response = await fetch(`${url.origin}/api/${project}/envelope/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${url.username}, sentry_client=sincpro-check/1.0`,
      },
      body: envelope,
      signal: AbortSignal.timeout(10_000),
    });
    const text = (await response.text()).slice(0, 200);
    report(
      response.ok,
      "GlitchTip accepted the error",
      response.ok
        ? `HTTP ${response.status} · event ${eventId} · release ${app.release}`
        : `HTTP ${response.status} ${text}`,
    );
  } catch (error) {
    report(false, "GlitchTip", error instanceof Error ? error.message : String(error));
  }
}

await checkOtlp();
await checkLoki();
await checkGlitchtip();
process.exit(failed ? 1 : 0);
