# Backend (Reset)

This backend is a controlled, queue-based media fetch service.

## Processes
- API: accepts a single URL, validates limits, enqueues a job, serves status + signed downloads.
- Worker: processes exactly one job at a time, fetches media sequentially, writes to temporary storage, and expires files.

## Run locally
From `backend/`:
- Install: `npm install`
- API (dev): `npm run dev:api`
- Worker (dev): `npm run dev:worker`

## Environment
Copy `.env.example` to `.env` and adjust.
