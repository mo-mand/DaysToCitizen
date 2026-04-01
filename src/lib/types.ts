export type ResidencyStatus = 'permanent-resident' | 'other';

export interface Stay {
  id: string;
  entryDate: string;        // YYYY-MM-DD — day they entered Canada
  exitDate: string | null;  // YYYY-MM-DD — day they left; null = currently in Canada
  status: ResidencyStatus;
  notes?: string;
}

export interface CitizenshipStats {
  creditedDays: number;      // Total credited days toward 1,095
  physicalDays: number;      // Total physical days in Canada (unweighted)
  prDays: number;            // Days as PR (count 1:1)
  otherDaysRaw: number;      // Physical days under other status
  otherDaysCredited: number; // Credited from other status (×0.5, max 365)
  daysRemaining: number;
  percentComplete: number;
  isEligible: boolean;
  eligibilityDate: Date | null;
  currentlyInCanada: boolean;
  windowStart: string;
}
