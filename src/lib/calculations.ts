import {
  differenceInDays,
  parseISO,
  subYears,
  addDays,
  format,
  isBefore,
  isAfter,
  max as dateMax,
  min as dateMin,
} from 'date-fns';
import { Absence, UserProfile, CitizenshipStats } from './types';

const REQUIRED_DAYS = 1095;
const WINDOW_YEARS = 5;
const MAX_PREPR_CREDITED = 365;

// Sum the days of absence that overlap with [from, to)
function absenceDaysInRange(absences: Absence[], from: Date, to: Date, today: Date): number {
  let total = 0;
  for (const abs of absences) {
    const dept = parseISO(abs.departureDate);
    const ret = abs.returnDate ? parseISO(abs.returnDate) : today;
    const overlapStart = dateMax([dept, from]);
    const overlapEnd = dateMin([ret, to]);
    if (isAfter(overlapEnd, overlapStart)) {
      total += differenceInDays(overlapEnd, overlapStart);
    }
  }
  return total;
}

export function calculateStats(
  absences: Absence[],
  profile: UserProfile,
): CitizenshipStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const windowStart = subYears(today, WINDOW_YEARS);

  const prDate = profile.prDate ? parseISO(profile.prDate) : null;
  const arrivalDate = profile.arrivalDate ? parseISO(profile.arrivalDate) : null;

  // ── Post-PR days (count 1:1) ────────────────────────────────────────────────
  let prDays = 0;
  if (prDate && !isAfter(prDate, today)) {
    const postPrStart = isAfter(prDate, windowStart) ? prDate : windowStart;
    const totalPostPr = differenceInDays(today, postPrStart);
    const absentPostPr = absenceDaysInRange(absences, postPrStart, today, today);
    prDays = Math.max(0, totalPostPr - absentPostPr);
  }

  // ── Pre-PR days (count 1:0.5, cap at 365 credited) ─────────────────────────
  let preprDaysRaw = 0;
  let preprCredited = 0;
  if (arrivalDate && prDate && isBefore(arrivalDate, prDate)) {
    const preprStart = isAfter(arrivalDate, windowStart) ? arrivalDate : windowStart;
    const preprEnd = prDate; // PR date marks the boundary
    if (isAfter(preprEnd, preprStart)) {
      const totalPrepr = differenceInDays(preprEnd, preprStart);
      const absentPrepr = absenceDaysInRange(absences, preprStart, preprEnd, today);
      preprDaysRaw = Math.max(0, totalPrepr - absentPrepr);
      preprCredited = Math.min(Math.floor(preprDaysRaw / 2), MAX_PREPR_CREDITED);
    }
  }

  const creditedDays = prDays + preprCredited;
  const daysRemaining = Math.max(0, REQUIRED_DAYS - creditedDays);
  const percentComplete = Math.min(100, Math.round((creditedDays / REQUIRED_DAYS) * 100));
  const physicalDays = prDays + preprDaysRaw;

  // Total absence days across all recorded absences
  const absenceDays = absences.reduce((sum, abs) => {
    const dept = parseISO(abs.departureDate);
    const ret = abs.returnDate ? parseISO(abs.returnDate) : today;
    return sum + Math.max(0, differenceInDays(ret, dept));
  }, 0);

  // Eligibility date: today + daysRemaining (assuming continuous presence)
  const eligibilityDate =
    daysRemaining === 0
      ? format(today, 'MMMM d, yyyy')
      : format(addDays(today, daysRemaining), 'MMMM d, yyyy');

  const currentlyOutside = absences.some((a) => a.returnDate === null);

  return {
    creditedDays,
    prDays,
    preprCredited,
    physicalDays,
    absenceDays,
    daysRemaining,
    percentComplete,
    isEligible: creditedDays >= REQUIRED_DAYS,
    eligibilityDate,
    currentlyOutside,
    windowStart: format(windowStart, 'MMM d, yyyy'),
  };
}

export function daysToYMD(days: number): { years: number; months: number; days: number } {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remaining = days % 30;
  return { years, months, days: remaining };
}

export function absenceDuration(abs: Absence): number {
  const dept = parseISO(abs.departureDate);
  const ret = abs.returnDate ? parseISO(abs.returnDate) : new Date();
  return Math.max(0, differenceInDays(ret, dept));
}
