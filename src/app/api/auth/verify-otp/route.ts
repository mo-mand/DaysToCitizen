import { NextRequest, NextResponse } from 'next/server';
import { verifyAndConsumeOtp, upsertUser } from '@/lib/db';
import { signToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: unknown = body?.email;
  const code: unknown = body?.code;

  if (typeof email !== 'string' || typeof code !== 'string') {
    return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const valid = verifyAndConsumeOtp(normalized, code.trim());

  if (!valid) {
    return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 401 });
  }

  const user = upsertUser(normalized);
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
