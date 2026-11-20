# Decision Record #2: System Architecture

* **Status:** Accepted
* **Date:** 2026-11-20

## Context
Complexe Scolaire Les Palmiers (Pikine, Dakar) is operated day to day by one administrator (Mariama Diallo) and two office assistants managing termly installment fees (cash and mobile money) for ~380 pupils from nursery through CM2. Staff use inexpensive Android phones over slow, patchy cellular data that frequently drops mid-request. The school has zero software license budget, and one solo developer builds, tests, and maintains the system. Balances must be computed strictly on the server, and network retries must never duplicate recorded payments.

## Decision
We select a **single-service modular monolith** built on the course reference stack:
1. **Mobile Client:** React Native (Expo) staff-facing client that generates a unique UUID `request_id` per payment attempt and renders server-computed balances only.
2. **API Contract:** Explicit versioned JSON/HTTPS REST contract (`POST /pupils`, `POST /payments`, `GET /pupils/:id/balance`).
3. **Backend:** Single Node.js + TypeScript + Fastify service enforcing input validation, installment count rules, server-side balance computation, and idempotent payment recording.
4. **Database:** Neon (free-tier managed PostgreSQL) enforcing relational foreign keys, integer XOF currency storage, and a `UNIQUE` constraint on `request_id`.
5. **Payment Boundary:** Isolated server-side adapter wrapping Flutterwave (test mode) / mock mobile-money verification so external provider details never leak into core ledger routes.

## Alternatives Considered
1. **Database-as-Backend / PostgREST (Simpler Option — Rejected):** Exposing PostgreSQL directly via auto-generated REST endpoints and Row-Level Security (RLS) eliminates the custom Fastify server, but pushes business rules (installment caps, balance authority, and payment verification) into SQL/RLS policies that are harder to unit-test and maintain safely by a solo developer.
2. **Local-First Replicated SQLite with Sync Relay (More Complex Option — Rejected):** Maintaining local SQLite replicas on each phone offers full offline writes, but introduces distributed sync/merge conflict complexity when two assistants record payments concurrently—creating excessive operational burden for one maintainer.

## Consequences
* **Positive:** Clean separation of concerns; business logic is easily unit- and integration-tested in TypeScript; strict server authority over balances; database-enforced `request_id` uniqueness guarantees safe retries over patchy cellular connections; zero software licensing cost.
* **Negative / Trade-offs:** Requires brief cellular connectivity to confirm payments and fetch live balances; Neon free-tier compute may experience ~1–2 second cold starts after idle periods.
