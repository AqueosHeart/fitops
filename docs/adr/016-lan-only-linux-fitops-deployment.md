# ADR 016 Run FitOps as an isolated LAN-only Linux Compose project

## Status

Accepted and deployed on 2026-10-08 for the user's private demo host.

## Context

FitOps needed to run beside the AARC application on a small Debian server. AARC already owns host port 3000 and its own database/service lifecycle. The server has Docker, but the project must not share AARC's database, checkout, or deployment commands. This is a fictional portfolio/demo instance, not a public production service.

## Decision

- Run FitOps from `/home/sebastian/fitops` as a uniquely named Docker Compose project, using a Node 24 app container and a dedicated PostgreSQL 16 container/volume.
- Keep PostgreSQL on an internal-only Compose network with no published host port. Attach the app to that network and a separate bridge network for its published HTTP port.
- Bind HTTP only to `192.168.1.208:3001`. Do not alter host firewall/router rules, AARC's port 3000, its MySQL data, service, reverse proxy, or release process.
- Store server-only generated credentials in `/home/sebastian/fitops/.env` with mode 0600. Seed fictional data only once on the fresh FitOps volume.
- Treat the instance as private-LAN only. No TLS, public exposure, or production-security claim is implied.

## Consequences

- Home devices on the same LAN can reach the app at `http://192.168.1.208:3001`; users away from that LAN need a separately reviewed private VPN solution.
- FitOps can be stopped/rebuilt without changing AARC, while its named PostgreSQL volume persists.
- The current pinned Next.js 16.3.6 has a high-severity finding in `npm audit --omit=dev`; keep this instance private and resolve/update the framework before any broader exposure.

## Alternatives considered

- Reuse AARC's MySQL database or service: rejected because it would couple separate products and risk AARC data.
- Publish PostgreSQL on a host port: rejected; the app reaches the DB only through Compose networking.
- Expose FitOps through AARC's reverse proxy or router: rejected for this demo deployment; it would expand scope and public attack surface.
