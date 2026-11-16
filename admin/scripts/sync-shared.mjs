// Copies the part the admin app shares with the customer app (../app) into src/shared/:
// the Servly design system (components, icons, tokens).
// The customer app is the single source of truth; src/shared/ is generated and git-ignored.
import fs from 'node:fs';

const from = new URL('../../app/src/', import.meta.url);
const to = new URL('../src/shared/', import.meta.url);

fs.rmSync(to, { recursive: true, force: true });
fs.mkdirSync(to, { recursive: true });
fs.cpSync(new URL('ds/', from), new URL('ds/', to), { recursive: true });
console.log('[admin] synced design system from ../app');
