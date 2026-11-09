// Password-protects the whole site with HTTP Basic Auth (works on Netlify's free plan).
// Credentials come from the site's environment variables SITE_USER and SITE_PASSWORD,
// never from the repository. If they are not set, the site stays locked.

declare const Netlify: { env: { get(name: string): string | undefined } };

const realm = 'Basic realm="MUJEEB", charset="UTF-8"';

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function check(req: Request, user?: string, pass?: string): Response | null {
  if (!user || !pass) return new Response('Site password is not configured.', { status: 503 });
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
  check(req, Netlify.env.get('SITE_USER'), Netlify.env.get('SITE_PASSWORD')) ?? undefined;

export const config = { path: '/*' };
