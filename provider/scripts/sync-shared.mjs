// Copies the parts the provider app shares with the customer app (../app) into src/shared/:
// the Servly design system (components, icons, tokens) and the bundled demo dataset.
// The customer app is the single source of truth; src/shared/ is generated and git-ignored.
import fs from 'node:fs';

const from = new URL('../../app/src/', import.meta.url);
const to = new URL('../src/shared/', import.meta.url);

fs.rmSync(to, { recursive: true, force: true });
fs.mkdirSync(to, { recursive: true });
fs.cpSync(new URL('ds/', from), new URL('ds/', to), { recursive: true });
fs.copyFileSync(new URL('data/demo.json', from), new URL('demo.json', to));
console.log('[provider] synced design system and demo data from ../app');
