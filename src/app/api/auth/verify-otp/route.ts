import { NextResponse } from 'next/server';

// OTP auth removed — login is now email-only via /api/auth/send-otp
export async function POST() {
  return NextResponse.json({ error: 'Not used.' }, { status: 410 });
}
