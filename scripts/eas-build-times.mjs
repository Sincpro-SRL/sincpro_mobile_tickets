// How long the latest EAS builds took, from `eas build:list --json` on stdin.
let input = "";
for await (const chunk of process.stdin) input += chunk;

const minutes = (from, to) =>
  from && to ? `${((new Date(to) - new Date(from)) / 60000).toFixed(1)} min` : "-";

console.table(
  JSON.parse(input).map((build) => ({
    platform: build.platform,
    profile: build.buildProfile,
    status: build.status,
    created: build.createdAt,
    total: minutes(build.createdAt, build.completedAt),
  })),
);
