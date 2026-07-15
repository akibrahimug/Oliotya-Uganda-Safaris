# Clerk Production Instance Setup

## Why this is needed

Production is currently running **Clerk development keys** (`pk_test_...`, instance
`beloved-tetra-56.clerk.accounts.dev`). Development instances:

- 307-redirect every first-time browser visit on Clerk-matched routes through
  `beloved-tetra-56.clerk.accounts.dev/v1/client/handshake` (the "dev browser" token
  dance). That endpoint is `noindex`, and until July 2026 this ran on **every** route —
  it is what kept the entire site out of Google (GSC "Excluded by 'noindex' tag" +
  "Redirect error" on all pages, 0 indexed).
- Are capped (max users, no SLA) and show a "Development mode" banner on sign-in.
- Share one user pool with local development.

The middleware fix (July 2026) scoped Clerk to `/cms`, `/cms-test`, `/sign-in`,
`/sign-up`, `/bundle-packages`, and `/api|/trpc` only, which unblocked Google. But the
CMS sign-in and `/bundle-packages` still run through the dev instance until the steps
below are done.

## Steps

### 1. Create the production instance in Clerk

1. Go to <https://dashboard.clerk.com> → application **beloved-tetra-56** (the app used
   by this project).
2. In the instance switcher (top of the page, says **Development**), choose
   **Create production instance** → **Clone development settings**.
3. When asked for the domain, enter: `oliotyaugandasafaris.com`
   (Clerk derives `clerk.oliotyaugandasafaris.com` and `accounts.oliotyaugandasafaris.com`
   from it).

### 2. Add DNS records at mijndomein.nl

DNS for `oliotyaugandasafaris.com` is hosted at **mijndomein.nl** (not Vercel). Clerk's
dashboard (**Configure → Domains**, in the production instance) lists the exact records;
they will look like:

| Type  | Host / Name        | Value                        |
|-------|--------------------|------------------------------|
| CNAME | `clerk`            | `frontend-api.clerk.services` |
| CNAME | `accounts`         | `accounts.clerk.services`     |
| CNAME | `clkmail`          | `mail.<hash>.clerk.services`  |
| CNAME | `clk._domainkey`   | `dkim1.<hash>.clerk.services` |
| CNAME | `clk2._domainkey`  | `dkim2.<hash>.clerk.services` |

⚠️ `clerk.oliotyaugandasafaris.com` currently resolves to a mijndomein parking record
(`213.249.67.10`) — likely a wildcard `*` A record. The `clerk` CNAME must **replace**
whatever answers for that name, or Clerk's verification will fail.

Back in Clerk → **Domains**, click **Verify** and wait until all records show verified
and SSL certificates are issued (can take minutes to a few hours after DNS propagates).

### 3. Update Vercel environment variables (Production ONLY)

Clerk production instance → **Configure → API keys** → copy both keys, then in
Vercel → `fox-adventures` → **Settings → Environment Variables**:

| Variable                            | Value       | Environment    |
|-------------------------------------|-------------|----------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_…` | Production     |
| `CLERK_SECRET_KEY`                  | `sk_live_…` | Production     |

Leave the `pk_test_`/`sk_test_` values on **Preview** and **Development** so local dev
and preview deploys keep using the dev instance.

If Clerk webhooks are used (`app/api/webhooks/clerk/route.ts` exists): in the
production instance create a webhook endpoint pointing at
`https://www.oliotyaugandasafaris.com/api/webhooks/clerk` and put its signing secret in
`CLERK_WEBHOOK_SECRET` (Production).

### 4. Redeploy

Env var changes do not apply to existing deployments — trigger a redeploy
(Deployments → ⋯ → Redeploy, or push a commit).

### 5. Recreate the admin user

Production instances start with an **empty user pool** — dev users do not carry over.

1. Sign up at `https://www.oliotyaugandasafaris.com/sign-up` with the admin email.
2. Clerk dashboard (production instance) → **Users** → select the user → **Metadata** →
   public metadata: `{ "role": "admin" }`.
   (The CMS layout grants access on `publicMetadata.role === "admin"` or an `org:admin`
   membership.)
3. If social sign-in (Google etc.) is enabled, production instances require your own
   OAuth credentials — Clerk's shared dev credentials don't work in production. Configure
   under **Configure → SSO connections**.

### 6. Test

- `https://www.oliotyaugandasafaris.com/cms` → sign in → CMS loads, no
  "Development mode" banner.
- `curl -sI https://www.oliotyaugandasafaris.com/cms` should no longer reference
  `accounts.dev` in any redirect.
