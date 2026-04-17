import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Track Canadian Citizenship Days — DaysToCitizen Help',
  description:
    'Learn how IRCC counts physical presence for citizenship eligibility. Step-by-step guide to tracking your 1,095 days in Canada as a Permanent Resident.',
  keywords: [
    'Canadian citizenship physical presence',
    'IRCC 1095 days',
    'permanent resident citizenship tracker',
    'how to count days for Canadian citizenship',
    'citizenship eligibility calculator Canada',
  ],
  openGraph: {
    title: 'How to Track Canadian Citizenship Days — DaysToCitizen',
    description:
      'IRCC requires 1,095 days of physical presence in Canada within 5 years. Learn exactly how to count them and avoid costly mistakes.',
    url: 'https://daystocitizen.ca/help',
    siteName: 'DaysToCitizen',
    type: 'article',
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h2>
      {children}
    </section>
  );
}

function Q({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{q}</h3>
      <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      {/* Hero */}
      <div className="mb-12">
        <Link href="/" className="text-sm text-purple-600 hover:text-purple-800 hover:underline mb-4 inline-block">
          ← Back to DaysToCitizen
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          How to Track Your Days for Canadian Citizenship
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Canada requires Permanent Residents to accumulate <strong>1,095 days of physical presence</strong> within
          any 5-year period before applying for citizenship. This guide explains exactly how IRCC counts those days
          and how DaysToCitizen helps you track them without spreadsheets.
        </p>
      </div>

      {/* The Rule */}
      <Section title="The IRCC Physical Presence Requirement">
        <p className="text-gray-600 leading-relaxed mb-4">
          Under the <em>Citizenship Act</em>, every citizenship applicant must prove they were physically present in
          Canada for at least <strong>1,095 days</strong> (3 years) out of the 5 years immediately before their
          application date. This is calculated on a rolling basis — the 5-year window moves with your application
          date, not a fixed calendar period.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-semibold mb-1">Key rule: both the day you enter and the day you leave count as full days.</p>
          <p className="text-red-700 text-sm">
            If you fly into Toronto on March 1 and fly out on March 5, that counts as 5 days — not 3 or 4.
            This is one of the most common miscounting mistakes.
          </p>
        </div>
        <p className="text-gray-600 leading-relaxed">
          IRCC verifies your presence using passport stamps, travel history, tax records, and other documents.
          Understating or overstating your days — even accidentally — can result in application refusal or
          a finding of misrepresentation.
        </p>
      </Section>

      {/* PR vs Other Status */}
      <Section title="Permanent Resident Days vs. Other Status Days">
        <p className="text-gray-600 leading-relaxed mb-4">
          Not all days in Canada count equally. The Citizenship Act distinguishes between time spent as a
          Permanent Resident and time spent under other immigration statuses (student visa, work permit,
          visitor, protected person, etc.).
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Counts toward 1,095?</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white">
                <td className="px-4 py-3 text-gray-800">Permanent Resident</td>
                <td className="px-4 py-3 text-green-700 font-medium">Yes</td>
                <td className="px-4 py-3 text-gray-600">1 day = 1 day</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-800">Protected Person / Convention Refugee</td>
                <td className="px-4 py-3 text-green-700 font-medium">Yes (partial)</td>
                <td className="px-4 py-3 text-gray-600">2 days = 1 day (max 365 credited)</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 text-gray-800">Student / Work Permit / Visitor</td>
                <td className="px-4 py-3 text-green-700 font-medium">Yes (partial)</td>
                <td className="px-4 py-3 text-gray-600">2 days = 1 day (max 365 credited)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-800">Unauthorized / No Status</td>
                <td className="px-4 py-3 text-red-600 font-medium">No</td>
                <td className="px-4 py-3 text-gray-600">0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-sm">
          DaysToCitizen applies these rates automatically when you log each stay. Simply select your immigration
          status for each period and the math is handled for you.
        </p>
      </Section>

      {/* How to use */}
      <Section title="How to Use DaysToCitizen">
        <ol className="space-y-4 text-gray-600">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">1</span>
            <div>
              <strong className="text-gray-800">Open the app — no signup required.</strong> Your stays are saved
              locally in your browser. Create an account only if you want your data synced across devices.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">2</span>
            <div>
              <strong className="text-gray-800">Add your stays in Canada.</strong> Enter the entry date, exit date
              (leave blank if you&apos;re currently in Canada), and your immigration status at the time.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">3</span>
            <div>
              <strong className="text-gray-800">Read your dashboard.</strong> The countdown card shows how many
              more days you need. The progress bar shows your 5-year window. Stats cards break down credited vs.
              total days.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">4</span>
            <div>
              <strong className="text-gray-800">Update as you travel.</strong> Add a new stay every time you
              return to Canada. The calculation updates instantly.
            </div>
          </li>
        </ol>
      </Section>

      {/* FAQ */}
      <Section title="Frequently Asked Questions">
        <Q q="Do I count the day I arrive and the day I leave?">
          <p>
            Yes. IRCC counts both the arrival day and the departure day as full days of presence. A trip from
            Monday to Friday is 5 days, not 4 or 3. DaysToCitizen uses this same inclusive counting method.
          </p>
        </Q>
        <Q q="What if I was in Canada before becoming a Permanent Resident?">
          <p>
            Time spent in Canada before your PR date can count at a 2-for-1 rate (maximum 365 credited days).
            Select &quot;Other status&quot; when logging those stays and DaysToCitizen will apply the correct rate.
          </p>
        </Q>
        <Q q="Does working remotely for a Canadian company while abroad count?">
          <p>
            No. Physical presence means you must be physically in Canada. Working remotely from another country
            — even for a Canadian employer — does not count toward your 1,095 days.
          </p>
        </Q>
        <Q q="Can I apply before reaching exactly 1,095 days?">
          <p>
            No. You must have at least 1,095 credited days before your application date. IRCC will verify this
            and reject applications that fall short, even by a single day.
          </p>
        </Q>
        <Q q="What documents does IRCC use to verify presence?">
          <p>
            IRCC may request any combination of: passport travel stamps, flight itineraries, tax returns (T1
            General), employment records, school records, lease agreements, and bank statements. Keeping records
            of all travel is strongly recommended.
          </p>
        </Q>
        <Q q="Is DaysToCitizen an official IRCC tool?">
          <p>
            No. DaysToCitizen is an independent, open-source tool built to help immigrants track their own
            records. It is not affiliated with IRCC or the Government of Canada. Always verify your final count
            using the official{' '}
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/become-canadian-citizen/eligibility/physical-presence-calculator.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline"
            >
              IRCC Physical Presence Calculator
            </a>{' '}
            before submitting your application.
          </p>
        </Q>
        <Q q="Is my data private?">
          <p>
            Yes. Guest users&apos; data stays entirely in their browser (localStorage) — nothing is sent to any
            server. Registered users&apos; data is stored securely in Canada (AWS ca-central-1) and is never
            shared or sold. The app is open-source and can be self-hosted.
          </p>
        </Q>
      </Section>

      {/* Common mistakes */}
      <Section title="Common Counting Mistakes to Avoid">
        <ul className="space-y-3 text-gray-600">
          {[
            'Using exclusive counting (not including arrival/departure days) — always count both ends.',
            'Forgetting short trips — even a weekend across the border breaks your streak.',
            'Not logging pre-PR time — those days count at 50% and can add up to 365 credited days.',
            'Assuming the 5-year window is fixed — it moves with your application date.',
            'Submitting before hitting exactly 1,095 — wait until the dashboard shows 0 days remaining.',
          ].map((mistake, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <div className="bg-red-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Start Tracking Your Days</h2>
        <p className="text-red-100 mb-6">
          Free, private, and no setup required. Works in 23 languages.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors"
        >
          Open DaysToCitizen →
        </Link>
      </div>

    </main>
  );
}
