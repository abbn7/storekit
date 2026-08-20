# iPhone route matrix findings

## Test setup

The current production build was started from the latest StoreKit code with PostgreSQL seeded locally, using CDP mobile emulation at 390x844, device scale factor 3, and touch emulation. The matrix covered English/light and Arabic/dark cases.

## Results

- 58 route/case records were tested: 29 routes in English/light and 29 in Arabic/dark.
- 18 admin route records correctly redirected to `/admin/login` and returned expected 401 API responses because no admin session was present. These are expected authentication protections, not application errors.
- 0 unexpected console errors or network failures occurred after the server was started correctly.
- 0 blank routes occurred.
- 0 horizontal overflow records occurred; every route reported `scrollWidth` equal to the 390px viewport.
- 0 missing-label button records occurred.
- Arabic routes reported `dir=rtl` and dark routes reported the dark class.
- All tested routes rendered with populated root content.

## Important test-harness finding

The first run produced many 500 responses because the local server was launched under `sudo` without the Node binary in PATH and with PostgreSQL data under `/home/ubuntu`, which the `postgres` user could not traverse. The production Docker image does not have this issue because its working directory is `/app` and Node is on PATH. The local replay was corrected by setting `PGDATA=/tmp/storekit-iphone-postgres` and explicitly passing the Node PATH; the complete matrix then passed.
