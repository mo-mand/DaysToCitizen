import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getStays, createStay } from '@/lib/db';
import { Stay } from '@/lib/types';

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getStays(userId));
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: Partial<Stay> = await req.json().catch(() => ({}));
  if (!body.entryDate) {
    return NextResponse.json({ error: 'entryDate is required.' }, { status: 400 });
  }

  const stay: Stay = {
    id: body.id ?? crypto.randomUUID(),
    entryDate: body.entryDate,
    exitDate: body.exitDate ?? null,
    status: body.status ?? 'other',
    notes: body.notes,
  };

  return NextResponse.json(await createStay(userId, stay), { status: 201 });
}
