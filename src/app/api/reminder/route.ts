import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { findUserById } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), '.data');
const DB_PATH = path.join(DB_DIR, 'db.json');

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
  catch { return { users: [], stays: [] }; }
}
function writeDB(db: object) {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// How many hours between email reminders for the same user
const REMINDER_COOLDOWN_HOURS = 24;

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = await verifyToken(token);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = findUserById(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const db = readDB();
  const dbUser = db.users.find((u: { id: string }) => u.id === userId);
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Check cooldown
  if (dbUser.reminderSentAt) {
    const hoursSince = (Date.now() - new Date(dbUser.reminderSentAt).getTime()) / (1000 * 60 * 60);
    if (hoursSince < REMINDER_COOLDOWN_HOURS) {
      return NextResponse.json({ ok: true, alreadySent: true });
    }
  }

  // Mark reminder as sent (email provider would be called here)
  dbUser.reminderSentAt = new Date().toISOString();
  writeDB(db);

  // TODO: When an email provider (e.g. Resend) is configured, send the actual email here:
  // await resend.emails.send({
  //   from: 'noreply@daystocitizen.com',
  //   to: user.email,
  //   subject: 'DaysToCitizen — Almost Eligible!',
  //   html: `<p>You are almost eligible for Canadian citizenship. Start preparing your documents now.</p>`,
  // });

  return NextResponse.json({ ok: true, alreadySent: false });
}
