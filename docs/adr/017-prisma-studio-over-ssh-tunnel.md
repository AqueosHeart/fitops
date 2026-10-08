# ADR 017 Provide on-demand Prisma Studio over an SSH tunnel

## Status

Accepted on 2026-10-08 for the private FitOps demo deployment.

## Context

The owner wants a visual way to inspect and edit the server's Prisma-managed database. Prisma Studio can directly read and mutate every table, bypassing FitOps authorization and booking rules. The database is fictional demo data, but the server shares a LAN with other devices and already hosts AARC.

## Decision

- Add Prisma Studio as an on-demand `studio` Compose profile using the same built app image and the private database connection. The current Prisma CLI binds to loopback inside its container, so a companion proxy shares Studio's network namespace and forwards to its loopback listener.
- Publish Studio only on server loopback at `127.0.0.1:5555`; do not publish its port on the LAN interface or internet.
- Access it from a workstation using SSH local forwarding to `127.0.0.1:5555`. Stop the Studio profile after use; leave the FitOps app and database running.
- Make direct database editing risks explicit. Do not seed again or modify booking/auth/session rows casually.

## Consequences

- The owner can use a local browser at `http://127.0.0.1:5555` while the SSH tunnel is active.
- Studio itself has no FitOps login gate; SSH access controls who can reach its loopback-only host port.
- Writes bypass domain invariants and can corrupt app state. Use only with the fictional FitOps database; never point it at AARC or production data.

## Alternatives considered

- Bind Studio to `192.168.1.208:5555`: rejected because every device on the LAN could reach an unauthenticated direct database editor.
- Keep using SQL/psql only: rejected because the owner requested a visual, interactive database browser.
