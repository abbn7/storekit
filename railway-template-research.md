# Railway template research — 2026-08-20

## Sources reviewed

- https://docs.railway.com/quick-start
- https://docs.railway.com/templates/deploy

## Findings

Railway's official Quick Start distinguishes direct GitHub deployment from template deployment. The template flow is: open the dashboard, choose New Project, choose Deploy a template, select a template, fill required information, and click Deploy. Railway states that it provisions a new project with all services and configurations defined in the template.

Railway's official Deploy a Template page states that templates deploy a fully configured project automatically connected to infrastructure. The template deployment flow can create a new project containing the services defined by the template; the page also explains that a deployed service can be ejected from the template repository into the user's own GitHub organization when code changes are needed.

Implication for StoreKit: a Railway Template is the platform-supported path for true multi-resource one-click provisioning, while a plain GitHub deploy button only creates the application service. A template could provision the StoreKit service plus managed PostgreSQL and its variable wiring in one project. A Volume still needs separate confirmation from Railway's template schema/reference before being advertised as automatically provisioned.

## Additional findings from Create a Template

The official Create a Template page says a template can define services, environment configuration, and network settings, and can select a service source from a GitHub repository or Docker image. It explicitly lists service settings including Root Directory, public networking, custom Start command, Healthcheck Path, and attaching a Volume. It also states that a particular GitHub branch can be selected by entering the full URL to that branch in the Source Repo configuration.

Implication for StoreKit: the correct automatic provisioning path is a Railway Template created in the user's Railway workspace. The template should point its app service at the target GitHub repository and the production branch, while the self-contained Docker image remains a safe fallback. A template URL is not something that can be fully created from repository files alone; it is a Railway workspace resource that must be created or published from the Railway dashboard/account.

## Button endpoint check

The legacy public URL `https://railway.app/button` currently returned a 404 page in the browser on 2026-08-20. The official documentation still describes creating templates from the Railway UI, so the repository should keep the working GitHub deploy URL and should not invent a template URL until a real Railway workspace template ID exists.
