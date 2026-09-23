# Hero Islands security audit

Date: 2026-09-16. Source baseline: `80ae1a7`.
Scope: current application, SQL migration, dependency audit and low-volume read-only checks against the deployed website and its configured Supabase public API. No real account data was retrieved or modified. No production configuration was changed.

## Assessment

Do not treat family cloud saving as security-verified for public launch yet. Vercel hosts the website; Supabase holds the database. Protecting Vercel alone does not prevent requests made directly to Supabase.

## Findings

1. **High: unbound sign-in callback can switch family accounts.** `hero/cloud.js:36` accepts access and refresh tokens from a URL fragment and verifies the token's user, but does not bind the callback to a login initiated by this browser. An attacker could supply their own valid account tokens in a link. `hero/app.js:385` then automatically uploads the device's local game state if that account has no save. This is login CSRF, not token forgery. Replace the implicit callback with a supported PKCE authentication flow and require an explicit decision before importing existing device progress into a new family account.

2. **High: writes are enabled before the initial cloud read finishes.** `restoreSession` activates the session before `bootCloud` finishes loading the remote save. User actions call `save`, which calls `queueSave`; the delayed write can replace the remote save with stale device state. Gate writes until cloud initialization succeeds, bind queued writes to their authenticated owner, and test delayed reads, failed reads, account changes and concurrent updates.

3. **Medium: no application-level database payload limit.** The migration checks only that `state` is a JSON object. A signed-in user can bypass the UI and submit a large object to their own row, subject only to platform limits. Add a database-enforced byte/shape constraint sized for actual saves. Keep one row per owner, and verify signup/CAPTCHA, API usage controls and budget alerts. A client-side size check or Vercel rate limit alone does not protect the direct Supabase endpoint.

4. **Medium: browser hardening headers are absent.** The production homepage response has no Content-Security-Policy, X-Frame-Options or X-Content-Type-Options. Add compatible response headers and test both Hero Islands and Classic. This is defense in depth; the audit did not find a confirmed saved-state XSS exploit.

## Live database verification blocker

Both findings 1 and 2 were reproduced in `tests/browser/cloud-security.spec.js` using mocked Supabase endpoints. The two secure-behavior assertions fail on the current code: an unsolicited token callback uploads local state to the supplied account, and a sound toggle triggers a write while the initial cloud read is held pending. These are intentionally failing regression tests; do not interpret this audit as an all-green application test run.

An anonymous request for `hero_islands_saves?select=owner_id&limit=0` returned HTTP 404, `PGRST205`, stating the table was unavailable in the schema cache. No rows were requested. This does not establish that the table is absent physically or that RLS is correct. The migration in the repository correctly scopes select/insert/update to `auth.uid() = owner_id`, revokes anonymous table access, and grants no parent delete permission. Its live installation remains unverified.

Before launch, inspect Supabase Security Advisor, actual grants/policies on all exposed tables/views/functions/storage, and run isolated two-parent tests proving parent A cannot read or write parent B's save. Verify redirect allowlists, authentication abuse controls and account/project ownership. Do not use real family rows for these tests.

## Positive checks

- Frontend credential is an intentionally public `anon` key, not a service-role key.
- The checked source files contained no matching private-key/database-password/service-role assignment patterns. This limited scan is not a full git-history secret audit.
- Public `/.env`, `/.git/config` and `/.vercel/project.json` each returned 404.
- `npm audit --json`: zero reported dependency vulnerabilities.
- Remote nickname rendering is escaped and avatar choices pass allowlists.
- Public authentication settings require email confirmation and disable anonymous-user signup. General signup is enabled. CAPTCHA, rate limits and billing controls were not verified from public settings.

## References

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/deployment/going-into-prod
- https://supabase.com/docs/guides/auth/auth-captcha

This audit is a point-in-time assessment, not a guarantee that no other vulnerabilities exist.
