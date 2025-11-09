import { NextRequest, NextResponse } from 'next/server';
const DEFAULT_TESTNET = 'https://api.testnet.acta.build';

function resolveApiBase() {
  return (
    process.env.NEXT_PUBLIC_ACTA_API_URL_TESTNET ||
    process.env.NEXT_PUBLIC_ACTA_API_URL ||
    DEFAULT_TESTNET
  );
}

function buildTargetUrl(req: NextRequest, path: string[]) {
  const apiBase = resolveApiBase().replace(/\/+$/, '');
  const url = new URL(req.url);
  const pathname = path.join('/');
  const search = url.search || '';
  return `${apiBase}/${pathname}${search}`;
}

function pickHeadersForForward(req: NextRequest) {
  const incoming = req.headers;
  const headers = new Headers();
  const allow = ['accept', 'content-type', 'authorization', 'x-acta-key'];
  allow.forEach((h) => {
    const v = incoming.get(h as any);
    if (v) headers.set(h, v);
  });
  return headers;
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const target = buildTargetUrl(req, path);
  const res = await fetch(target, {
    method: 'GET',
    headers: pickHeadersForForward(req),
    cache: 'no-store',
  });
  const body = await res.text();
  return new NextResponse(body, { status: res.status, headers: res.headers });
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const target = buildTargetUrl(req, path);
  const body = await req.text();
  const res = await fetch(target, {
    method: 'POST',
    headers: pickHeadersForForward(req),
    body,
    cache: 'no-store',
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: res.headers });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-ACTA-Key',
    },
  });
}
