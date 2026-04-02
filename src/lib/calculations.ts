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

    if (!isAfter(start, addDays(curEnd, 1))) {
      if (isAfter(end, curEnd)) curEnd = end;
    } else {
      total += differenceInDays(curEnd, curStart) + 1;
      curStart = start;
      curEnd = end;
    }
  }

  total += differenceInDays(curEnd, curStart) + 1;
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

    if (isAfter(start, end)) continue;

    allIntervals.push({ start, end });

    if (stay.status === 'permanent-resident') {
      prIntervals.push({ start, end });
    }
  }

  const physicalDays = countDistinctDays(allIntervals);
  const prDays = countDistinctDays(prIntervals);
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
  const years = Math.floor(days / 365);
  const remainingAfterYears = days - years * 365;
  // Using 365/12 per month guarantees months is always 0–11, never 12
  const months = Math.floor(remainingAfterYears * 12 / 365);
  const remainingDays = remainingAfterYears - Math.round(months * 365 / 12);
  return { years, months, days: remainingDays };
}