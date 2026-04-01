import fs from 'fs';
import path from 'path';
import { Stay } from './types';

const DB_DIR = path.join(process.cwd(), '.data');
const DB_PATH = path.join(DB_DIR, 'db.json');

interface DBUser {
  id: string;
  email: string;
  createdAt: string;
}

interface DBStay extends Stay {
  userId: string;
  createdAt: string;
}

interface DB {
  users: DBUser[];
  stays: DBStay[];
}

function readDB(): DB {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DB;
  } catch {
    return { users: [], stays: [] };
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

// ── Stays ─────────────────────────────────────────────────────────────────────

export function getStays(userId: string): Stay[] {
  return readDB()
    .stays.filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
    .map(({ userId: _uid, createdAt: _ca, ...stay }) => stay);
}

export function createStay(userId: string, stay: Stay): Stay {
  const db = readDB();
  if (db.stays.some((s) => s.id === stay.id && s.userId === userId)) return stay;
  db.stays.push({ ...stay, userId, createdAt: new Date().toISOString() });
  writeDB(db);
  return stay;
}

export function deleteStay(userId: string, id: string): boolean {
  const db = readDB();
  const idx = db.stays.findIndex((s) => s.id === id && s.userId === userId);
  if (idx === -1) return false;
  db.stays.splice(idx, 1);
  writeDB(db);
  return true;
}

export function updateStay(userId: string, id: string, updates: Partial<Stay>): Stay | null {
  const db = readDB();
  const idx = db.stays.findIndex((s) => s.id === id && s.userId === userId);
  if (idx === -1) return null;
  db.stays[idx] = { ...db.stays[idx], ...updates };
  writeDB(db);
  const { userId: _uid, createdAt: _ca, ...stay } = db.stays[idx];
  return stay;
}
