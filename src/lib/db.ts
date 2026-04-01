/**
 * File-based JSON database for DaysToCitizen.
 * Simple, portable, no native dependencies — works on any platform.
 * Data is stored in .data/db.json (gitignored).
 *
 * For high-traffic production use, swap this module for a proper database
 * (PostgreSQL via Prisma, Turso/libSQL, etc.) without changing the API.
 */

import fs from 'fs';
import path from 'path';
import { Absence, UserProfile } from './types';

const DB_DIR = path.join(process.cwd(), '.data');
const DB_PATH = path.join(DB_DIR, 'db.json');

// ── Schema ────────────────────────────────────────────────────────────────────

interface DBUser {
  id: string;
  email: string;
  createdAt: string;
}

interface DBOtp {
  email: string;
  code: string;
  expiresAt: string;
}

interface DBProfile {
  userId: string;
  prDate: string | null;
  arrivalDate: string | null;
}

interface DBAbsence extends Absence {
  userId: string;
  createdAt: string;
}

interface DB {
  users: DBUser[];
  otps: DBOtp[];
  profiles: DBProfile[];
  absences: DBAbsence[];
}

// ── IO ────────────────────────────────────────────────────────────────────────

function readDB(): DB {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DB;
  } catch {
    return { users: [], otps: [], profiles: [], absences: [] };
  }
}

function writeDB(db: DB): void {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function findUserByEmail(email: string): DBUser | undefined {
  return readDB().users.find((u) => u.email === email);
}

export function findUserById(id: string): DBUser | undefined {
  return readDB().users.find((u) => u.id === id);
}

export function upsertUser(email: string): DBUser {
  const db = readDB();
  const existing = db.users.find((u) => u.email === email);
  if (existing) return existing;
  const user: DBUser = { id: crypto.randomUUID(), email, createdAt: new Date().toISOString() };
  db.users.push(user);
  writeDB(db);
  return user;
}

// ── OTPs ──────────────────────────────────────────────────────────────────────

export function saveOtp(email: string, code: string, expiresAt: Date): void {
  const db = readDB();
  db.otps = db.otps.filter((o) => o.email !== email); // one OTP per email
  db.otps.push({ email, code, expiresAt: expiresAt.toISOString() });
  writeDB(db);
}

export function verifyAndConsumeOtp(email: string, code: string): boolean {
  const db = readDB();
  const idx = db.otps.findIndex((o) => o.email === email);
  if (idx === -1) return false;
  const otp = db.otps[idx];
  if (otp.code !== code) return false;
  if (new Date(otp.expiresAt) < new Date()) {
    db.otps.splice(idx, 1);
    writeDB(db);
    return false;
  }
  db.otps.splice(idx, 1);
  writeDB(db);
  return true;
}

// ── Profiles ──────────────────────────────────────────────────────────────────

export function getProfile(userId: string): UserProfile {
  const row = readDB().profiles.find((p) => p.userId === userId);
  return { prDate: row?.prDate ?? null, arrivalDate: row?.arrivalDate ?? null };
}

export function upsertProfile(userId: string, profile: UserProfile): void {
  const db = readDB();
  const idx = db.profiles.findIndex((p) => p.userId === userId);
  const record: DBProfile = { userId, prDate: profile.prDate ?? null, arrivalDate: profile.arrivalDate ?? null };
  if (idx === -1) db.profiles.push(record);
  else db.profiles[idx] = record;
  writeDB(db);
}

// ── Absences ──────────────────────────────────────────────────────────────────

export function getAbsences(userId: string): Absence[] {
  return readDB()
    .absences.filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime())
    .map(({ userId: _uid, createdAt: _ca, ...abs }) => abs);
}

export function createAbsence(userId: string, absence: Absence): Absence {
  const db = readDB();
  const record: DBAbsence = { ...absence, userId, createdAt: new Date().toISOString() };
  db.absences.push(record);
  writeDB(db);
  return absence;
}

export function updateAbsence(userId: string, id: string, patch: Partial<Absence>): boolean {
  const db = readDB();
  const idx = db.absences.findIndex((a) => a.id === id && a.userId === userId);
  if (idx === -1) return false;
  db.absences[idx] = { ...db.absences[idx], ...patch };
  writeDB(db);
  return true;
}

export function deleteAbsence(userId: string, id: string): boolean {
  const db = readDB();
  const idx = db.absences.findIndex((a) => a.id === id && a.userId === userId);
  if (idx === -1) return false;
  db.absences.splice(idx, 1);
  writeDB(db);
  return true;
}
