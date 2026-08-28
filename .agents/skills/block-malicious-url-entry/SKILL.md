---
name: block-malicious-url-entry
description: Safely block malicious zws short URLs and redirected domains in production PostgreSQL and Redis. Use when asked to block a zws.im URL, malicious target URL, hostname, or redirected domain.
---

# Block Malicious URL Entry

Use this skill when a user asks to block a malicious `zws.im` short URL, its redirected destination, or a target hostname/domain.

This is a production-adjacent workflow. Treat PostgreSQL and Redis writes as high risk, keep secrets out of output, and verify with public/API requests before reporting completion.

## Required inputs

- Suspicious `zws.im` URL and/or target URL.
- Target hostname/domain when the user already knows it.
- Production environment scope, normally Railway `production` and service `API`.

## Safety rules

- Never print `DATABASE_URL`, `REDIS_URL`, API keys, passwords, or full environment output.
- Prefer Railway CLI `railway run --service API --environment production -- ...` over local `.env` for production data.
- Always run a dry run before applying changes unless the user explicitly instructs an immediate production block.
- Use parameterized SQL and transactions. Never use broad unscoped `UPDATE` or any `DELETE`.
- Update only:
  - `blocked_hostnames.hostname`
  - `urls.blocked`
  - Redis set `blocked-hostnames`
- If the target domain is ambiguous, stop and clarify before applying.

## Workflow

1. Inspect the relevant code paths if needed:
   - `apps/api/src/db/schema.ts`
   - `apps/api/src/blocked-hostnames/blocked-hostnames.service.ts`
   - `apps/api/src/blocked-urls/blocked-urls.service.ts`
   - `apps/api/src/urls/urls.service.ts`
   - `apps/api/src/urls/dtos/short.dto.ts`
   - `apps/web/app/[short]/page.tsx`
2. Determine the target:
   - Decode the short path with `decodeURIComponent`.
   - Apply `SHORT_REWRITES` if configured.
   - Base64 encode the decoded short ID for `urls.short_base64`.
   - Fetch the short URL with `redirect: 'manual'` to read `Location` without following malicious content.
3. Run a dry run with the API helper script:

   ```bash
   cd apps/api
   railway run --service API --environment production -- \
     node scripts/block-malicious-url.ts \
       --dry-run \
       --url 'https://zws.im/...' \
       --hostname 'example.com'
   ```

4. Review the JSON output:
   - `shortBase64` should be present for a zws short URL.
   - `resolvedTargetUrl` should match the malicious redirect target when available.
   - `existingShortRow` or `existingTargetRows` should identify rows to block.
   - `existingBlockedHostname` shows whether the domain is already blocked.
5. Apply the block:

   ```bash
   cd apps/api
   railway run --service API --environment production -- \
     node scripts/block-malicious-url.ts \
       --apply \
       --url 'https://zws.im/...' \
       --hostname 'example.com'
   ```

6. Verify:
   - API should return `410 Gone` for the short URL.
   - Web URL should not externally redirect to the malicious domain. It may return `200` with the blocked URL page.
   - Redis output should show the domain was added or already present.

## Verification commands

Use read-only HTTP checks after applying:

```bash
node --input-type=module <<'EOF'
const url = 'https://zws.im/...';
const api = new URL(url);
api.hostname = 'api.zws.im';
const [web, apiResponse] = await Promise.all([
	fetch(url, { redirect: 'manual' }),
	fetch(api, { redirect: 'manual' }),
]);
console.log(JSON.stringify({
	web: { status: web.status, location: web.headers.get('location') },
	api: {
		status: apiResponse.status,
		location: apiResponse.headers.get('location'),
		body: await apiResponse.text(),
	},
}, null, 2));
EOF
```

Expected API result:

```json
{
	"status": 410,
	"location": null
}
```

## Troubleshooting

- `psql not found`: use the Node helper script with the `pg` dependency in `apps/api`.
- `Cannot find package 'pg'`: run from `apps/api` and ensure workspace dependencies are installed.
- Local `.env` has the wrong DB: use `railway run --service API --environment production -- ...`; do not trust local row counts for production.
- Railway MCP unauthorized: use the Railway CLI if `railway status` works.
- `railway run` heredoc times out: use `node -e` or the helper script path instead of heredocs.
- `SELF_SIGNED_CERT_IN_CHAIN`: try the helper through Railway production env first. For direct local DB testing, `ssl: { rejectUnauthorized: false }` may be required.
- SQL syntax error near `)`: usually shell interpolation ate `$1` placeholders. Use the helper script instead of inline SQL.
- Public web returns `200` after blocking: this can be correct if it renders the blocked page. Verify the API returns `410`.
- DB says blocked but behavior has not changed: update Redis set `blocked-hostnames` or wait for the 30-minute cache expiry.

## Success criteria

- Target hostname exists in `blocked_hostnames`.
- Target short URL row is `blocked = true` when a short URL was provided.
- Redis set `blocked-hostnames` contains the hostname for immediate enforcement.
- API returns `410 Gone` for the malicious short URL.
- Final response summarizes what was blocked and the proof from verification.
