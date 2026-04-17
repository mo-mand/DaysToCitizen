import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { findUserById } from '@/lib/db';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ user: null });

  const userId = await verifyToken(token);
  if (!userId) return NextResponse.json({ user: null });

  const user = await findUserById(userId);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user: { email: user.email } });
}
