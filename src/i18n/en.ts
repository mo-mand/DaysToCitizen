const en = {
  // App
  appName: 'DaysToCitizen',
  tagline: 'Canadian Citizenship Tracker',

  // Nav
  signIn: 'Sign In',
  signOut: 'Sign Out',
  myAccount: 'My Account',
  help: 'Help',

  // Auth modal
  authTitle: 'Sign in to save your data',
  authSubtitle: 'Enter your email to receive a one-time code. No password needed.',
  emailLabel: 'Email address',
  emailPlaceholder: 'you@example.com',
  sendCode: 'Send Code',
  sending: 'Sending…',
  checkEmail: 'Check your email',
  otpSentTo: 'We sent a 6-digit code to',
  otpDevNote: '(Dev mode: check the server console for the code)',
  otpLabel: 'Verification code',
  otpPlaceholder: '123456',
  verify: 'Verify',
  verifying: 'Verifying…',
  resendCode: 'Resend code',
  authDisclaimer: 'Your data is stored securely. We never share your information.',

  // Setup
  journeyTitle: 'Your Citizenship Journey',
  setPrDate: 'Set your PR date to start tracking',
  prDateLabel: 'Permanent Resident (PR) date',
  arrivalDateLabel: 'First arrival in Canada',
  arrivalDateHint: 'Optional — enables pre-PR credit (days before PR count as half)',
  saveAndStart: 'Save & Start Tracking',
  changeDates: 'Change dates',
  prDate: 'PR Date',

  // Trip form
  addTripTitle: 'Add a Stay in Canada',
  leftCanada: 'Start Date in Canada',
  returnedToCanada: 'End Date in Canada',
  stillAbroad: 'I\'m currently in Canada',
  tripNotes: 'Notes',
  tripNotesPlaceholder: 'e.g. Landed as PR, work permit…',
  addTrip: 'Add Stay',
  adding: 'Adding…',
  immigrationStatusLabel: 'Immigration status',
  errorEndDateRequired: 'End date is required, or check "Still in Canada".',
  physicalDaysLabel: 'physical days',
  fullCredit: 'full credit',
  otherCreditedOf: 'of',
  rawDaysLabel: 'raw',
  stillNeeded: 'Still needed',
  presentLabel: 'Present',
  visitorOther: 'Visitor / Work / Other',
  prOption: 'Permanent Resident — Full Days',
  otherOption: 'Any Other Status (Visitor, Work, Student…) — Half Days',
  backToDashboard: 'Back to dashboard',
  manage: 'Manage',
  manageStaysTitle: 'Manage Stays',
  manageStaysSubtitle: 'Add, edit, or remove your stays in Canada.',
  recordedStays: 'Recorded stays',
  noStaysYet: 'No stays recorded yet',
  saveLabel: 'Save',
  cancelLabel: 'Cancel',
  eligibleDaysOf: 'eligible days of',
  visaDays: 'visa days',

  // Countdown
  timeRemaining: 'Time Remaining',
  eligible: 'You\'re Eligible!',
  estimatedEligibility: 'Estimated eligibility:',
  assumingStay: 'assuming you stay in Canada',
  year: 'year',
  years: 'years',
  month: 'month',
  months: 'months',
  day: 'day',
  days: 'days',

  // Progress
  progress: 'Progress',
  creditedDays: 'credited days',
  daysNeeded: 'days needed',

  // Stats
  daysInCanada: 'Days in Canada',
  daysOutside: 'Days Outside',
  prDays: 'PR Days',
  preprCredit: 'Other Status',

  // Trip list
  tripsTitle: 'Stays in Canada',
  noTrips: 'No stays recorded yet',
  noTripsHint: 'Add your first stay above',
  deleteTrip: 'Delete',
  currentlyAbroad: 'Currently in Canada',
  returned: 'Left Canada',

  // How it works
  howTitle: 'How Canadian Citizenship Works',
  how1: 'You must be physically present in Canada for at least 1,095 days (3 years) within the 5 years before applying.',
  how2: 'Days as a Permanent Resident count in full (1:1).',
  how3: 'Days under any other status (visitor, work, study) count as half (1:0.5), up to a maximum of 365 credited days.',
  how4: 'Only the last 5 years are considered — the window rolls forward every day.',
  disclaimer: 'This tool is for reference only. Always verify with official IRCC guidelines before applying.',

  // Errors
  errorRequired: 'This field is required.',
  errorDates: 'Return date must be after departure date.',
  errorOtp: 'Invalid or expired code. Please try again.',
  errorGeneral: 'Something went wrong. Please try again.',

  // Footer
  footerBuiltBy: 'Built by',
  footerOpenSource: 'Open source',
  footerDisclaimer: 'For reference only — always consult IRCC.',

  // Help page
  helpBack: '← Back to DaysToCitizen',
  helpCtaTitle: 'Start Tracking Your Days',
  helpCtaSubtitle: 'Free, private, and no setup required. Works in 23 languages.',
  helpOpenApp: 'Open DaysToCitizen →',
};

export default en;
export type Translations = typeof en;
