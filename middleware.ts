import { NextRequest, NextResponse } from 'next/server';

// ─── Edge Middleware ──────────────────────────────────────────────────────────
// Runs on every request at the edge (no cold start).
// Responsibilities:
//   1. HTTPS redirect in production
//   2. Block obviously bad bots/scanners
//   3. Attach a unique X-Request-Id for tracing
//   4. Prevent access to sensitive internal paths

const BLOCKED_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /acunetix/i,
  /masscan/i,
  /zgrab/i,
  /python-requests\/2\.[0-3]/i, // old scraper versions
];

const PRIVATE_PATHS = [
  '/_next/static',  // never blocked — handled by CDN
];

export function middleware(request: NextRequest) {
  const { pathname, protocol } = request.nextUrl;
  const hostname = request.nextUrl.hostname;
  const headers = new Headers(request.headers);

  // ── 1. Hide Dashboard on production server (Wasmer / deployed domains) ────
  // Keeps accessible on localhost / 127.0.0.1 for local development
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('localhost') ||
    process.env.ENABLE_DASHBOARD === 'true';

  if (pathname.startsWith('/dashboard') && !isLocalhost) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = '/';
    return NextResponse.redirect(homeUrl, { status: 307 });
  }

  // ── 2. HTTPS redirect in production ────────────────────────────────────────
  const appUrl = process.env.APP_URL;
  if (
    process.env.NODE_ENV === 'production' &&
    appUrl &&
    protocol === 'http:' &&
    !hostname.includes('localhost')
  ) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, { status: 301 });
  }

  // ── 3. Block malicious user-agents ─────────────────────────────────────────
  const ua = request.headers.get('user-agent') || '';
  const isBlocked = BLOCKED_UA_PATTERNS.some(pattern => pattern.test(ua));
  if (isBlocked) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── 4. Attach request tracing ID ────────────────────────────────────────────
  const requestId =
    request.headers.get('x-request-id') ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  headers.set('x-request-id', requestId);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set('X-Request-Id', requestId);

  return response;
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|ttf)).*)',
  ],
};
