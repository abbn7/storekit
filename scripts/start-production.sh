#!/bin/sh
set -eu

APP_ROOT="${APP_ROOT:-/app}"
PGDATA="${PGDATA:-$APP_ROOT/data/postgres}"
INTERNAL_PG_PORT="${INTERNAL_PG_PORT:-5432}"
INTERNAL_DATABASE_URL="postgresql://postgres@127.0.0.1:${INTERNAL_PG_PORT}/storekit"
PG_CTL_PATH="$(find /usr/lib/postgresql -type f -name pg_ctl -print -quit)"
if [ -z "$PG_CTL_PATH" ]; then
  echo "PostgreSQL server binaries were not found in /usr/lib/postgresql." >&2
  exit 1
fi
PG_BIN="$(dirname "$PG_CTL_PATH")"
INITDB="$PG_BIN/initdb"
PG_CTL="$PG_BIN/pg_ctl"
CREATEDB="$PG_BIN/createdb"

mkdir -p "$APP_ROOT/data" "${UPLOAD_DIR:-$APP_ROOT/uploads}"

if [ -z "${DATABASE_URL:-}" ]; then
  if ! command -v runuser >/dev/null 2>&1; then
    echo "runuser is required to start the internal PostgreSQL process." >&2
    exit 1
  fi
  mkdir -p "$PGDATA"
  chown -R postgres:postgres "$PGDATA" "$APP_ROOT/data" 2>/dev/null || true

  if [ ! -s "$PGDATA/PG_VERSION" ]; then
    runuser -u postgres -- "$INITDB" -D "$PGDATA" --auth=trust --username=postgres --encoding=UTF8
  fi

  if ! runuser -u postgres -- "$PG_CTL" -D "$PGDATA" status >/dev/null 2>&1; then
    runuser -u postgres -- "$PG_CTL" -D "$PGDATA" -o "-c listen_addresses=127.0.0.1 -p $INTERNAL_PG_PORT -c shared_buffers=32MB -c max_connections=50" -w -t 60 start
  fi

  runuser -u postgres -- "$CREATEDB" -h 127.0.0.1 -p "$INTERNAL_PG_PORT" storekit >/dev/null 2>&1 || true
  export DATABASE_URL="$INTERNAL_DATABASE_URL"
fi

exec node --enable-source-maps "$APP_ROOT/artifacts/api-server/dist/index.mjs"
