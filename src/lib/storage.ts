'use client';

import { Absence, UserProfile } from './types';

const ABSENCE_KEY = 'dtc-absences-v1';
const PROFILE_KEY = 'dtc-profile-v1';
const CREATED_KEY = 'dtc-created-at';
const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

function isExpired(): boolean {
  const ts = localStorage.getItem(CREATED_KEY);
  if (!ts) return false;
  return Date.now() - Number(ts) > THREE_MONTHS_MS;
}

function touchCreated(): void {
  if (!localStorage.getItem(CREATED_KEY)) {
    localStorage.setItem(CREATED_KEY, String(Date.now()));
  }
}

function clearAll(): void {
  localStorage.removeItem(ABSENCE_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(CREATED_KEY);
}

// ── Absences ─────────────────────────────────────────────────────────────────

export function getAbsences(): Absence[] {
  if (typeof window === 'undefined') return [];
  if (isExpired()) { clearAll(); return []; }
  try {
    const raw = localStorage.getItem(ABSENCE_KEY);
    return raw ? (JSON.parse(raw) as Absence[]) : [];
  } catch {
    return [];
  }
}

export function saveAbsences(absences: Absence[]): void {
  if (typeof window === 'undefined') return;
  touchCreated();
  localStorage.setItem(ABSENCE_KEY, JSON.stringify(absences));
}

export function addAbsence(absence: Absence): Absence[] {
  const list = [...getAbsences(), absence].sort(
    (a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime(),
  );
  saveAbsences(list);
  return list;
}

export function deleteAbsence(id: string): Absence[] {
  const list = getAbsences().filter((a) => a.id !== id);
  saveAbsences(list);
  return list;
}

// ── Profile ──────────────────────────────────────────────────────────────────

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return { prDate: null, arrivalDate: null };
  if (isExpired()) { clearAll(); return { prDate: null, arrivalDate: null }; }
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : { prDate: null, arrivalDate: null };
  } catch {
    return { prDate: null, arrivalDate: null };
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  touchCreated();
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearLocalData(): void {
  if (typeof window === 'undefined') return;
  clearAll();
}
