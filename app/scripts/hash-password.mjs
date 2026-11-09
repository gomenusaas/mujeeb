// Usage: node scripts/hash-password.mjs <username> <password>
// Prints the BUILT_IN block to paste into netlify/edge-functions/auth.ts.
import crypto from 'node:crypto';
const [user, pass] = process.argv.slice(2);
if (!user || !pass) { console.error('Usage: node scripts/hash-password.mjs <username> <password>'); process.exit(1); }
const salt = crypto.randomBytes(16).toString('hex'), iterations = 5000;
const hash = crypto.pbkdf2Sync(user + ':' + pass, Buffer.from(salt, 'hex'), iterations, 32, 'sha256').toString('hex');
console.log(`export const BUILT_IN = {\n  salt: '${salt}',\n  iterations: ${iterations},\n  hash: '${hash}',\n};`);
