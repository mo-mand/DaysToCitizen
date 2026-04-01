const en = {
  // App
  appName: 'DaysToCitizen',
  tagline: 'Canadian Citizenship Tracker',

  // Nav
  signIn: 'Sign In',
  signOut: 'Sign Out',
  myAccount: 'My Account',

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
  addTripTitle: 'Add Trip Outside Canada',
  leftCanada: 'Left Canada',
  returnedToCanada: 'Returned to Canada',
  stillAbroad: 'I\'m still outside Canada',
  tripNotes: 'Notes',
  tripNotesPlaceholder: 'e.g. vacation, work trip…',
  addTrip: 'Add Trip',
  adding: 'Adding…',

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
  preprCredit: 'Pre-PR Credit',

  // Trip list
  tripsTitle: 'Trips Outside Canada',
  noTrips: 'No trips recorded yet',
  noTripsHint: 'Add your trips above to track your absences',
  deleteTrip: 'Delete',
  currentlyAbroad: 'Currently abroad',
  returned: 'Returned',

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
};

export default en;
export type Translations = typeof en;
