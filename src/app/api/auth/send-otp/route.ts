import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, otpExpiresAt } from '@/lib/auth';
import { saveOtp } from '@/lib/db';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: unknown = body?.email;

  if (typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const code = generateOtp();
  const expiresAt = otpExpiresAt();

  try {
    await saveOtp(normalized, code, expiresAt);
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    return NextResponse.json({ error: `saveOtp failed — ${msg}` }, { status: 500 });
  }

  try {
    await sendOtpEmail(normalized, code);
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    return NextResponse.json({ error: `sendEmail failed — ${msg}` }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
