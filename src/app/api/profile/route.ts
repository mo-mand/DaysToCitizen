import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getProfile, upsertProfile } from '@/lib/db';
import { UserProfile } from '@/lib/types';

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(getProfile(userId));
}

export async function PUT(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: Partial<UserProfile> = await req.json().catch(() => ({}));
  const profile: UserProfile = {
    prDate: body.prDate ?? null,
    arrivalDate: body.arrivalDate ?? null,
  };

  upsertProfile(userId, profile);
  return NextResponse.json(profile);
}
