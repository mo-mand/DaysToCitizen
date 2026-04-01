// An absence is a period the user was OUTSIDE Canada
export interface Absence {
  id: string;
  departureDate: string;     // YYYY-MM-DD — day they left Canada
  returnDate: string | null; // YYYY-MM-DD — day they returned; null = still outside
  notes?: string;
}

// Persisted user profile
export interface UserProfile {
  prDate: string | null;      // Date they became a Permanent Resident
  arrivalDate: string | null; // First arrival in Canada (enables pre-PR credit)
}

// Result of the citizenship calculation
export interface CitizenshipStats {
  creditedDays: number;    // Total credited days (what IRCC counts)
  prDays: number;          // Days in Canada as PR (full credit)
  preprCredited: number;   // Days credited from pre-PR period (50%, max 365)
  physicalDays: number;    // Total physical days in Canada
  absenceDays: number;     // Total days outside Canada
  daysRemaining: number;   // Days still needed to reach 1 095
  percentComplete: number; // 0–100
  isEligible: boolean;
  eligibilityDate: string | null;
  currentlyOutside: boolean;
  windowStart: string;     // Start of the 5-year counting window (formatted)
}
