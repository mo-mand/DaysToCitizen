# Building DaysToCitizen: A Full-Stack Canadian Citizenship Tracker from Zero to Production

*A technical, architectural, and business deep-dive into building a real product — covering date math edge cases, 23-language i18n, secure OTP authentication, and deploying to AWS with HTTPS.*

---

## The Problem Worth Solving

Every year, tens of thousands of people receive Canadian Permanent Residency. Before they can apply for citizenship, they must prove **1,095 days of physical presence in Canada** within the last 5 years — a number tracked by IRCC (Immigration, Refugees and Citizenship Canada). The stakes are high: miscounting can mean rejection, delays of months, or being locked out of citizenship entirely.

Most immigrants track this in spreadsheets, notes apps, or simply rely on memory. There is no free, accurate, multilingual tool that does this correctly — accounting for IRCC's own counting rules (both arrival and departure days count), multiple immigration statuses, and the complexity of living between countries.

**DaysToCitizen** solves this. It is a free web application where immigrants enter their trips outside Canada and instantly see their eligibility countdown, how many days they've accumulated, and how many they still need.

> **Screenshot placeholder 1**: The main dashboard showing the countdown card and stats with a sample data set.

**Measurable outcomes:**
- A user who would have miscounted by even 2–3 days (common with off-by-one errors in manual tracking) could incorrectly believe they qualify — or unnecessarily delay applying
- With 23 supported languages including Farsi, Arabic, Punjabi, Hindi, Urdu, and Chinese, the tool reaches immigrants in their own language — the majority of Canada's new PRs come from these language groups
- Zero cost to users, zero ads, privacy-first (data stays local unless they choose to create an account)

---

## Technical Stack — What We Chose and Why

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + API routes in one repo, no separate backend |
| Language | TypeScript | Catch bugs at compile time, especially date math |
| Styling | Tailwind CSS | Fast iteration, no CSS files to manage |
| Date math | date-fns | Explicit, immutable, tree-shakeable |
| Auth | JWT + OTP via Resend | Passwordless, no OAuth dependency |
| Storage | JSON flat file (`.data/db.json`) | No database server, survives on a t3.micro |
| Deployment | AWS EC2 + Nginx + PM2 | Full control, free tier eligible, HTTPS via certbot |

**The decision to avoid a database:** Most SaaS tutorials reach for PostgreSQL or MongoDB immediately. For a v1 with a single server and a user base measured in thousands, a JSON file protected by file-system writes is entirely sufficient — and eliminates an entire class of infrastructure complexity. The trade-off is no horizontal scaling and no concurrent write safety, but for a single-instance personal-data app this is the right call.

---

## Architecture Overview

![System Architecture](diagrams/01.svg)

---

## Cloud Architecture — A Deep Dive

This section is intentionally detailed for engineers evaluating the same decisions.

### The Infrastructure Choice: EC2 vs. Serverless vs. PaaS

Three options were on the table:

**Option A — Vercel (PaaS):** The natural home for Next.js. Zero-config deploy, automatic HTTPS, global CDN. The trade-off: Vercel's free tier does not support persistent filesystem writes — our entire flat-file database approach would fail. Moving to a managed database (PlanetScale, Supabase, Neon) adds cost and complexity that isn't justified at v1.

**Option B — AWS Lambda + API Gateway (Serverless):** Maximum scalability, pay-per-request. The trade-off: cold starts, inability to write to disk, no persistent process state, and a significantly more complex deployment pipeline. Also overkill — a citizenship tracker does not need to handle 10,000 concurrent users at launch.

**Option C — AWS EC2 t3.micro (chosen):** A persistent virtual machine. Full control over the filesystem, process management, and network. Free for 12 months under AWS Free Tier. The trade-off: manual operations (upgrades, restarts, certificate renewal), single point of failure, no auto-scaling.

**Decision rationale:** The flat-file database was the deciding constraint. It requires a persistent disk and a single process. EC2 is the only option that satisfies this at zero marginal cost. When the app scales and a real database is warranted, migration to a serverless or container-based architecture becomes straightforward.

### Network Layer: Nginx as Reverse Proxy

![Request Flow](diagrams/02.svg)

Next.js runs on port 3000, bound only to `localhost`. Nginx listens on ports 80 and 443 and forwards traffic. This is a critical security pattern — the application process is never directly exposed to the internet.

**Why PM2?** Node.js is single-threaded and crashes are possible. PM2 is a process manager that:
- Restarts the app if it crashes
- Starts it automatically on server reboot (`pm2 startup` + `pm2 save`)
- Provides log aggregation and monitoring

**HTTPS via Let's Encrypt:** Certbot's `--nginx` flag is elegant — it reads the Nginx config, finds the matching `server_name`, generates a certificate, modifies the config to add SSL directives, and sets up an auto-renewing systemd timer. Certificates expire every 90 days; renewal is fully automated.

### DNS Architecture: Namecheap + Elastic IP

A subtle but important AWS decision: EC2 instances get a new public IP every time they restart unless you assign an **Elastic IP**. Without it, your DNS records break every time the instance stops. Elastic IPs are free as long as they're attached to a running instance.

The Namecheap DNS configuration:
- `A @ → 3.146.98.97` (root domain)
- `A www → 3.146.98.97` (www subdomain)
- `TXT/MX records for verification.daystocitizen.ca` (Resend email subdomain)

Using a subdomain (`verification.daystocitizen.ca`) for transactional email is best practice — it isolates email reputation from the main domain's web reputation.

---

## The Day Counting Problem

This was the most technically challenging part of the project, going through six iterations before being correct.

**IRCC rule:** Both arrival and departure days count as full days in Canada. A trip from March 29 to March 31 = 3 days abroad (not 2), so 3 days are deducted from your eligible total.

> **Screenshot placeholder 2**: The ManageStays page showing a sample trip and its day count.

**The `daysToYMD` overflow bug:** Converting a raw number of days to years/months/days sounds trivial. It isn't. Using calendar-based approaches (`intervalToDuration` from date-fns) introduced leap year errors — 1,095 days is not exactly 3 calendar years. The final solution uses pure arithmetic:

```typescript
export function daysToYMD(days: number) {
  const years = Math.floor(days / 365);
  const remainingAfterYears = days - years * 365;
  const months = Math.floor(remainingAfterYears * 12 / 365);
  const remainingDays = remainingAfterYears - Math.round(months * 365 / 12);
  return { years, months, days: remainingDays };
}
```

The key insight: using `Math.round` (not `Math.floor`) when converting months back to days prevents accumulation of rounding errors that would otherwise cause months to show as 12 instead of rolling over to the next year.

---

## Authentication: From Zero to Verified OTP

> **Screenshot placeholder 3**: The two-step auth modal — first step (email entry) and second step (6-digit code entry).

The initial auth implementation had a critical security flaw: submitting any email address immediately created a session. Anyone who knew another user's email could access their data.

The fix implements a standard **email OTP flow**:

![OTP Authentication Flow](diagrams/03.svg)

The OTP is stored in the same JSON database as users and stays (`db.otps[]`), with the code consumed on first use — preventing replay attacks. Codes expire in 10 minutes.

**Why not OAuth (Google/GitHub sign-in)?** OAuth is excellent but introduces an external dependency and requires users to have a Google or GitHub account. Many of our target users — recent immigrants — may not have English-primary accounts or may distrust social login for immigration-related data. Email OTP is universal.

---

## Internationalization: 23 Languages Without Breaking Layout

> **Screenshot placeholder 4**: The app in Farsi (RTL) vs. English — same layout, opposite text direction.

Supporting 23 languages including RTL (right-to-left) scripts like Arabic, Farsi, and Urdu required solving a non-obvious CSS problem.

**The RTL trap:** Setting `dir="rtl"` on the `<html>` element does flip text correctly — but it also reverses Flexbox and Grid directions, breaking the entire card layout. Every `flex-row` becomes right-to-left, column orders flip, and the UI looks broken.

**The solution:** Use a custom `data-dir` attribute instead of `dir`, and apply directional CSS only to text elements:

```css
[data-dir="rtl"] p, h1, h2, h3, span, label, button, a {
  direction: rtl;
  text-align: right;
}
[data-dir="rtl"] input, select, textarea {
  direction: ltr; /* keep inputs LTR for usability */
}
```

This applies text directionality without touching layout directionality. The columns stay where they are; the text inside them flows correctly.

![i18n Architecture](diagrams/04.svg)

**Trade-off accepted:** Machine-translated strings for less-common languages. Native speakers may spot imperfect phrasing. The decision was pragmatic — the alternative (hiring 23 translators) is not viable at v1 — and users are far better served by imperfect translation than by an English-only interface.

---

## Data Architecture: Local-First with Cloud Sync

The app follows a **local-first** model:

1. Anonymous users get full functionality — stays are stored in `localStorage`
2. On sign-in, local stays are migrated to the server in a single batch
3. Signed-in users read from the server; local storage is cleared

![Data Storage Architecture](diagrams/05.svg)

**Why local-first?** It eliminates the login barrier. A user can come to the site, enter all their trips, and see their citizenship countdown — all without creating an account. Sign-up only becomes relevant when they want to save permanently or access from another device. This dramatically reduces abandonment.

---

## Key Problems Solved

| Problem | Root Cause | Fix |
|---|---|---|
| "3 years 15 days" on empty page | `1095 % 30 = 15` (wrong modulo) | Arithmetic formula: `÷365` for years first |
| `daysToYMD` showing "12 months" | Rounding error in month→day conversion | `Math.round` instead of `Math.floor` |
| `crypto.randomUUID` crashing on HTTP | Browser security restriction; also `this` binding lost when method extracted | Replaced with `Date.now().toString(36) + Math.random()` |
| RTL breaking card layout | `dir="rtl"` on `<html>` reverses all Flex/Grid | Custom `data-dir` attribute; CSS targets only text elements |
| Anyone could log in as any user | OTP was bypassed; email = instant session | Real OTP: generate → email → verify → then issue JWT |
| ManageStays page not translating | All strings were hardcoded English | `useLanguage()` hook added to both `EditRow` and main component |

---

## What's Next

- **PostgreSQL migration:** When concurrent users or multi-instance deployment becomes necessary, the flat-file DB is the first thing to replace. The abstraction layer (`db.ts`) means this is a single-file swap.
- **Push notifications:** The reminder infrastructure (banner + email cooldown) is built. Browser push notifications for citizenship deadline proximity is the next logical step.
- **Resend domain reputation:** A dedicated article on configuring Resend with custom domains, SPF/DKIM/DMARC, and deliverability best practices.
- **Mobile app:** The calculation logic is framework-agnostic TypeScript — it could be extracted and used in a React Native app without changes.

> **Screenshot placeholder 5**: The live site at daystocitizen.ca with HTTPS padlock visible in the browser bar.

---

## Summary

DaysToCitizen demonstrates that a production-grade, secure, multilingual web application can be built and deployed at zero marginal cost on AWS Free Tier. The architectural decisions — flat-file DB, single EC2 instance, local-first storage — are not shortcuts; they are deliberate trade-offs appropriate for v1 of a product with unknown demand. The security is real: verified OTP authentication, httpOnly JWT cookies, HTTPS with auto-renewing certificates, and zero third-party tracking. And critically, the product solves a real problem for a real and underserved audience: immigrants navigating one of the most consequential bureaucratic processes of their lives.
