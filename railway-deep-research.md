# Railway deep deployment research — 2026-08-20

## Sources reviewed

- https://docs.railway.com/config-as-code
- https://docs.railway.com/config-as-code/reference

## Findings

Railway's official Config as Code documentation states that `railway.toml` or `railway.json` defines the configuration for a **single deployment**. It covers build and deploy settings for the service, and code-defined values override dashboard values for that deployment. The reference lists builder, Dockerfile path, build command, start command, pre-deploy command, healthcheck, restart policy, cron, environment overrides, and deployment teardown settings.

The reference does not list a field for creating another service, provisioning a database service, or attaching a Volume from `railway.json`/`railway.toml`. Therefore those files cannot turn a normal GitHub deploy into a multi-service project. The current StoreKit Dockerfile + embedded PostgreSQL approach is the only one-click path available purely from repository code; managed PostgreSQL/Volume provisioning requires a Railway Template or platform workflow.

Railway's docs also state that a Dockerfile is used when present, and that the configuration file controls the deployment that is currently being built. StoreKit's explicit `DOCKERFILE`, Dockerfile path, start command, healthcheck, and restart policy are aligned with those supported fields.

## Volumes and GitHub autodeploys

Source: https://docs.railway.com/volumes

Railway describes Volumes as persistent storage for services. The mount path must be configured on the service. Volumes are mounted as the root user; if an image uses a non-root user, Railway documents `RAILWAY_RUN_UID=0`. This confirms that a Volume is a service/project resource rather than something the repository's `railway.json` can create during a plain GitHub deploy.

Source: https://docs.railway.com/deployments/github-autodeploys

Railway states that services linked to a GitHub repository automatically deploy new commits pushed to the connected branch. The trigger branch is selected in Service Settings. Autodeploy requires at least one project member with a connected GitHub account that has contributor access to the repository, and the Railway GitHub App must have access to the repository. This is an account-level prerequisite that cannot be supplied by the repository files or the Deploy Button URL.

For StoreKit, the post-merge production path is: the Railway service must be connected to `main`, autodeploy enabled, and the Railway GitHub App authorized. Once that one-time project connection exists, later `git push` operations can redeploy automatically. The first GitHub Deploy Button still cannot encode the user's GitHub/Railway account authorization or create a Volume through config-as-code.

## Services and managed PostgreSQL

Source: https://docs.railway.com/services

Railway services can use a GitHub repository, local directory, or Docker image as their source. If a Dockerfile exists in the repository, Railway automatically uses it to build the service. For GitHub sources, the Railway account must be linked to GitHub, and pushes to the linked branch trigger new builds and deploys. This confirms that a public repository alone is not sufficient for autodeploy authorization; the Railway GitHub App/account connection is required.

Source: https://docs.railway.com/databases/postgresql

Railway's PostgreSQL template provisions a separate PostgreSQL service in the project. It exposes `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, and `DATABASE_URL` for connections from other services. The docs call the templates unmanaged and recommend that production users handle backups and observability. Railway also documents a default 64 MB shared-memory limit and the `RAILWAY_SHM_SIZE_BYTES` variable for larger database workloads.

For StoreKit, the repository-only one-click path should continue using the embedded PostgreSQL fallback so it needs no second service. The managed PostgreSQL architecture is more production-grade but necessarily belongs to a Railway Template/project workflow, not a plain GitHub repository deploy.
