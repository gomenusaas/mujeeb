// Password-protects the whole site with HTTP Basic Auth (works on Netlify's free plan).
//
// Credentials, in order of priority:
//   1. Netlify environment variables SITE_USER and SITE_PASSWORD, if both are set.
//   2. Otherwise the built-in login below, stored only as a salted PBKDF2 hash,
//      so the password itself is not readable in this public repository.
//      To change it, generate a new hash with scripts/hash-password.mjs.

declare const Netlify: { env: { get(name: string): string | undefined } } | undefined;
declare const Deno: { env: { get(name: string): string | undefined } } | undefined;

export const BUILT_IN = {
  salt: '46bba5b66b9a5ce475a85de6257c05d5',
  iterations: 5000,
  hash: 'e26b8c20ba48f222752eaa961a770cba86440f4a7f819253cc55b3df32f15313',
};

const realm = 'Basic realm="MUJEEB", charset="UTF-8"';

const env = (name: string) => {
  try {
    return (typeof Netlify !== 'undefined' ? Netlify.env.get(name) : undefined) ??
      (typeof Deno !== 'undefined' ? Deno.env.get(name) : undefined);
  } catch { return undefined; }
};

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
const unhex = (s: string) => new Uint8Array(s.match(/../g)!.map(h => parseInt(h, 16)));

async function pbkdf2(text: string, salt: string, iterations: number) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(text), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(salt), iterations }, key, 256));
}

// Every page and asset request carries the same header; remember accepted ones so the hash runs once.
const accepted = new Set<string>();

export async function check(req: Request, user?: string, pass?: string): Promise<Response | null> {
  const header = req.headers.get('authorization') || '';
  if (accepted.has(header)) return null;
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try { decoded = new TextDecoder().decode(Uint8Array.from(atob(encoded), c => c.charCodeAt(0))); } catch { /* malformed */ }
    const i = decoded.indexOf(':');
    if (i > 0) {
      const u = decoded.slice(0, i), p = decoded.slice(i + 1);
      const ok = user && pass
        ? safeEqual(u, user) && safeEqual(p, pass)
        : safeEqual(await pbkdf2(u + ':' + p, BUILT_IN.salt, BUILT_IN.iterations), BUILT_IN.hash);
      if (ok) { if (accepted.size < 100) accepted.add(header); return null; }
    }
  }
  return new Response('Password required.', { status: 401, headers: { 'WWW-Authenticate': realm } });
}

export default async (req: Request) =>
  (await check(req, env('SITE_USER')?.trim(), env('SITE_PASSWORD')?.trim())) ?? undefined;

export const config = { path: '/*' };
