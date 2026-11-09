// Evaluates the design bundle's mujeeb-data.js and writes the final dataset as JSON.
import fs from 'node:fs';
import vm from 'node:vm';
const src = fs.readFileSync(new URL('../../project/mujeeb-data.js', import.meta.url), 'utf8');
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const MJ = ctx.window.MJ;
const out = {
  cats: MJ.CATS.map(({ i, ar, en, sar, sen, icon, color, art }) => ({ i, ar, en, sar, sen, icon, color, art })),
  gov: MJ.GOV, hours: MJ.HOURS,
  companies: MJ.COMPANIES.map(({ logo, ...c }) => c),
  services: MJ.SERVICES, albums: MJ.ALBUMS,
  quotes: MJ.QUOTES, bookings: MJ.BOOKINGS, chats: MJ.CHATS,
};
fs.writeFileSync(new URL('../src/data/demo.json', import.meta.url), JSON.stringify(out));
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Array.isArray(v) ? v.length : Object.keys(v).length])));
