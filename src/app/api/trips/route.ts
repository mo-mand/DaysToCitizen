import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getAbsences, createAbsence } from '@/lib/db';
import { Absence } from '@/lib/types';

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(getAbsences(userId));
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: Partial<Absence> = await req.json().catch(() => ({}));
  if (!body.departureDate) {
    return NextResponse.json({ error: 'departureDate is required.' }, { status: 400 });
  }

  const absence: Absence = {
    id: body.id ?? crypto.randomUUID(),
    departureDate: body.departureDate,
    returnDate: body.returnDate ?? null,
    notes: body.notes,
  };

  return NextResponse.json(createAbsence(userId, absence), { status: 201 });
}
