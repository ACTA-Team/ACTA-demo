import { NextResponse } from 'next/server';

export async function GET() {
  const projectId = process.env.WALLETCONNECT_PROJECT_ID || '';
  if (!projectId) {
    return NextResponse.json({ error: 'Missing WALLETCONNECT_PROJECT_ID' }, { status: 500 });
  }
  return NextResponse.json({ projectId });
}
