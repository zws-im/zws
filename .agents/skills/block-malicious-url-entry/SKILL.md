---
name: block-malicious-url-entry
description: Block a malicious zws short URL, destination URL, or hostname in production PostgreSQL and Redis.
---

# Block Malicious URL Entry

Block the destination hostname, not `zws.im`. Production defaults to Railway environment `production`, service `API`.

## Procedure

1. Provide the known hostname, destination URL, or `zws.im` short URL. Stop if the hostname is ambiguous or belongs to a shared platform.
2. Run `railway status` and confirm project `zws`, environment `production`, and service `API`.
3. From `apps/api`, run `railway run --service API --environment production -- node scripts/block-malicious-url.ts --dry-run --hostname '<hostname>'` (or pass `--url`/`--target-url`). Review the exact matching URL count.
4. After approval, repeat with `--apply`. The script inserts the hostname, refreshes Redis, and verifies a representative short URL when available.

The script intentionally does not bulk-update `urls.blocked`: retrieval checks the hostname block and lazily marks each matching row. Never print connection strings, credentials, or full environment output. If the dry run reveals unexpectedly broad scope, ask the user before applying.
