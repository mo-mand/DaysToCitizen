import { NextRequest, NextResponse } from 'next/server';
import { signToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth';
import { verifyAndConsumeOtp, upsertUser } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: unknown = body?.email;
  const code: unknown = body?.code;

  if (typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }
  if (typeof code !== 'string' || code.trim().length === 0) {
    return NextResponse.json({ error: 'Verification code is required.' }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const valid = await verifyAndConsumeOtp(normalized, code.trim());

  if (!valid) {
    return NextResponse.json({ error: 'Invalid or expired code. Please try again.' }, { status: 401 });
  }

  const user = await upsertUser(normalized);
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
