# Block Malicious URL Entry Checklists

## Preflight

- Confirm the user provided a malicious `zws.im` short URL, target URL, or hostname.
- Confirm whether the request is for production. Default to production for live `zws.im` abuse reports.
- Run `railway status` and verify project `zws`, environment `production`, and service access are available.
- Do not run `railway run env`, `printenv`, or any command that prints secret values.
- Run the helper from `apps/api` so `pg` and `redis` resolve directly from that workspace.

## Dry run review

- `shortBase64` is present when a zws short URL is provided.
- `resolvedTargetUrl` matches the reported malicious destination or manual redirect result.
- `hostname` is the domain to block, not `zws.im` or `api.zws.im`.
- `existingShortRow`, `existingTargetRows`, or `existingDomainRows` show the expected records.
- If no rows match, decide whether blocking only the hostname is sufficient.

## Apply

- Use `--apply`, not a hand-written SQL one-liner.
- Check that the apply output includes:
  - `hostnameInserted` or an existing hostname.
  - Updated short/target/domain row counts.
  - Redis update result.
- If Redis update is skipped or fails, note that enforcement may wait for cache expiry unless the DB row is already marked `blocked`.

## Verification

- Request the API URL with `redirect: 'manual'`.
- Confirm API status is `410`.
- Request the public web URL with `redirect: 'manual'`.
- Confirm there is no `Location` header pointing to the malicious domain.
- If public web status is `200`, ensure this is the blocked page behavior, not a redirect.

## Escalation

- Stop if the hostname is ambiguous or looks like a legitimate shared platform.
- Stop if production Railway access is unavailable and the user has not approved a local/staging-only operation.
- Stop if the helper dry run shows many domain rows and the user only asked for one short URL.
- Escalate if Google Safe Browsing or captcha heuristics should be adjusted instead of one-off blocking.
