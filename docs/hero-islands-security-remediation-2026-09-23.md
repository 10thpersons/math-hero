# Hero Islands security remediation and offline verification

## Applied changes

- Parent magic links use a locally initiated PKCE exchange. Unsolicited token fragments and code callbacks are rejected.
- Cloud writes wait for the initial read and use server-generated versions. Conflicts preserve device progress and require a choice. Account changes invalidate pending authentication and save responses.
- Device progress belonging to another family cannot be imported into the newly signed-in family.
- Supabase save table migration applied in the project dashboard. Ownership RLS, column grants, object-only JSON, a 128 KiB limit and server timestamps protect saves.
- Production Site URL and exact redirect allowlist set to `https://hero-islands-family.vercel.app/`.
- Vercel configuration adds CSP, framing protection, MIME sniffing protection and restrictive browser feature permissions. Deployment excludes audits, SQL scripts and tests.
- Offline cache is limited to public game assets. Authentication callback URLs and arbitrary endpoints are not cached.

## Verification

- Live dashboard SQL returned PASS for own access, cross-family isolation, anonymous denial, size/type constraints, protected ownership/timestamps and stale-write rejection. Synthetic users and saves were created inside a transaction and rolled back.
- 38 logic tests and the full 45-test browser suite passed. Two additional authentication/conflict regression tests were added after independent review; the cloud suite was rerun separately.
- Offline browser checks covered all five adventures and four quiz subjects across six school years, plus earned coins, avatar purchases and persistence after offline reload.
- Independent review reproduced and then confirmed fixes for sign-out during refresh, canceled save response parsing and double conflict-choice races.

## Remaining limits

- Public parent email delivery still requires a configured SMTP provider. The owner confirmed no provider yet. Actual delivered magic-link sign-in has not been tested; browser authentication checks use mocked responses.
- CAPTCHA is not configured. Existing Supabase authentication rate limits do not constitute per-family database write quotas.
- Offline play needs one successful online visit to download game assets, in the same browser. Clearing browser storage removes the local save/cache. First sign-in and cloud synchronization need internet; use Cloud save / Sync now after reconnecting.
- Game rewards are client-side and are not a tamper-proof currency. These checks cover this app's save path, not every schema, service or account in the owner's Supabase/Vercel organizations.
