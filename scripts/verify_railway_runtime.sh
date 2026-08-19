#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CTX="${TMPDIR:-/tmp}/storekit-railway-build-context"
RUNNER="${TMPDIR:-/tmp}/storekit-railway-runtime"
PORT_TO_TEST="${PORT_TO_TEST:-8093}"

if [[ ! -f "$CTX/artifacts/api-server/dist/index.mjs" ]]; then
  echo "Missing build context. Run verify_railway_build_context.sh first." >&2
  exit 1
fi

rm -rf "$RUNNER"
mkdir -p "$RUNNER" "$RUNNER/lib/db" "$RUNNER/lib/api-spec" "$RUNNER/lib/api-zod" "$RUNNER/lib/api-client-react" "$RUNNER/artifacts/api-server" "$RUNNER/scripts"

cp -a "$CTX/artifacts/api-server/dist" "$RUNNER/artifacts/api-server/dist"
cp -a "$CTX/artifacts/storekit/dist/public" "$RUNNER/public"
cp -a "$CTX/lib/db/drizzle" "$RUNNER/artifacts/api-server/drizzle"
cp "$ROOT/pnpm-workspace.yaml" "$ROOT/pnpm-lock.yaml" "$ROOT/package.json" "$ROOT/tsconfig.json" "$ROOT/tsconfig.base.json" "$RUNNER/"
for package in lib/db lib/api-spec lib/api-zod lib/api-client-react artifacts/api-server scripts; do
  cp "$ROOT/$package/package.json" "$RUNNER/$package/package.json"
done
cp "$ROOT/scripts/start-production.sh" "$RUNNER/scripts/start-production.sh"
chmod +x "$RUNNER/scripts/start-production.sh"

cd "$RUNNER"
npx --yes pnpm@10 install --frozen-lockfile --prod

set -a
if [[ -f /tmp/storekit-runtime.env ]]; then
  . /tmp/storekit-runtime.env
fi
set +a
export NODE_ENV=production
export PORT="$PORT_TO_TEST"
export FRONTEND_DIST="$RUNNER/public"
export UPLOAD_DIR="$RUNNER/uploads"
export APP_ROOT="$RUNNER"
export INTERNAL_PG_PORT="${INTERNAL_PG_PORT:-55434}"
export PGDATA="$RUNNER/data/postgres"
# This verifier intentionally proves the zero-setup path rather than reusing a host DB.
unset DATABASE_URL || true
mkdir -p "$RUNNER/uploads" "$RUNNER/data"

sh "$RUNNER/scripts/start-production.sh" > "$RUNNER/server.log" 2>&1 &
SERVER_PID=$!
PG_CTL="$(dirname "$(find /usr/lib/postgresql -type f -name pg_ctl -print -quit)")/pg_ctl"
cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
  if [[ -s "$PGDATA/PG_VERSION" ]]; then
    runuser -u postgres -- "$PG_CTL" -D "$PGDATA" -m fast stop >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

for _ in $(seq 1 45); do
  if curl -fsS "http://127.0.0.1:${PORT_TO_TEST}/healthz" >/dev/null 2>&1; then break; fi
  sleep 1
done
curl -fsS "http://127.0.0.1:${PORT_TO_TEST}/healthz" | grep -qx 'ok'
curl -fsS "http://127.0.0.1:${PORT_TO_TEST}/api/health" | grep -q '"ok":true'
curl -fsS "http://127.0.0.1:${PORT_TO_TEST}/" -o "$RUNNER/root.html"
grep -q 'StoreKit' "$RUNNER/root.html"
curl -fsS "http://127.0.0.1:${PORT_TO_TEST}/collections" -o "$RUNNER/collections.html"
grep -q 'StoreKit' "$RUNNER/collections.html"
curl -fsS "http://127.0.0.1:${PORT_TO_TEST}/images/fashion/hero-luxury-mobile.jpg" -o "$RUNNER/hero-luxury-mobile.jpg"
test -s "$RUNNER/hero-luxury-mobile.jpg"
printf 'railway_runtime_image=passed\nport=%s\nrunner=%s\n' "$PORT_TO_TEST" "$RUNNER"
