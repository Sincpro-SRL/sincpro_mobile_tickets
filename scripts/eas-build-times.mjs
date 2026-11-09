// How long the latest EAS builds took, from `eas build:list --json` on stdin.
let input = "";
for await (const chunk of process.stdin) input += chunk;

if (!input.trim()) {
  console.error("✘ EAS no devolvió builds. Si el proyecto no está vinculado: make eas-init");
  process.exit(1);
}

const builds = JSON.parse(input);
if (builds.length === 0) {
  console.log(
    "Todavía no hay builds en EAS. Lanzá uno con make eas-build o make eas-build-preview.",
  );
  process.exit(0);
}

const minutes = (from, to) => `${((new Date(to) - new Date(from)) / 60000).toFixed(1)} min`;

// A finished build shows its total; one still running shows how long it has been going.
const took = (build) =>
  build.completedAt
    ? minutes(build.createdAt, build.completedAt)
    : `${minutes(build.createdAt, new Date())} (en curso)`;

console.table(
  builds.map((build) => ({
    platform: build.platform,
    profile: build.buildProfile,
    version: `${build.appVersion ?? "-"} (${build.appBuildVersion ?? "-"})`,
    status: build.status,
    created: build.createdAt,
    took: took(build),
  })),
);
