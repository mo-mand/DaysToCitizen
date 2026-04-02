import {
  differenceInDays,
  parseISO,
  subYears,
  addDays,
  format,
  isAfter,
  max as dateMax,
  min as dateMin,
} from 'date-fns';
import { Stay, CitizenshipStats } from './types';

const REQUIRED_DAYS = 1095;
const WINDOW_YEARS = 5;
const MAX_OTHER_CREDITED = 365;

// ── Interval helpers ──────────────────────────────────────────────────────────

interface Interval { start: Date; end: Date }

/** Count distinct calendar days covered by intervals (inclusive, handles overlaps). */
function countDistinctDays(intervals: Interval[]): number {
  if (intervals.length === 0) return 0;

  const sorted = [...intervals].sort((a, b) => a.start.getTime() - b.start.getTime());

  let total = 0;
  let curStart = sorted[0].start;
  let curEnd = sorted[0].end;

  for (let i = 1; i < sorted.length; i++) {
    const { start, end } = sorted[i];

    // Overlapping or touching intervals — merge
    if (!isAfter(start, addDays(curEnd, 1))) {
      if (isAfter(end, curEnd)) curEnd = end;
    } else {
      total += differenceInDays(curEnd, curStart) + 1; // inclusive
      curStart = start;
      curEnd = end;
    }
  }

  total += differenceInDays(curEnd, curStart) + 1; // inclusive
  return total;
}

// ── Main calculator ───────────────────────────────────────────────────────────

export function calculateStats(stays: Stay[]): CitizenshipStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const windowStart = subYears(today, WINDOW_YEARS);

  const allIntervals: Interval[] = [];
  const prIntervals: Interval[] = [];

  for (const stay of stays) {
    const entry = parseISO(stay.entryDate);
    const exit = stay.exitDate ? parseISO(stay.exitDate) : today;

    const start = dateMax([entry, windowStart]);
    const end = dateMin([exit, today]);

    // Allow same-day stays (inclusive)
    if (isAfter(start, end)) continue;

    allIntervals.push({ start, end });

    if (stay.status === 'permanent-resident') {
      prIntervals.push({ start, end });
    }
  }

  // Distinct total days (overlaps automatically removed)
  const physicalDays = countDistinctDays(allIntervals);

  // Distinct PR days
  const prDays = countDistinctDays(prIntervals);

  // Other days (non-PR)
  const otherDaysRaw = Math.max(0, physicalDays - prDays);

  const otherDaysCredited = Math.min(Math.floor(otherDaysRaw / 2), MAX_OTHER_CREDITED);
  const creditedDays = prDays + otherDaysCredited;

  const daysRemaining = Math.max(0, REQUIRED_DAYS - creditedDays);

  const percentComplete = Math.min(
    100,
    Math.round((creditedDays / REQUIRED_DAYS) * 100)
  );

  const currentlyInCanada = stays.some((s) => s.exitDate === null);

  const eligibilityDate: Date =
    daysRemaining === 0 ? today : addDays(today, daysRemaining);

  return {
    creditedDays,
    physicalDays,
    prDays,
    otherDaysRaw,
    otherDaysCredited,
    daysRemaining,
    percentComplete,
    isEligible: creditedDays >= REQUIRED_DAYS,
    eligibilityDate,
    currentlyInCanada,
    windowStart: format(windowStart, 'MMM d, yyyy'),
  };
}

// ── Utilities ─────────────────────────────────────────────────────────────────

export function daysToYMD(days: number): { years: number; months: number; days: number } {
  // Use simple day-based math (365/year, 30/month) to match IRCC's day-counting model.
  // intervalToDuration gives "wrong" results because leap years make 1095 days fall
  // 1 day short of 3 calendar years — but IRCC counts days, so 1095 = exactly 3 years.
  let years = Math.floor(days / 365);
  const afterYears = days % 365;
  let months = Math.floor(afterYears / 30);
  const remainingDays = afterYears % 30;
  // Normalize: 12 months overflow into a year (happens when afterYears is 360-364)
  if (months >= 12) { years += 1; months = 0; }
  return { years, months, days: remainingDays };
}

export function stayDuration(stay: Stay): number {
  const entry = parseISO(stay.entryDate);
  const exit = stay.exitDate ? parseISO(stay.exitDate) : new Date();
  if (isAfter(entry, exit)) return 0;
  return differenceInDays(exit, entry) + 1; // inclusive — both entry and exit day count
}
