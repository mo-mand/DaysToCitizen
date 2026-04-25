const help = {
  back: 'Back to DaysToCitizen',

  hero: {
    title: 'How to Track Your Days for Canadian Citizenship',
    introBefore: 'Canada requires Permanent Residents to accumulate',
    introBold: '1,095 days of physical presence',
    introAfter: 'within any 5-year period before applying for citizenship. This guide explains exactly how IRCC counts those days and how DaysToCitizen helps you track them without spreadsheets.',
  },

  requirement: {
    title: 'The IRCC Physical Presence Requirement',
    p1Before: 'Under the',
    p1Law: 'Citizenship Act',
    p1After: ', every citizenship applicant must prove they were physically present in Canada for at least 1,095 days (3 years) out of the 5 years immediately before their application date. This is calculated on a rolling basis — the 5-year window moves with your application date, not a fixed calendar period.',
    keyRuleTitle: 'Key rule: both the day you enter and the day you leave count as full days.',
    keyRuleBody: 'If you fly into Toronto on March 1 and fly out on March 5, that counts as 5 days — not 3 or 4. This is one of the most common miscounting mistakes.',
    p2: 'IRCC verifies your presence using passport stamps, travel history, tax records, and other documents. Understating or overstating your days — even accidentally — can result in application refusal or a finding of misrepresentation.',
  },

  status: {
    title: 'Permanent Resident Days vs. Other Status Days',
    intro: 'Not all days in Canada count equally. The Citizenship Act distinguishes between time spent as a Permanent Resident and time spent under other immigration statuses (student visa, work permit, visitor, protected person, etc.).',
    thStatus: 'Status',
    thCounts: 'Counts toward 1,095?',
    thRate: 'Rate',
    prStatus: 'Permanent Resident',
    prCounts: 'Yes',
    prRate: '1 day = 1 day',
    refugeeStatus: 'Protected Person / Convention Refugee',
    refugeeCounts: 'Yes (partial)',
    refugeeRate: '2 days = 1 day (max 365 credited)',
    visitorStatus: 'Student / Work Permit / Visitor',
    visitorCounts: 'Yes (partial)',
    visitorRate: '2 days = 1 day (max 365 credited)',
    noneStatus: 'Unauthorized / No Status',
    noneCounts: 'No',
    noneRate: '0',
    footer: 'DaysToCitizen applies these rates automatically when you log each stay. Simply select your immigration status for each period and the math is handled for you.',
  },

  howto: {
    title: 'How to Use DaysToCitizen',
    step1Title: 'Open the app — no signup required.',
    step1Body: 'Your stays are saved locally in your browser. Create an account only if you want your data synced across devices.',
    step2Title: 'Add your stays in Canada.',
    step2Body: "Enter the entry date, exit date (leave blank if you're currently in Canada), and your immigration status at the time.",
    step3Title: 'Read your dashboard.',
    step3Body: 'The countdown card shows how many more days you need. The progress bar shows your 5-year window. Stats cards break down credited vs. total days.',
    step4Title: 'Update as you travel.',
    step4Body: 'Add a new stay every time you return to Canada. The calculation updates instantly.',
  },

  faq: {
    title: 'Frequently Asked Questions',
    q1: 'Do I count the day I arrive and the day I leave?',
    a1: 'Yes. IRCC counts both the arrival day and the departure day as full days of presence. A trip from Monday to Friday is 5 days, not 4 or 3. DaysToCitizen uses this same inclusive counting method.',
    q2: 'What if I was in Canada before becoming a Permanent Resident?',
    a2: 'Time spent in Canada before your PR date can count at a 2-for-1 rate (maximum 365 credited days). Select "Other status" when logging those stays and DaysToCitizen will apply the correct rate. If you were already living in Canada on another visa when you became a PR, you must split that continuous stay into two separate records — one for the period before your PR, one for after. The date used is the one printed on the back of your PR card (the date it was issued, not the date you received it in the mail).',
    a2ExampleTitle: 'Example',
    a2ExampleLine1: 'Jan 2023 – Mar 2024 → Select "Other Status" (visa/work/student). These 15 months count at the 2-for-1 rate.',
    a2ExampleLine2: 'Mar 2024 – Jan 2026 → Select "Permanent Resident". These 22 months count in full (1:1).',
    q3: 'Does working remotely for a Canadian company while abroad count?',
    a3: 'No. Physical presence means you must be physically in Canada. Working remotely from another country — even for a Canadian employer — does not count toward your 1,095 days.',
    q4: 'Can I apply before reaching exactly 1,095 days?',
    a4: 'No. You must have at least 1,095 credited days before your application date. IRCC will verify this and reject applications that fall short, even by a single day.',
    q5: 'What documents does IRCC use to verify presence?',
    a5: 'IRCC may request any combination of: passport travel stamps, flight itineraries, tax returns (T1 General), employment records, school records, lease agreements, and bank statements. Keeping records of all travel is strongly recommended.',
    q6: 'Is DaysToCitizen an official IRCC tool?',
    a6Before: 'No. DaysToCitizen is an independent, open-source tool built to help immigrants track their own records. It is not affiliated with the Government of Canada. Always verify your application details through the official',
    a6Link: 'IRCC',
    a6After: 'website before submitting your application.',
    q7: 'Is my data private?',
    a7: "Yes. Guest users' data stays entirely in their browser (localStorage) — nothing is sent to any server. Registered users' data is stored securely in Canada (AWS ca-central-1) and is never shared or sold. The app is open-source and can be self-hosted.",
  },

  mistakes: {
    title: 'Common Counting Mistakes to Avoid',
    m1: 'Using exclusive counting (not including arrival/departure days) — always count both ends.',
    m2: 'Forgetting short trips — even a weekend across the border breaks your streak.',
    m3: 'Not logging pre-PR time — those days count at 50% and can add up to 365 credited days.',
    m4: 'Assuming the 5-year window is fixed — it moves with your application date.',
    m5: 'Submitting before hitting exactly 1,095 — wait until the dashboard shows 0 days remaining.',
  },

  cta: {
    title: 'Start Tracking Your Days',
    subtitle: 'Free, private, and no setup required. Works in 23 languages.',
    button: 'Open DaysToCitizen →',
  },
};

export default help;
export type HelpContent = typeof help;
