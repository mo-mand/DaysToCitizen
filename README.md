# DaysToCitizen

**Track your physical presence in Canada and count down to citizenship eligibility.**

Free, open-source Canadian citizenship day tracker — enter your trips outside Canada and instantly see how many days remain until you can apply.

🌐 [daystocitizen.ca](https://daystocitizen.ca)

---

## Features

- **Instant countdown** — years, months, and days remaining to eligibility
- **Trip tracking** — record absences from Canada; app calculates your in-Canada days automatically
- **Canadian law accuracy** — PR days count fully; pre-PR days (visitor/work/study) count at 50%, capped at 365
- **5-year rolling window** — automatically applied per IRCC rules
- **No-account mode** — data stored locally for up to 3 months; no sign-up required
- **Passwordless auth** — sign in with just your email (one-time code, no password)
- **Multilingual** — English 🇨🇦 and French 🇫🇷 (more languages welcome via PRs)
- **Open source** — self-host it, fork it, improve it

---

## How Canadian Citizenship Eligibility Works

You must be **physically present in Canada for at least 1,095 days (3 years)** within the 5 years immediately before you apply.

| Status during stay | Days counted |
|---|---|
| Permanent Resident | Full (1:1) |
| Visitor / Work / Study Permit | Half (1:0.5), max 365 credited days |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/mo-mand/daystocitizen.git
cd daystocitizen
npm install
cp .env.example .env.local
# Edit .env.local — set JWT_SECRET at minimum
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Email OTP (optional)

Without a `RESEND_API_KEY`, the app works in **dev mode**: OTP codes are printed to the server console instead of emailed. This is fine for local development.

For production, create a free account at [resend.com](https://resend.com), verify your domain, and set `RESEND_API_KEY` in your environment.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | Yes | Long random string for signing session tokens |
| `RESEND_API_KEY` | No | Resend API key for emailing OTPs |
| `EMAIL_FROM` | No | From address for OTP emails |
| `NEXT_PUBLIC_APP_URL` | No | Your app's public URL |

---

## Stack

- [Next.js 15](https://nextjs.org) — React framework
- [Tailwind CSS](https://tailwindcss.com) — styling
- [SQLite](https://www.sqlite.org) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — local database
- [Resend](https://resend.com) — transactional email (optional)
- [date-fns](https://date-fns.org) — date arithmetic
- [Framer Motion](https://www.framer.com/motion/) — animations

---

## Contributing

Pull requests are welcome! To add a new language, copy `src/i18n/en.ts`, translate the strings, and add it to `src/i18n/index.ts`.

Please open an issue before starting large features.

---

## License

MIT — free to use, modify, and self-host.

---

## Author

Built with care for the Canadian immigrant community.

**Mo Mand**  
[github.com/mo-mand](https://github.com/mo-mand) · [linkedin.com/in/mo-mand](https://www.linkedin.com/in/mo-mand/) · Mo.Mand.Ops@Gmail.com

> *This tool is for informational purposes only. Always verify your eligibility with official [IRCC](https://www.canada.ca/en/immigration-refugees-citizenship.html) guidelines before applying.*
