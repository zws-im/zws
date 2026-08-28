# References

## Code paths

- `apps/api/src/db/schema.ts`
  - `blockedHostnames` maps to table `blocked_hostnames`.
  - `urls.blocked` marks individual short URL rows blocked.
- `apps/api/src/blocked-hostnames/blocked-hostnames.service.ts`
  - Redis set key: `blocked-hostnames`.
  - Cache duration: 30 minutes.
  - Checks exact hostname and derived domain name.
- `apps/api/src/blocked-urls/blocked-urls.service.ts`
  - Considers stored `blocked`, captcha phishing heuristic, blocked hostnames, and Google Safe Browsing.
- `apps/api/src/urls/urls.service.ts`
  - Encodes short IDs with `Buffer.from(value).toString('base64')`.
  - Marks a URL row blocked when hostname blocking is detected during retrieval.
- `apps/api/src/urls/dtos/short.dto.ts`
  - Applies `SHORT_REWRITES` before short ID use.
- `apps/api/src/urls/urls.controller.ts`
  - Returns `410 Gone` when a short URL is blocked.
- `apps/web/app/[short]/page.tsx`
  - Renders the blocked page when the API returns `410`.

## Railway commands

```bash
railway status
railway run --service API --environment production -- node -e "console.log(process.env.DATABASE_URL ? 'has db' : 'no db')"
```

Avoid:

```bash
railway run --service API --environment production -- env
railway run --service API --environment production -- printenv
```

These can print secrets.

## Helper script commands

Dry run:

```bash
cd apps/api
railway run --service API --environment production -- \
  node scripts/block-malicious-url.ts \
    --dry-run \
    --url 'https://zws.im/...' \
    --hostname 'example.com'
```

Apply:

```bash
cd apps/api
railway run --service API --environment production -- \
  node scripts/block-malicious-url.ts \
    --apply \
    --url 'https://zws.im/...' \
    --hostname 'example.com'
```

## Known evidence from prior workflow

- `psql` may not be installed locally.
- Local `.env` may not point to production.
- Railway MCP may be unauthorized while Railway CLI still works.
- Inline shell SQL can break `$1` placeholders due to shell expansion.
- Updating PostgreSQL alone may not affect live behavior immediately if Redis `blocked-hostnames` cache already exists.
- API `410 Gone` is the strongest verification signal; web `200` can still be the blocked-page response.
