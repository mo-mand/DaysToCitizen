import { NextResponse } from 'next/server';

// Profile endpoint removed — the app now uses stays with per-stay visa status.
export async function GET() {
  return NextResponse.json({}, { status: 200 });
}

export async function PUT() {
  return NextResponse.json({}, { status: 200 });
}
