/*
 * Offer adverts: 30 designs a company picks from when it posts an offer, drawn in any colour it likes. The customer
 * app shows them (category pages, the «العروض» tab, company pages) and the provider app uses the same drawing for its
 * style picker and preview, so what a company picks is exactly what customers see.
 *
 * Every advert is the shape of an ID card (85.6 × 54) and sizes everything in `cqw` (hundredths of its own width),
 * so one design works as a 150px thumbnail, a 240px strip card or a full-width advert.
 *
 * The 30 designs are 10 layouts × 3 variants (style = layout × 3 + variant):
 *   0 Fade       photo under a colour fade (side, full tint, bottom)
 *   1 Split      colour panel beside the photo (straight, diagonal, curved)
 *   2 Solid      plain colour with circles, stripes or dots (no photo)
 *   3 Sticker    photo with the offer on a round, star or tag-shaped sticker
 *   4 Ticket     a coupon with cut-out notches (stub at the end, stub at the start, tear-off strip)
 *   5 Frame      colour background with the photo as a polaroid, circle or arch
 *   6 Gradient   colour gradients (diagonal, glow, sunset; no photo)
 *   7 Big type   the value as the picture (outlined, on light, neon)
 *   8 Banner     photo with a corner ribbon, side band or centred label
 *   9 Minimal    white with an accent bar, a white card on the photo, or a duotone photo
 */
import type { CSSProperties, ReactNode } from 'react';

export interface OfferArtData {
  /** 0 … OFFER_STYLES - 1. */
  style: number;
  /** "#rrggbb". */
  color: string;
  /** The small label, e.g. «عرض خاص». */
  tag: string;
  /** Above the value, e.g. «خصم». */
  kicker: string;
  /** The value in big type, e.g. «٢٠٪» or «مجانًا». */
  big: string;
  /** What it's on, e.g. «على تصميم المجالس». */
  sub: string;
  /** The end date line, e.g. «حتى ٢٦ نوفمبر». */
  until: string;
  /** Full photo URL; designs with a photo fall back to a gradient without one. */
  photo?: string | null;
}

/** How many designs there are. */
export const OFFER_STYLES = 30;
/** Ready-made colours (a company can also pick any other). */
export const OFFER_PALETTE = [
  '#6C3FD1', '#3B5BDB', '#1C7ED6', '#0B9AA0', '#2F9E44', '#82A81B', '#E9A800',
  '#F08C00', '#E8590C', '#E03131', '#D6336C', '#AE3EC9', '#7A4E2D', '#262A33',
];

const HEX = /^#[0-9a-f]{6}$/i;
/** The colour, or the brand purple when it isn't "#rrggbb". */
export const offerColor = (c: string) => (HEX.test(c) ? c : OFFER_PALETTE[0]);
/** Relative luminance (0 dark … 1 light). */
function lum(c: string) {
  const ch = [1, 3, 5].map(k => parseInt(c.slice(k, k + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
const DARK_INK = '#1c1a24';
/** Text colour that reads on the colour: white on dark colours, near-black on light ones (yellow, lime). */
export const offerInk = (c: string) => (lum(offerColor(c)) > 0.42 ? DARK_INK : '#fff');
const mix = (c: string, pct: number, w = 'black') => 'color-mix(in oklch, ' + c + ' ' + pct + '%, ' + w + ')';

type Css = CSSProperties;
const fill: Css = { position: 'absolute', inset: 0 };
const box: Css = { ...fill, padding: '4.6cqw 5.2cqw', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' };

const T = {
  tag: (bg: string, ink: string): Css => ({ display: 'inline-flex', alignItems: 'center', height: '8.2cqw', padding: '0 3.3cqw', borderRadius: 999, background: bg, color: ink, font: '800 3.8cqw/1 var(--font-sans)', whiteSpace: 'nowrap' }),
  kicker: { font: '700 4.8cqw/1.25 var(--font-sans)', opacity: 0.92 } as Css,
  big: (k = 1): Css => ({ font: '800 ' + 13 * k + 'cqw/1.04 var(--font-sans)', letterSpacing: '-0.01em' }),
  sub: { font: '600 4.6cqw/1.3 var(--font-sans)', opacity: 0.92, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as Css,
  until: { display: 'inline-flex', alignItems: 'center', gap: '1.2cqw', font: '600 3.9cqw/1 var(--font-sans)', opacity: 0.88, whiteSpace: 'nowrap' } as Css,
};

const Clock = () => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" /><path d="M12 7v5l3 2" />
  </svg>
);

/** Tag, kicker, value and what it's on, stacked. */
function Copy({ d, ink, tagBg, tagInk, big = 1, w = '66%', center, noTag, bigInk }: {
  d: OfferArtData; ink: string; tagBg: string; tagInk: string; big?: number; w?: string; center?: boolean; noTag?: boolean; bigInk?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: center ? 'center' : 'flex-start', textAlign: center ? 'center' : 'start', color: ink, maxWidth: w, minWidth: 0 }}>
      {!noTag && d.tag && <span style={T.tag(tagBg, tagInk)}>{d.tag}</span>}
      {d.kicker && <span style={{ ...T.kicker, marginTop: noTag ? 0 : '2.2cqw' }}>{d.kicker}</span>}
      <span style={{ ...T.big(big), color: bigInk || ink }}>{d.big}</span>
      {d.sub && <span style={{ ...T.sub, marginTop: '0.6cqw' }}>{d.sub}</span>}
    </div>
  );
}
const Until = ({ d, ink, style }: { d: OfferArtData; ink: string; style?: Css }) =>
  d.until ? <span style={{ ...T.until, color: ink, marginTop: 'auto', ...style }}><Clock />{d.until}</span> : null;

/** The photo, filling its box (a colour gradient when there's none). */
function Photo({ d, c, style }: { d: OfferArtData; c: string; style?: Css }) {
  return d.photo
    ? <img src={d.photo} alt="" loading="lazy" decoding="async" draggable={false} style={{ ...fill, width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />
    : <div style={{ ...fill, background: 'linear-gradient(135deg, ' + mix(c, 80, 'white') + ', ' + mix(c, 55) + ')', ...style }} />;
}

const STAR = Array.from({ length: 32 }, (_, k) => {
  const r = k % 2 ? 42 : 50, a = (k / 32) * 2 * Math.PI;
  return (50 + r * Math.cos(a)).toFixed(1) + '% ' + (50 + r * Math.sin(a)).toFixed(1) + '%';
}).join(', ');

/** Cuts two round notches at (x%, y%) and its mirror, like a ticket's perforation (CSS mask). */
const notches = (a: string, b: string, r = 3.2): Css => {
  const g = (at: string) => 'radial-gradient(circle ' + r + 'cqw at ' + at + ', transparent ' + (r - 0.05) + 'cqw, #000 ' + r + 'cqw)';
  return { WebkitMaskImage: g(a) + ', ' + g(b), maskImage: g(a) + ', ' + g(b), WebkitMaskComposite: 'source-in', maskComposite: 'intersect' };
};

/** One design. `rtl` mirrors the side-dependent shapes (the copy always starts on the reading side). */
function draw(d: OfferArtData, rtl: boolean): ReactNode {
  const c = offerColor(d.color);
  const ink = offerInk(c);
  const dk = mix(c, 58), dk2 = mix(c, 34), lt = mix(c, 13, 'white'), lt2 = mix(c, 40, 'white');
  const toEnd = rtl ? 'to left' : 'to right';
  const X = (p: number) => (rtl ? 100 - p : p) + '%';
  const s = ((Math.round(d.style) % OFFER_STYLES) + OFFER_STYLES) % OFFER_STYLES;
  const v = s % 3;
  const onDark = { ink: '#fff', tagBg: '#fff', tagInk: dk };
  const onColor = { ink, tagBg: ink, tagInk: ink === '#fff' ? dk : c };
  const onLight = { ink: DARK_INK, tagBg: c, tagInk: ink };
  switch (Math.floor(s / 3)) {
    case 0: // Fade
      return (
        <>
          <Photo d={d} c={c} />
          {v === 0 && <div style={{ ...fill, background: 'linear-gradient(' + toEnd + ', ' + mix(dk, 96, 'transparent') + ' 0%, ' + mix(dk, 78, 'transparent') + ' 45%, ' + mix(dk, 8, 'transparent') + ' 100%)' }} />}
          {v === 1 && <div style={{ ...fill, background: 'radial-gradient(circle at 50% 50%, ' + mix(dk, 55, 'transparent') + ', ' + mix(dk, 88, 'transparent') + ')' }} />}
          {v === 2 && <div style={{ ...fill, background: 'linear-gradient(to top, ' + mix(dk, 97, 'transparent') + ' 0%, ' + mix(dk, 70, 'transparent') + ' 45%, transparent 80%)' }} />}
          <div style={{ ...box, ...(v === 1 ? { alignItems: 'center', justifyContent: 'center' } : v === 2 ? { justifyContent: 'flex-end' } : {}) }}>
            {v === 2 && d.tag && <span style={{ ...T.tag('#fff', dk), position: 'absolute', top: '4.6cqw', insetInlineStart: '5.2cqw' }}>{d.tag}</span>}
            <Copy d={d} {...onDark} center={v === 1} big={v === 1 ? 1.2 : 1} w={v === 0 ? '64%' : '88%'} noTag={v === 2} />
            {v === 0 && <Until d={d} ink="#fff" />}
            {v === 1 && <Until d={d} ink="#fff" style={{ marginTop: '2.4cqw' }} />}
            {v === 2 && <Until d={d} ink="#fff" style={{ marginTop: '2cqw' }} />}
          </div>
        </>
      );
    case 1: // Split
      return (
        <>
          <div style={{ ...fill, background: c }} />
          {v === 0 && <div style={{ position: 'absolute', top: 0, bottom: 0, insetInlineEnd: 0, width: '44%' }}><Photo d={d} c={c} /></div>}
          {v === 1 && <div style={{ ...fill, clipPath: 'polygon(' + X(58) + ' 0, ' + X(100) + ' 0, ' + X(100) + ' 100%, ' + X(44) + ' 100%)' }}><Photo d={d} c={c} /></div>}
          {v === 2 && <div style={{ position: 'absolute', top: '6%', bottom: '6%', insetInlineEnd: 0, width: '46%', overflow: 'hidden', borderStartStartRadius: '50cqw', borderEndStartRadius: '50cqw' }}><Photo d={d} c={c} /></div>}
          <div style={box}>
            <Copy d={d} {...onColor} w="52%" />
            <Until d={d} ink={ink} />
          </div>
        </>
      );
    case 2: { // Solid
      const soft = (p: number) => mix(ink, p, 'transparent');
      return (
        <>
          <div style={{ ...fill, background: c }} />
          {v === 0 && <>
            <span style={{ position: 'absolute', width: '72cqw', height: '72cqw', borderRadius: '50%', top: '-26cqw', insetInlineEnd: '-20cqw', background: soft(13) }} />
            <span style={{ position: 'absolute', width: '30cqw', height: '30cqw', borderRadius: '50%', bottom: '-10cqw', insetInlineEnd: '22cqw', background: soft(10) }} />
          </>}
          {v === 1 && <div style={{ ...fill, background: 'repeating-linear-gradient(' + (rtl ? '-45deg' : '45deg') + ', transparent 0 5cqw, ' + soft(11) + ' 5cqw 10cqw)', WebkitMaskImage: 'linear-gradient(' + toEnd + ', transparent 30%, #000 75%)', maskImage: 'linear-gradient(' + toEnd + ', transparent 30%, #000 75%)' }} />}
          {v === 2 && <div style={{ ...fill, background: 'radial-gradient(' + soft(26) + ' 0.75cqw, transparent 0.85cqw) 0 0 / 5cqw 5cqw' }} />}
          <div style={{ ...box, ...(v === 2 ? { alignItems: 'center', justifyContent: 'center' } : {}) }}>
            {v === 2 && <span style={{ position: 'absolute', inset: '9% 14%', borderRadius: '4cqw', background: c }} />}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: v === 2 ? 'center' : 'flex-start', flex: v === 2 ? 'none' : 1, maxWidth: '100%' }}>
              <Copy d={d} {...onColor} big={v === 0 ? 1.25 : 1.15} center={v === 2} w={v === 2 ? '100%' : '70%'} />
              <Until d={d} ink={ink} style={v === 2 ? { marginTop: '2cqw' } : undefined} />
            </div>
          </div>
        </>
      );
    }
    case 3: { // Sticker
      const shape: Css = v === 0 ? { borderRadius: '50%', transform: 'rotate(' + (rtl ? 8 : -8) + 'deg)' }
        : v === 1 ? { clipPath: 'polygon(' + STAR + ')', transform: 'rotate(' + (rtl ? -10 : 10) + 'deg)' }
        : { borderRadius: '5cqw', transform: 'rotate(' + (rtl ? -7 : 7) + 'deg)' };
      return (
        <>
          <Photo d={d} c={c} />
          <div style={{ ...fill, background: 'linear-gradient(to top, oklch(0 0 0 / 0.72) 0%, oklch(0 0 0 / 0.15) 55%, oklch(0 0 0 / 0.1) 100%)' }} />
          <div style={{ position: 'absolute', top: '50%', insetInlineEnd: '6cqw', width: v === 1 ? '46cqw' : '40cqw', height: v === 1 ? '46cqw' : '40cqw', marginTop: v === 1 ? '-23cqw' : '-20cqw', background: c, color: ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: v === 1 ? undefined : '0 1.5cqw 4cqw oklch(0 0 0 / 0.3)', ...shape }}>
            {v === 2 && <span style={{ position: 'absolute', top: '4cqw', width: '3.4cqw', height: '3.4cqw', borderRadius: '50%', background: '#fff', boxShadow: 'inset 0 0.4cqw 0.8cqw oklch(0 0 0 / 0.3)' }} />}
            {d.kicker && <span style={{ ...T.kicker, fontSize: '4.2cqw', marginTop: v === 2 ? '3cqw' : 0 }}>{d.kicker}</span>}
            <span style={{ ...T.big(0.9) }}>{d.big}</span>
          </div>
          <div style={{ ...box, width: '56%' }}>
            {d.tag && <span style={T.tag('#fff', dk)}>{d.tag}</span>}
            <span style={{ ...T.sub, marginTop: 'auto', color: '#fff', fontSize: '5cqw' }}>{d.sub}</span>
            <Until d={d} ink="#fff" style={{ marginTop: '1.6cqw' }} />
          </div>
        </>
      );
    }
    case 4: { // Ticket
      if (v === 2) {
        return (
          <div style={{ ...fill, ...notches('0 66%', '100% 66%') }}>
            <div style={{ position: 'absolute', insetInline: 0, top: 0, height: '66%', background: c }}>
              <span style={{ position: 'absolute', width: '44cqw', height: '44cqw', borderRadius: '50%', top: '-20cqw', insetInlineEnd: '-10cqw', background: mix(ink, 12, 'transparent') }} />
              <div style={{ ...box, justifyContent: 'center' }}><Copy d={{ ...d, sub: '' }} {...onColor} big={1.1} w="80%" /></div>
            </div>
            <div style={{ position: 'absolute', insetInline: 0, bottom: 0, height: '34%', background: '#fff', borderTop: '0.5cqw dashed ' + mix(c, 60, 'white'), display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3cqw', padding: '0 5.2cqw' }}>
              <span style={{ ...T.sub, color: DARK_INK, WebkitLineClamp: 1, fontSize: '4.2cqw' }}>{d.sub}</span>
              {d.until && <span style={{ ...T.until, color: dk, opacity: 1 }}><Clock />{d.until}</span>}
            </div>
          </div>
        );
      }
      const stubAtEnd = v === 0;
      const cut = stubAtEnd ? 66 : 34;
      return (
        <div style={{ ...fill, ...notches(X(cut) + ' 0', X(cut) + ' 100%') }}>
          {stubAtEnd ? <div style={{ ...fill, background: lt }} /> : <><Photo d={d} c={c} /><div style={{ ...fill, background: mix(dk, 72, 'transparent') }} /></>}
          <div style={{ position: 'absolute', top: 0, bottom: 0, [stubAtEnd ? 'insetInlineEnd' : 'insetInlineStart']: 0, width: '34%', background: c, color: ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2cqw', [stubAtEnd ? 'borderInlineStart' : 'borderInlineEnd']: '0.6cqw dashed ' + mix(ink, 45, 'transparent') }}>
            {d.kicker && <span style={{ ...T.kicker, fontSize: '4.2cqw' }}>{d.kicker}</span>}
            <span style={{ ...T.big(0.82) }}>{d.big}</span>
          </div>
          <div style={{ ...box, [stubAtEnd ? 'insetInlineEnd' : 'insetInlineStart']: '34%', ...(stubAtEnd ? {} : { paddingInlineStart: '6cqw' }) }}>
            {d.tag && <span style={stubAtEnd ? T.tag(c, ink) : T.tag('#fff', dk)}>{d.tag}</span>}
            <span style={{ ...T.sub, marginTop: '3cqw', fontSize: '5.4cqw', fontWeight: 700, color: stubAtEnd ? DARK_INK : '#fff', opacity: 1, WebkitLineClamp: 3 }}>{d.sub}</span>
            <Until d={d} ink={stubAtEnd ? dk : '#fff'} />
          </div>
        </div>
      );
    }
    case 5: { // Frame
      const frame: Css = v === 0
        ? { top: '12%', height: '72%', width: '38cqw', insetInlineEnd: '6cqw', padding: '1.6cqw 1.6cqw 6cqw', background: '#fff', borderRadius: '1.2cqw', transform: 'rotate(' + (rtl ? -4 : 4) + 'deg)', boxShadow: '0 2cqw 5cqw oklch(0 0 0 / 0.3)' }
        : v === 1
          ? { top: '50%', marginTop: '-22cqw', width: '44cqw', height: '44cqw', insetInlineEnd: '5cqw', borderRadius: '50%', border: '1.4cqw solid ' + mix(ink, 85, 'transparent'), boxShadow: '0 2cqw 5cqw oklch(0 0 0 / 0.25)' }
          : { bottom: 0, height: '84%', width: '38cqw', insetInlineEnd: '6cqw', borderRadius: '19cqw 19cqw 0 0', border: '1.2cqw solid ' + mix(ink, 80, 'transparent'), borderBottom: 'none' };
      return (
        <>
          <div style={{ ...fill, background: 'radial-gradient(circle at ' + X(85) + ' 20%, ' + mix(c, 80, 'white') + ', ' + c + ' 60%)' }} />
          <div style={{ position: 'absolute', overflow: 'hidden', ...frame }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: v === 0 ? '0.6cqw' : undefined }}><Photo d={d} c={c} /></div>
          </div>
          <div style={box}>
            <Copy d={d} {...onColor} w="50%" />
            <Until d={d} ink={ink} />
          </div>
        </>
      );
    }
    case 6: { // Gradient
      if (v === 2) {
        return (
          <>
            <div style={{ ...fill, background: 'linear-gradient(to bottom, ' + dk2 + ' 0%, ' + dk + ' 55%, ' + c + ' 100%)' }} />
            <span style={{ position: 'absolute', width: '46cqw', height: '46cqw', borderRadius: '50%', bottom: '-18cqw', insetInlineEnd: '8cqw', background: 'linear-gradient(to bottom, ' + mix(c, 55, '#ffd36b') + ', ' + mix(c, 70, '#ff6b6b') + ')', WebkitMaskImage: 'repeating-linear-gradient(to bottom, #000 0 3.4cqw, transparent 3.4cqw 4.4cqw)', maskImage: 'repeating-linear-gradient(to bottom, #000 0 3.4cqw, transparent 3.4cqw 4.4cqw)' }} />
            <div style={box}>
              <Copy d={d} {...onDark} big={1.1} w="60%" />
              <Until d={d} ink="#fff" />
            </div>
          </>
        );
      }
      return (
        <>
          <div style={{ ...fill, background: v === 0
            ? 'linear-gradient(' + (rtl ? '225deg' : '135deg') + ', ' + c + ' 0%, ' + mix(c, 75, '#ff4d8d') + ' 55%, ' + mix(c, 60, '#3b1d8f') + ' 100%)'
            : 'radial-gradient(circle at ' + X(80) + ' 15%, ' + lt2 + ' 0%, ' + c + ' 38%, ' + dk + ' 100%)' }} />
          {v === 0 && <span style={{ position: 'absolute', width: '60cqw', height: '60cqw', borderRadius: '50%', top: '-12cqw', insetInlineEnd: '-14cqw', border: '0.8cqw solid oklch(1 0 0 / 0.25)' }} />}
          {v === 0 && <span style={{ position: 'absolute', width: '36cqw', height: '36cqw', borderRadius: '50%', top: '0', insetInlineEnd: '-2cqw', border: '0.8cqw solid oklch(1 0 0 / 0.2)' }} />}
          <div style={box}>
            <Copy d={d} {...onDark} big={1.2} w="66%" />
            <Until d={d} ink="#fff" />
          </div>
        </>
      );
    }
    case 7: { // Big type
      if (v === 1) {
        return (
          <>
            <div style={{ ...fill, background: lt }} />
            <div style={{ position: 'absolute', top: '10%', insetInlineEnd: '6cqw', width: '30cqw', height: '30cqw', borderRadius: '4cqw', overflow: 'hidden', transform: 'rotate(' + (rtl ? 5 : -5) + 'deg)', boxShadow: '0 1.6cqw 4cqw oklch(0 0 0 / 0.2)' }}><Photo d={d} c={c} /></div>
            <div style={box}>
              <Copy d={d} {...onLight} big={1.45} bigInk={dk} w="62%" />
              <Until d={d} ink={dk} />
            </div>
          </>
        );
      }
      if (v === 2) {
        const neon = mix(c, 72, 'white');
        return (
          <>
            <div style={{ ...fill, background: '#121019' }} />
            <div style={{ position: 'absolute', inset: '3cqw', borderRadius: '3cqw', border: '0.5cqw solid ' + neon, boxShadow: '0 0 2cqw ' + c + ', inset 0 0 2cqw ' + c }} />
            <div style={{ ...box, alignItems: 'center', justifyContent: 'center' }}>
              <Copy d={d} ink="#fff" tagBg={neon} tagInk="#121019" big={1.35} bigInk={neon} center w="90%" />
              <Until d={d} ink="#fff" style={{ marginTop: '2cqw' }} />
            </div>
          </>
        );
      }
      return (
        <>
          <div style={{ ...fill, background: c }} />
          <span aria-hidden="true" style={{ position: 'absolute', insetInlineEnd: '-3cqw', bottom: '-9cqw', font: '900 40cqw/1 var(--font-sans)', color: 'transparent', WebkitTextStroke: '0.45cqw ' + mix(ink, 40, 'transparent'), whiteSpace: 'nowrap', letterSpacing: '-0.03em' }}>{d.big}</span>
          <div style={box}>
            <Copy d={d} {...onColor} big={1.1} w="62%" />
            <Until d={d} ink={ink} />
          </div>
        </>
      );
    }
    case 8: { // Banner
      if (v === 0) {
        return (
          <>
            <Photo d={d} c={c} />
            {d.tag && <span style={{ position: 'absolute', top: '7cqw', insetInlineEnd: '-15cqw', width: '56cqw', height: '8cqw', background: '#fff', color: dk, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 3.8cqw/1 var(--font-sans)', transform: 'rotate(' + (rtl ? -35 : 35) + 'deg)', boxShadow: '0 1cqw 2cqw oklch(0 0 0 / 0.25)' }}>{d.tag}</span>}
            <div style={{ position: 'absolute', insetInline: 0, bottom: 0, height: '50%', background: c, padding: '3cqw 5.2cqw', display: 'flex', alignItems: 'center', gap: '4cqw', color: ink }}>
              <span style={{ display: 'flex', flexDirection: 'column', flex: 'none' }}>
                {d.kicker && <span style={{ ...T.kicker, fontSize: '4.2cqw' }}>{d.kicker}</span>}
                <span style={T.big(0.95)}>{d.big}</span>
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '1.4cqw', minWidth: 0, paddingInlineStart: '4cqw', borderInlineStart: '0.4cqw solid ' + mix(ink, 40, 'transparent') }}>
                <span style={{ ...T.sub, fontSize: '4.4cqw' }}>{d.sub}</span>
                {d.until && <span style={{ ...T.until, color: ink }}><Clock />{d.until}</span>}
              </span>
            </div>
          </>
        );
      }
      if (v === 1) {
        return (
          <>
            <Photo d={d} c={c} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, width: '46%', background: mix(c, 94, 'transparent') }} />
            <div style={{ ...box, width: '46%', paddingInline: '4.4cqw' }}>
              <Copy d={d} {...onColor} big={0.95} w="100%" />
              <Until d={d} ink={ink} />
            </div>
          </>
        );
      }
      return (
        <>
          <Photo d={d} c={c} />
          <div style={{ ...fill, background: 'oklch(0 0 0 / 0.25)' }} />
          <div style={{ ...fill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: c, color: ink, border: '0.8cqw solid #fff', borderRadius: '3cqw', padding: '3cqw 6cqw', transform: 'rotate(' + (rtl ? 3 : -3) + 'deg)', boxShadow: '0 2cqw 5cqw oklch(0 0 0 / 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '72%' }}>
              <Copy d={d} {...onColor} center big={1.05} w="100%" />
              <Until d={d} ink={ink} style={{ marginTop: '1.6cqw' }} />
            </div>
          </div>
        </>
      );
    }
    default: { // Minimal
      if (v === 0) {
        return (
          <>
            <div style={{ ...fill, background: '#fff' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, insetInlineEnd: 0, width: '38%' }}><Photo d={d} c={c} /></div>
            <span style={{ position: 'absolute', top: '16%', bottom: '16%', insetInlineStart: '5cqw', width: '1.3cqw', borderRadius: 9, background: c }} />
            <div style={{ ...box, width: '62%', paddingInlineStart: '10cqw' }}>
              <Copy d={d} {...onLight} bigInk={lum(c) > 0.42 ? dk : c} w="100%" />
              <Until d={d} ink={dk} />
            </div>
          </>
        );
      }
      if (v === 1) {
        return (
          <>
            <Photo d={d} c={c} />
            <div style={{ position: 'absolute', top: '6cqw', bottom: '6cqw', insetInlineStart: '5cqw', width: '56%', background: '#fff', borderRadius: '3cqw', boxShadow: '0 2cqw 5cqw oklch(0 0 0 / 0.25)', borderTop: '1.6cqw solid ' + c }} />
            <div style={{ ...box, top: '6cqw', bottom: '6cqw', insetInlineStart: '5cqw', width: '56%', padding: '3.4cqw 4.4cqw' }}>
              <Copy d={d} {...onLight} big={0.95} bigInk={lum(c) > 0.42 ? dk : c} w="100%" />
              <Until d={d} ink={dk} />
            </div>
          </>
        );
      }
      return (
        <>
          <div style={{ ...fill, background: dk2 }} />
          <Photo d={d} c={c} style={{ filter: 'grayscale(1) contrast(1.15)', opacity: 0.6 }} />
          <div style={{ ...fill, background: c, mixBlendMode: 'color' }} />
          <div style={{ ...fill, background: 'linear-gradient(' + toEnd + ', ' + mix(dk2, 92, 'transparent') + ' 0%, ' + mix(dk2, 60, 'transparent') + ' 55%, transparent 100%)' }} />
          <div style={box}>
            <Copy d={d} ink="#fff" tagBg={mix(c, 70, 'white')} tagInk={dk2} bigInk={mix(c, 60, 'white')} big={1.1} w="64%" />
            <Until d={d} ink="#fff" />
          </div>
        </>
      );
    }
  }
}

/**
 * An offer advert (fills its parent's width; the parent sets corners and shadow). `rtl` mirrors the side shapes.
 */
export function OfferArt({ d, rtl = true, style }: { d: OfferArtData; rtl?: boolean; style?: CSSProperties }) {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '85.6 / 54', containerType: 'inline-size', overflow: 'hidden', isolation: 'isolate', fontFamily: 'var(--font-sans)', textAlign: 'start', ...style }}>
      {draw(d, rtl)}
    </div>
  );
}
