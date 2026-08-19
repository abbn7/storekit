# Railway One-Click deployment research

Railway's Config as Code files, `railway.json` and `railway.toml`, define the build and deploy configuration for a service: Dockerfile/Railpack selection, build command, start command, healthcheck, restart policy, and environment-specific overrides. They do not provision or delete additional project services.

Railway Volumes are project-level resources connected to a service with a mount path. They provide the persistence required for data that must survive container recreation, but they are not required for a service to boot successfully.

A direct GitHub deploy can therefore create the StoreKit application service without creating a separate PostgreSQL service only if the application owns its database process. StoreKit now uses that approach: the Docker runtime installs PostgreSQL 16, and `scripts/start-production.sh` initializes and starts an internal database when `DATABASE_URL` is absent. When `DATABASE_URL` is present, the external PostgreSQL connection takes precedence.

This delivers the requested one-click deployment contract—one GitHub button, one Railway service, no manual database setup—but it does not by itself guarantee durable business data across container recreation. For production persistence, connect a Railway Volume at `/app/data` or provide an external PostgreSQL `DATABASE_URL`. The internal database is intentionally PostgreSQL rather than SQLite so the existing uuid/jsonb/timestamp schema and Drizzle migrations remain unchanged.
