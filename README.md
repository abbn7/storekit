# StoreKit

Luxury fashion storefront with a single production service that serves the React storefront and Express API from one Railway deployment.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/github?repo=abdelhamednada631-del/storekit)

## One-click deployment

Click the **Deploy on Railway** button above, choose the repository, and deploy from the repository root. The repository includes `Dockerfile`, `railway.json`, and `nixpacks.toml`; Railway will build one StoreKit service and start the API at `artifacts/api-server/dist/index.mjs`. Do not create a Railway service for each workspace package.

The application requires one PostgreSQL service inside the same Railway project because orders, products, collections, and administration data are persistent. After the project canvas opens, add PostgreSQL and set `DATABASE_URL` on the StoreKit service to the PostgreSQL reference variable. The application then runs migrations and seeds an empty database automatically.

Required production variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Reference to the Railway PostgreSQL service |
| `ADMIN_PASSWORD` | A new strong admin password |
| `ADMIN_SECRET` | A long random production secret |
| `NODE_ENV` | `production` |

The service exposes `/healthz` and `/api/health`. A successful deployment returns `ok` from `/healthz` and JSON with `ok: true` from `/api/health`.

## Deployment contract

The root Dockerfile uses Debian slim rather than Alpine, copies all workspace TypeScript configuration files, builds the storefront and API in separate stages, and serves both through one Express process. The root production build intentionally does not run recursive workspace builds; experimental packages such as `mockup-sandbox` are not production services.

For the full Railway procedure, environment variables, uploads volume, database behavior, and troubleshooting, read [`RAILWAY.md`](./RAILWAY.md).
