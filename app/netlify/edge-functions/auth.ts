// Password-protects the whole site with HTTP Basic Auth (works on Netlify's free plan).
// Credentials come from the site's environment variables SITE_USER and SITE_PASSWORD,
// never from the repository. If they are not set, the site stays locked.

declare const Netlify: { env: { get(name: string): string | undefined } } | undefined;
declare const Deno: { env: { get(name: string): string | undefined } } | undefined;

const env = (name: string) =>
  (typeof Netlify !== 'undefined' ? Netlify.env.get(name) : undefined) ??
  (typeof Deno !== 'undefined' ? Deno.env.get(name) : undefined);

const realm = 'Basic realm="MUJEEB", charset="UTF-8"';

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function check(req: Request, user?: string, pass?: string): Response | null {
  if (!user || !pass) {
    // Names only, never values: tells the site owner which setting Netlify is not passing through.
    const missing = [!user && 'SITE_USER', !pass && 'SITE_PASSWORD'].filter(Boolean).join(' and ');
    return new Response(
      'Site password is not configured: ' + missing + ' is not set for this deploy.\n' +
      'In Netlify, add it under Site configuration > Environment variables with scope "All scopes" ' +
      'and "Same value for all deploy contexts", then trigger a new deploy.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
  const header = req.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try { decoded = atob(encoded); } catch { /* malformed header */ }
    const i = decoded.indexOf(':');
    if (i > 0 && safeEqual(decoded.slice(0, i), user) && safeEqual(decoded.slice(i + 1), pass)) return null;
  }
  return new Response('Password required.', { status: 401, headers: { 'WWW-Authenticate': realm } });
}

export default async (req: Request) =>
  check(req, env('SITE_USER')?.trim(), env('SITE_PASSWORD')?.trim()) ?? undefined;

export const config = { path: '/*' };
