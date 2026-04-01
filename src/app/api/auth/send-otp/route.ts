import { NextRequest, NextResponse } from 'next/server';
import { saveOtp } from '@/lib/db';
import { generateOtp, otpExpiresAt } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: unknown = body?.email;

  if (typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const code = generateOtp();
  const expires = otpExpiresAt();

  saveOtp(normalized, code, expires);
  await sendOtpEmail(normalized, code);

  return NextResponse.json({ ok: true });
}
