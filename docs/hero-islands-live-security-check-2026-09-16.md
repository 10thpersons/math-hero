# Live Supabase dashboard verification

Read-only inspection on 2026-09-16 of Hero Island, project `fdcwhspwiadxkfcvoocm`, in the user's signed-in Supabase dashboard.

- Public schema Policies page: "No tables to create policies for". The game's expected public save table and ownership policies are not installed there. This corroborates the earlier public API PGRST205 response.
- Security Advisor displayed zero errors, warnings and suggestions. This is not evidence of correct family isolation when the required table does not exist.
- Authentication Site URL: `http://localhost:3000`.
- Authentication Redirect URLs: none configured. Production magic-link redirects are not configured for `https://hero-islands-family.vercel.app/`.
- CAPTCHA protection: disabled.
- Sign-up/sign-in rate limit: 30 requests per five minutes per IP. Token verification: 30 per five minutes per IP. Refresh: 150 per five minutes per IP. Thus authentication is not entirely unthrottled, but these are not database write limits.
- No settings, policies, tables, users or records were changed. No private keys or passwords were requested.

Next steps: fix the app's two reproduced authentication/synchronization issues; apply a reviewed save-table migration with ownership policies and size constraints; configure production authentication redirects; arrange supported CAPTCHA integration if enabling the server requirement; verify isolation with two disposable test families. These checks do not certify unrelated projects, internal schemas, storage policies or all platform controls.
