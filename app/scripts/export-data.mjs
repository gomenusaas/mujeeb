// Evaluates the design bundle's mujeeb-data.js and writes the final dataset as JSON.
import fs from 'node:fs';
import vm from 'node:vm';
const src = fs.readFileSync(new URL('../../project/mujeeb-data.js', import.meta.url), 'utf8');
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const MJ = ctx.window.MJ;

// Demo working hours per company: index = weekday (0 = Sunday), null = closed, otherwise
// [opens, closes] or [opens, closes, opens2, closes2]. Three common Omani patterns, picked by id.
const PATTERNS = [
  { days: [0, 1, 2, 3, 4, 6], hrs: ['08:00', '18:00'] },                   // Saturday – Thursday, Friday off
  { days: [0, 1, 2, 3, 4, 6], hrs: ['08:00', '13:00', '16:00', '21:00'] }, // split shift
  { days: [0, 1, 2, 3, 4], hrs: ['07:30', '15:30'] },                      // Sunday – Thursday
];
const hoursFor = id => {
  const p = PATTERNS[[...id].reduce((n, ch) => n + ch.charCodeAt(0), 0) % PATTERNS.length];
  return Array.from({ length: 7 }, (_, day) => (p.days.includes(day) ? p.hrs : null));
};
// Demo project videos (free Mixkit stock clips, https://mixkit.co/license/#videoFree), by album id.
const mixkit = id => 'https://assets.mixkit.co/videos/' + id + '/' + id + '-720.mp4';
const VIDEOS = { a1: [mixkit(4010)], a2: [mixkit(43033)], a3: [mixkit(41178)], 'ag0-2': [mixkit(1439)] };
const out = {
  cats: MJ.CATS.map(({ i, ar, en, sar, sen, icon, color, art }) => ({ i, ar, en, sar, sen, icon, color, art })),
  gov: MJ.GOV, hours: MJ.HOURS,
  companies: MJ.COMPANIES.map(({ logo, ...c }) => ({ ...c, hrs: hoursFor(c.id) })),
  services: MJ.SERVICES, albums: MJ.ALBUMS.map(a => ({ ...a, vids: VIDEOS[a.id] || [] })),
  bookings: MJ.BOOKINGS,
};
fs.writeFileSync(new URL('../src/data/demo.json', import.meta.url), JSON.stringify(out));
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Array.isArray(v) ? v.length : Object.keys(v).length])));
