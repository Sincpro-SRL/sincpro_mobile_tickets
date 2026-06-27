#!/bin/bash
# expo-modules-jsi has a double constraint in Swift 6 strict concurrency mode:
#
#   1. `weak let runtime` is invalid — ARC can nil weak refs at runtime,
#      so `weak` must be `var` (mutable). Compiler: "'weak' must be a mutable
#      variable, because it may change at runtime"
#
#   2. `weak var runtime` in a `Sendable`-conforming class is also invalid —
#      `Sendable` classes must not have mutable stored properties. Compiler:
#      "stored property 'runtime' of 'Sendable'-conforming class is mutable"
#
# The correct fix for both constraints is `nonisolated(unsafe) weak var runtime`:
#   - `weak var` satisfies the ARC requirement (ref can become nil)
#   - `nonisolated(unsafe)` opts out of the Sendable mutability check
#     (the caller asserts cross-actor access is safe)
#
# This pattern is valid for:
#   - Sendable classes (required to silence the mutable-property error)
#   - ~Copyable structs (nonisolated(unsafe) is redundant but harmless)
#   - Actors (marks the property as unprotected by actor isolation; valid)
#
# Patterns are designed to be idempotent: if already applied,
# `nonisolated(unsafe) weak` won't match `  weak`, so re-runs are safe.
#
# This script is wired to `postinstall` in package.json so it runs after
# every `yarn install`. It also removes stale DerivedData so the xcframework
# build starts clean after any patch change.

set -euo pipefail

SWIFT_DIR="node_modules/expo-modules-jsi/apple/Sources"

if [ ! -d "$SWIFT_DIR" ]; then
  echo "patch-expo-modules-jsi: Sources directory not found, skipping"
  exit 0
fi

# Apply the fix to all Swift files.
# Handles access modifiers: none, private, internal
find "$SWIFT_DIR" -name '*.swift' -exec sed -i '' \
  -e 's/  weak let runtime/  nonisolated(unsafe) weak var runtime/g' \
  -e 's/  weak var runtime/  nonisolated(unsafe) weak var runtime/g' \
  -e 's/  private weak let runtime/  nonisolated(unsafe) private weak var runtime/g' \
  -e 's/  private weak var runtime/  nonisolated(unsafe) private weak var runtime/g' \
  -e 's/  internal weak let runtime/  nonisolated(unsafe) internal weak var runtime/g' \
  -e 's/  internal weak var runtime/  nonisolated(unsafe) internal weak var runtime/g' \
  {} +

# Remove stale DerivedData so the xcframework build starts clean.
# The build script stores it at apple/.DerivedData — it survives yarn installs
# and can hold compiled objects from a previous failed build with the buggy sources.
rm -rf "node_modules/expo-modules-jsi/apple/.DerivedData"
rm -rf "node_modules/expo-modules-jsi/apple/.build"

echo "✓ expo-modules-jsi patched (nonisolated(unsafe) weak var runtime) + DerivedData cleared"
