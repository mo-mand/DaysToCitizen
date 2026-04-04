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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420" font-family="monospace, sans-serif" font-size="13">
  <!-- Background -->
  <rect width="800" height="420" fill="#f8fafc" rx="12"/>
  <text x="400" y="30" text-anchor="middle" font-size="15" font-weight="bold" fill="#1e293b">DaysToCitizen — System Architecture</text>

  <!-- Browser -->
  <rect x="30" y="60" width="140" height="70" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="100" y="90" text-anchor="middle" font-weight="bold" fill="#1d4ed8">Browser</text>
  <text x="100" y="108" text-anchor="middle" font-size="11" fill="#3b82f6">React / Next.js</text>
  <text x="100" y="122" text-anchor="middle" font-size="11" fill="#3b82f6">localStorage</text>

  <!-- Arrow: Browser → Nginx -->
  <line x1="170" y1="95" x2="230" y2="95" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="200" y="88" text-anchor="middle" font-size="10" fill="#64748b">HTTPS:443</text>

  <!-- Nginx -->
  <rect x="230" y="60" width="130" height="70" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="295" y="90" text-anchor="middle" font-weight="bold" fill="#15803d">Nginx</text>
  <text x="295" y="108" text-anchor="middle" font-size="11" fill="#16a34a">Reverse Proxy</text>
  <text x="295" y="122" text-anchor="middle" font-size="11" fill="#16a34a">SSL Termination</text>

  <!-- Arrow: Nginx → Next.js -->
  <line x1="360" y1="95" x2="420" y2="95" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="390" y="88" text-anchor="middle" font-size="10" fill="#64748b">:3000</text>

  <!-- Next.js App -->
  <rect x="420" y="40" width="160" height="180" rx="8" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
  <text x="500" y="65" text-anchor="middle" font-weight="bold" fill="#854d0e">Next.js 15</text>
  <text x="500" y="83" text-anchor="middle" font-size="11" fill="#92400e">App Router</text>
  <rect x="435" y="92" width="130" height="22" rx="4" fill="#fde68a"/>
  <text x="500" y="107" text-anchor="middle" font-size="11" fill="#78350f">Pages + Components</text>
  <rect x="435" y="120" width="130" height="22" rx="4" fill="#fde68a"/>
  <text x="500" y="135" text-anchor="middle" font-size="11" fill="#78350f">API Routes</text>
  <rect x="435" y="148" width="130" height="22" rx="4" fill="#fde68a"/>
  <text x="500" y="163" text-anchor="middle" font-size="11" fill="#78350f">Auth + OTP Logic</text>
  <rect x="435" y="176" width="130" height="36" rx="4" fill="#fde68a"/>
  <text x="500" y="191" text-anchor="middle" font-size="11" fill="#78350f">PM2 Process</text>
  <text x="500" y="205" text-anchor="middle" font-size="11" fill="#78350f">Manager</text>

  <!-- Arrow: Next.js → DB -->
  <line x1="580" y1="120" x2="640" y2="120" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- DB -->
  <rect x="640" y="90" width="130" height="60" rx="8" fill="#fce7f3" stroke="#db2777" stroke-width="1.5"/>
  <text x="705" y="118" text-anchor="middle" font-weight="bold" fill="#be185d">JSON DB</text>
  <text x="705" y="136" text-anchor="middle" font-size="11" fill="#db2777">.data/db.json</text>

  <!-- Arrow: Next.js → Resend -->
  <line x1="500" y1="220" x2="500" y2="280" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow)"/>

  <!-- Resend -->
  <rect x="420" y="280" width="160" height="60" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="500" y="308" text-anchor="middle" font-weight="bold" fill="#5b21b6">Resend API</text>
  <text x="500" y="326" text-anchor="middle" font-size="11" fill="#7c3aed">OTP Email Delivery</text>

  <!-- Let's Encrypt -->
  <rect x="230" y="180" width="130" height="50" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
  <text x="295" y="203" text-anchor="middle" font-weight="bold" fill="#0369a1">Let's Encrypt</text>
  <text x="295" y="220" text-anchor="middle" font-size="11" fill="#0284c7">TLS Certificate</text>
  <line x1="295" y1="180" x2="295" y2="130" stroke="#0284c7" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#arrowblue)"/>

  <!-- EC2 bounding box -->
  <rect x="210" y="25" width="580" height="370" rx="10" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="790" y="45" text-anchor="end" font-size="11" fill="#ea580c" font-weight="bold">AWS EC2 t3.micro</text>
  <text x="790" y="58" text-anchor="end" font-size="10" fill="#ea580c">Ubuntu 24 · Elastic IP</text>

  <!-- Namecheap DNS -->
  <rect x="30" y="200" width="140" height="50" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="100" y="223" text-anchor="middle" font-weight="bold" fill="#b45309">Namecheap DNS</text>
  <text x="100" y="240" text-anchor="middle" font-size="11" fill="#d97706">A Record → Elastic IP</text>
  <line x1="140" y1="225" x2="230" y2="115" stroke="#d97706" stroke-width="1" stroke-dasharray="4,3"/>

  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#64748b"/>
    </marker>
    <marker id="arrowblue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#0284c7"/>
    </marker>
  </defs>
</svg>
```

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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 300" font-family="monospace, sans-serif" font-size="12">
  <rect width="700" height="300" fill="#f8fafc" rx="12"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Request Flow: Internet → Application</text>

  <!-- Internet -->
  <circle cx="60" cy="150" r="40" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="60" y="146" text-anchor="middle" font-weight="bold" fill="#1d4ed8">Inter</text>
  <text x="60" y="162" text-anchor="middle" font-weight="bold" fill="#1d4ed8">net</text>

  <!-- Arrow -->
  <line x1="100" y1="150" x2="150" y2="150" stroke="#64748b" stroke-width="2" marker-end="url(#a1)"/>
  <text x="125" y="143" text-anchor="middle" font-size="10" fill="#475569">:80/:443</text>

  <!-- Nginx box -->
  <rect x="150" y="100" width="150" height="100" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="225" y="130" text-anchor="middle" font-weight="bold" fill="#15803d">Nginx</text>
  <text x="225" y="148" text-anchor="middle" font-size="10" fill="#166534">① Terminate TLS</text>
  <text x="225" y="163" text-anchor="middle" font-size="10" fill="#166534">② HTTP→HTTPS redirect</text>
  <text x="225" y="178" text-anchor="middle" font-size="10" fill="#166534">③ Proxy to :3000</text>

  <!-- Arrow -->
  <line x1="300" y1="150" x2="350" y2="150" stroke="#64748b" stroke-width="2" marker-end="url(#a1)"/>
  <text x="325" y="143" text-anchor="middle" font-size="10" fill="#475569">:3000</text>

  <!-- PM2 + Next.js -->
  <rect x="350" y="80" width="160" height="140" rx="8" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
  <text x="430" y="108" text-anchor="middle" font-weight="bold" fill="#854d0e">PM2</text>
  <text x="430" y="125" text-anchor="middle" font-size="10" fill="#92400e">Process Manager</text>
  <rect x="365" y="133" width="130" height="40" rx="4" fill="#fde68a"/>
  <text x="430" y="151" text-anchor="middle" font-size="11" fill="#78350f">Next.js Server</text>
  <text x="430" y="166" text-anchor="middle" font-size="10" fill="#78350f">node server.js</text>
  <text x="430" y="200" text-anchor="middle" font-size="10" fill="#92400e">Auto-restart on crash</text>
  <text x="430" y="213" text-anchor="middle" font-size="10" fill="#92400e">Starts on boot</text>

  <!-- Arrow to disk -->
  <line x1="510" y1="150" x2="560" y2="150" stroke="#64748b" stroke-width="2" marker-end="url(#a1)"/>

  <!-- Disk -->
  <rect x="560" y="115" width="110" height="70" rx="8" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>
  <text x="615" y="145" text-anchor="middle" font-weight="bold" fill="#be185d">Disk</text>
  <text x="615" y="162" text-anchor="middle" font-size="10" fill="#db2777">.data/db.json</text>
  <text x="615" y="176" text-anchor="middle" font-size="10" fill="#db2777">users + stays + otps</text>

  <!-- Certbot annotation -->
  <rect x="150" y="220" width="150" height="50" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
  <text x="225" y="243" text-anchor="middle" font-weight="bold" fill="#0369a1">Certbot</text>
  <text x="225" y="259" text-anchor="middle" font-size="10" fill="#0284c7">Auto-renews cert every 90d</text>
  <line x1="225" y1="220" x2="225" y2="200" stroke="#0284c7" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#ablue)"/>

  <defs>
    <marker id="a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b"/></marker>
    <marker id="ablue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#0284c7"/></marker>
  </defs>
</svg>
```

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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 200" font-family="monospace, sans-serif" font-size="12">
  <rect width="700" height="200" fill="#f8fafc" rx="12"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Inclusive Day Counting — IRCC Rule</text>

  <!-- Timeline bar -->
  <rect x="50" y="70" width="600" height="30" rx="4" fill="#e2e8f0"/>

  <!-- Canada segment -->
  <rect x="50" y="70" width="150" height="30" rx="4" fill="#bbf7d0"/>
  <text x="125" y="90" text-anchor="middle" font-size="11" fill="#166534">In Canada</text>

  <!-- Trip segment -->
  <rect x="200" y="70" width="200" height="30" fill="#fecaca"/>
  <text x="300" y="90" text-anchor="middle" font-size="11" fill="#991b1b">Outside Canada</text>

  <!-- Canada segment 2 -->
  <rect x="400" y="70" width="250" height="30" rx="4" fill="#bbf7d0"/>
  <text x="525" y="90" text-anchor="middle" font-size="11" fill="#166534">In Canada</text>

  <!-- Day markers -->
  <line x1="200" y1="60" x2="200" y2="115" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,3"/>
  <line x1="400" y1="60" x2="400" y2="115" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,3"/>

  <text x="200" y="130" text-anchor="middle" font-size="11" fill="#dc2626">Entry: Mar 29</text>
  <text x="200" y="145" text-anchor="middle" font-size="10" fill="#dc2626">counts as day 1</text>

  <text x="400" y="130" text-anchor="middle" font-size="11" fill="#dc2626">Exit: Mar 31</text>
  <text x="400" y="145" text-anchor="middle" font-size="10" fill="#dc2626">counts as day 3</text>

  <!-- Formula -->
  <rect x="220" y="158" width="260" height="30" rx="6" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
  <text x="350" y="178" text-anchor="middle" font-size="12" fill="#854d0e">differenceInDays(exit, entry) + 1 = 3</text>
</svg>
```

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

> **Screenshot placeholder 2**: The two-step auth modal — first step (email entry) and second step (6-digit code entry).

The initial auth implementation had a critical security flaw: submitting any email address immediately created a session. Anyone who knew another user's email could access their data.

The fix implements a standard **email OTP flow**:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 340" font-family="monospace, sans-serif" font-size="12">
  <rect width="720" height="340" fill="#f8fafc" rx="12"/>
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">OTP Authentication Flow</text>

  <!-- Actors -->
  <rect x="30" y="50" width="90" height="30" rx="6" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="75" y="70" text-anchor="middle" font-weight="bold" fill="#1d4ed8">Browser</text>

  <rect x="290" y="50" width="130" height="30" rx="6" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
  <text x="355" y="70" text-anchor="middle" font-weight="bold" fill="#854d0e">Next.js API</text>

  <rect x="560" y="50" width="100" height="30" rx="6" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="610" y="70" text-anchor="middle" font-weight="bold" fill="#5b21b6">Resend</text>

  <!-- Lifelines -->
  <line x1="75" y1="80" x2="75" y2="320" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="355" y1="80" x2="355" y2="320" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="610" y1="80" x2="610" y2="320" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Step 1 -->
  <line x1="75" y1="110" x2="345" y2="110" stroke="#3b82f6" stroke-width="2" marker-end="url(#ab)"/>
  <text x="210" y="105" text-anchor="middle" fill="#1d4ed8">POST /api/auth/send-otp {email}</text>

  <!-- Step 2: Generate OTP -->
  <rect x="290" y="120" width="130" height="24" rx="4" fill="#fde68a"/>
  <text x="355" y="136" text-anchor="middle" font-size="10" fill="#78350f">Generate 6-digit code + expiry</text>

  <!-- Step 3: Save OTP -->
  <rect x="290" y="150" width="130" height="24" rx="4" fill="#fde68a"/>
  <text x="355" y="164" text-anchor="middle" font-size="10" fill="#78350f">Save to db.otps[]</text>

  <!-- Step 4: Send email -->
  <line x1="355" y1="185" x2="600" y2="185" stroke="#7c3aed" stroke-width="2" marker-end="url(#av)"/>
  <text x="480" y="180" text-anchor="middle" fill="#5b21b6">Send OTP email</text>

  <!-- Step 5: 200 back to browser -->
  <line x1="345" y1="205" x2="85" y2="205" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#ag)"/>
  <text x="210" y="200" text-anchor="middle" fill="#475569">{sent: true} → show code input</text>

  <!-- Step 6: User submits code -->
  <line x1="75" y1="235" x2="345" y2="235" stroke="#3b82f6" stroke-width="2" marker-end="url(#ab)"/>
  <text x="210" y="229" text-anchor="middle" fill="#1d4ed8">POST /api/auth/verify-otp {email, code}</text>

  <!-- Step 7: Validate -->
  <rect x="290" y="245" width="130" height="24" rx="4" fill="#fde68a"/>
  <text x="355" y="261" text-anchor="middle" font-size="10" fill="#78350f">Validate code + expiry, consume</text>

  <!-- Step 8: Issue JWT -->
  <line x1="345" y1="285" x2="85" y2="285" stroke="#16a34a" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#ag2)"/>
  <text x="210" y="280" text-anchor="middle" fill="#15803d">Set httpOnly JWT cookie → logged in</text>

  <defs>
    <marker id="ab" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#3b82f6"/></marker>
    <marker id="av" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7c3aed"/></marker>
    <marker id="ag" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b"/></marker>
    <marker id="ag2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#16a34a"/></marker>
  </defs>
</svg>
```

The OTP is stored in the same JSON database as users and stays (`db.otps[]`), with the code consumed on first use — preventing replay attacks. Codes expire in 10 minutes.

**Why not OAuth (Google/GitHub sign-in)?** OAuth is excellent but introduces an external dependency and requires users to have a Google or GitHub account. Many of our target users — recent immigrants — may not have English-primary accounts or may distrust social login for immigration-related data. Email OTP is universal.

---

## Internationalization: 23 Languages Without Breaking Layout

> **Screenshot placeholder 3**: The app in Farsi (RTL) vs. English — same layout, opposite text direction.

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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 220" font-family="monospace, sans-serif" font-size="12">
  <rect width="700" height="220" fill="#f8fafc" rx="12"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">i18n Architecture — Language Context Flow</text>

  <!-- LanguageContext -->
  <rect x="270" y="50" width="160" height="50" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="350" y="72" text-anchor="middle" font-weight="bold" fill="#5b21b6">LanguageContext</text>
  <text x="350" y="89" text-anchor="middle" font-size="10" fill="#7c3aed">{ t, lang, setLang }</text>

  <!-- Arrows down -->
  <line x1="300" y1="100" x2="160" y2="140" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#avc)"/>
  <line x1="330" y1="100" x2="280" y2="140" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#avc)"/>
  <line x1="360" y1="100" x2="400" y2="140" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#avc)"/>
  <line x1="390" y1="100" x2="540" y2="140" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#avc)"/>

  <!-- Components -->
  <rect x="80" y="140" width="110" height="40" rx="6" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
  <text x="135" y="158" text-anchor="middle" font-size="11" fill="#854d0e">Navbar</text>
  <text x="135" y="172" text-anchor="middle" font-size="10" fill="#92400e">t.tagline</text>

  <rect x="210" y="140" width="110" height="40" rx="6" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
  <text x="265" y="158" text-anchor="middle" font-size="11" fill="#854d0e">CountdownCard</text>
  <text x="265" y="172" text-anchor="middle" font-size="10" fill="#92400e">t.daysNeeded…</text>

  <rect x="340" y="140" width="110" height="40" rx="6" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
  <text x="395" y="158" text-anchor="middle" font-size="11" fill="#854d0e">ManageStays</text>
  <text x="395" y="172" text-anchor="middle" font-size="10" fill="#92400e">t.backToDashboard…</text>

  <rect x="470" y="140" width="110" height="40" rx="6" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
  <text x="525" y="158" text-anchor="middle" font-size="11" fill="#854d0e">StatsCards</text>
  <text x="525" y="172" text-anchor="middle" font-size="10" fill="#92400e">t.eligibleDaysOf…</text>

  <!-- 23 language files -->
  <rect x="200" y="195" width="300" height="18" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="350" y="208" text-anchor="middle" font-size="11" fill="#15803d">23 language files: en, fr, fa, ar, zh, hi, pa, ur, ko… (+ RTL detection)</text>

  <defs>
    <marker id="avc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7c3aed"/></marker>
  </defs>
</svg>
```

**Trade-off accepted:** Machine-translated strings for less-common languages. Native speakers may spot imperfect phrasing. The decision was pragmatic — the alternative (hiring 23 translators) is not viable at v1 — and users are far better served by imperfect translation than by an English-only interface.

---

## Data Architecture: Local-First with Cloud Sync

> **Screenshot placeholder 4**: The sign-in modal mid-migration — showing the "your local data will be saved to your account" message.

The app follows a **local-first** model:

1. Anonymous users get full functionality — stays are stored in `localStorage`
2. On sign-in, local stays are migrated to the server in a single batch
3. Signed-in users read from the server; local storage is cleared

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 210" font-family="monospace, sans-serif" font-size="12">
  <rect width="700" height="210" fill="#f8fafc" rx="12"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Data Storage — Anonymous vs Authenticated</text>

  <!-- Anonymous -->
  <rect x="30" y="50" width="290" height="140" rx="10" fill="#fff7ed" stroke="#f97316" stroke-width="2"/>
  <text x="175" y="72" text-anchor="middle" font-weight="bold" fill="#c2410c">Anonymous User</text>
  <rect x="50" y="82" width="250" height="35" rx="6" fill="#fed7aa"/>
  <text x="175" y="100" text-anchor="middle" fill="#9a3412">Stays → localStorage</text>
  <text x="175" y="115" text-anchor="middle" font-size="10" fill="#c2410c">(browser only, lost if cleared)</text>
  <rect x="50" y="125" width="250" height="35" rx="6" fill="#fed7aa"/>
  <text x="175" y="143" text-anchor="middle" fill="#9a3412">Calculations: client-side only</text>
  <text x="175" y="158" text-anchor="middle" font-size="10" fill="#c2410c">No account, no server calls</text>
  <text x="175" y="180" text-anchor="middle" font-size="10" fill="#c2410c" font-style="italic">Full functionality ✓</text>

  <!-- Migration arrow -->
  <line x1="320" y1="120" x2="380" y2="120" stroke="#16a34a" stroke-width="2.5" marker-end="url(#amg)"/>
  <text x="350" y="113" text-anchor="middle" font-size="10" fill="#15803d">Sign in</text>
  <text x="350" y="133" text-anchor="middle" font-size="10" fill="#15803d">migrate</text>

  <!-- Authenticated -->
  <rect x="380" y="50" width="290" height="140" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <text x="525" y="72" text-anchor="middle" font-weight="bold" fill="#15803d">Authenticated User</text>
  <rect x="400" y="82" width="250" height="35" rx="6" fill="#bbf7d0"/>
  <text x="525" y="100" text-anchor="middle" fill="#166534">Stays → .data/db.json (server)</text>
  <text x="525" y="115" text-anchor="middle" font-size="10" fill="#15803d">(persistent, synced across devices)</text>
  <rect x="400" y="125" width="250" height="35" rx="6" fill="#bbf7d0"/>
  <text x="525" y="143" text-anchor="middle" fill="#166534">API: /api/trips (GET/POST/DELETE)</text>
  <text x="525" y="158" text-anchor="middle" font-size="10" fill="#15803d">JWT session cookie (90 days)</text>
  <text x="525" y="180" text-anchor="middle" font-size="10" fill="#15803d" font-style="italic">Data portable across browsers ✓</text>

  <defs>
    <marker id="amg" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#16a34a"/></marker>
  </defs>
</svg>
```

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
