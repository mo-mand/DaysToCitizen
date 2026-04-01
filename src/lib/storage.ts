'use client';

import { Stay } from './types';

const STAYS_KEY = 'dtc-stays-v2';
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
  localStorage.removeItem(STAYS_KEY);
  localStorage.removeItem(CREATED_KEY);
}

export function getStays(): Stay[] {
  if (typeof window === 'undefined') return [];
  if (isExpired()) { clearAll(); return []; }
  try {
    const raw = localStorage.getItem(STAYS_KEY);
    return raw ? (JSON.parse(raw) as Stay[]) : [];
  } catch {
    return [];
  }
}

export function saveStays(stays: Stay[]): void {
  if (typeof window === 'undefined') return;
  touchCreated();
  localStorage.setItem(STAYS_KEY, JSON.stringify(stays));
}

export function addStay(stay: Stay): Stay[] {
  const list = [...getStays(), stay].sort(
    (a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(),
  );
  saveStays(list);
  return list;
}

export function deleteStay(id: string): Stay[] {
  const list = getStays().filter((s) => s.id !== id);
  saveStays(list);
  return list;
}

export function clearStays(): void {
  if (typeof window === 'undefined') return;
  clearAll();
}
