import { NextRequest, NextResponse } from 'next/server';
import { upsertUser } from '@/lib/db';
import { signToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth';

// Email-only login — no OTP, no verification.
// Submitting an email instantly creates or retrieves the account.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: unknown = body?.email;

  if (typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  const user = upsertUser(email.trim().toLowerCase());
  const token = await signToken(user.id);

  const res = NextResponse.json({ email: user.email });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  return res;
}
