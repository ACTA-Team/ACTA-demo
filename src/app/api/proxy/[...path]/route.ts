import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_TESTNET = 'https://api.testnet.acta.build';

function resolveApiBase() {
  return (
    process.env.NEXT_PUBLIC_ACTA_API_URL_TESTNET ||
    process.env.NEXT_PUBLIC_ACTA_API_URL ||
    DEFAULT_TESTNET
  );
}

function buildTargetUrlWithBase(apiBase: string, req: NextRequest, path: string[]) {
  const cleanBase = apiBase.replace(/\/+$/, '');
  const url = new URL(req.url);
  const pathname = path.join('/');
  const search = url.search || '';
  return `${cleanBase}/${pathname}${search}`;
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

async function forwardWithFallback(
  req: NextRequest,
  path: string[],
  method: 'GET' | 'POST',
  body?: string
) {
  const primaryBase = resolveApiBase();
  const primaryTarget = buildTargetUrlWithBase(primaryBase, req, path);
  const res = await fetch(primaryTarget, {
    method,
    headers: pickHeadersForForward(req),
    body,
    cache: 'no-store',
  });

  // If upstream is misconfigured (e.g., Vercel DEPLOYMENT_NOT_FOUND), try testnet fallback
  const vercelError = res.headers.get('x-vercel-error')?.toUpperCase();
  const shouldFallback =
    !!vercelError && vercelError === 'DEPLOYMENT_NOT_FOUND' && primaryBase !== DEFAULT_TESTNET;

  if (shouldFallback) {
    const fallbackTarget = buildTargetUrlWithBase(DEFAULT_TESTNET, req, path);
    const res2 = await fetch(fallbackTarget, {
      method,
      headers: pickHeadersForForward(req),
      body,
      cache: 'no-store',
    });
    const text2 = await res2.text();
    const headers2 = new Headers(res2.headers);
    headers2.set('x-proxy-target', fallbackTarget);
    headers2.set('x-proxy-fallback', primaryTarget);
    return new NextResponse(text2, { status: res2.status, headers: headers2 });
  }

  const text = await res.text();
  const headers = new Headers(res.headers);
  headers.set('x-proxy-target', primaryTarget);
  return new NextResponse(text, { status: res.status, headers });
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardWithFallback(req, path, 'GET');
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const body = await req.text();
  return forwardWithFallback(req, path, 'POST', body);
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
