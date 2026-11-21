import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Avatar, Badge, BottomSheet, Button, Icon, ListItem } from '../ds';
import { useApp } from '../app/store';
import { TopBar, card, helpers, openWhatsApp } from '../app/view';
import { BK_ST, NOTIFS, PURPOSES } from '../i18n/strings';
import { auth, logoUrl, remote } from '../data/api';

/** Countries MUJEEB works in. Only Oman is open for now; the others show as coming soon. */
const COUNTRIES = [
  { code: 'OM', flag: '🇴🇲', ar: 'عُمان', en: 'Oman', live: true },
  { code: 'SA', flag: '🇸🇦', ar: 'السعودية', en: 'Saudi Arabia', live: false },
  { code: 'QA', flag: '🇶🇦', ar: 'قطر', en: 'Qatar', live: false },
];

const ROOT = { padding: 'calc(var(--top-inset) + 8px) 20px 100px', display: 'flex', flexDirection: 'column' } as const;
const badge = (m: Record<string, readonly [string, string, string]>, k: string, ar: boolean) => ({ label: m[k][ar ? 0 : 1], tone: m[k][2] });

export function Profile() {
  const a = useApp();
  const { t, ar, bookings, me } = a;
  const [askDelete, setAskDelete] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const soon = () => a.showToast(ar ? 'قريبًا' : 'Coming soon', 'info');
  // With Supabase the profile is the real account; the demo keeps its sample customer.
  const live = auth.enabled;
  const rows = [
    ...(live ? [] : [{ icon: 'calendar-check', color: 'amber', title: t.myBookings, sub: String(bookings.filter(b => ['pending', 'confirmed', 'reschedule'].includes(b.st)).length) + ' ' + t.active, go: () => a.go('bookings') }]),
    ...(live ? [] : [{ icon: 'bell', color: 'sky', title: t.notifications, sub: NOTIFS.length + t.newN, go: () => a.go('notifs') }]),
    { icon: 'globe', color: 'violet', title: t.country, sub: COUNTRIES[0].flag + ' ' + (ar ? COUNTRIES[0].ar : COUNTRIES[0].en), go: () => setCountryOpen(true) },
    { icon: 'languages', color: 'teal', title: t.language, sub: t.langName, go: () => a.setLang(ar ? 'en' : 'ar') },
    { icon: 'life-buoy', color: 'green', title: t.help, go: soon },
  ];
  const remove = async () => {
    setDeleting(true);
    const ok = await auth.deleteAccount();
    setDeleting(false);
    setAskDelete(false);
    a.showToast(String(ok ? t.deletedT : t.errFailed), ok ? 'success' : 'error');
  };
  return (
    <div style={{ ...ROOT, gap: 18 }}>
      {/* Page title, like «جميع الخدمات» on the services tab. */}
      <span style={{ font: 'var(--type-h2)' }}>{t.myAccount}</span>
      {live && !me ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 18, ...card }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 56, height: 56, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-subtle, var(--neutral-100))', color: 'var(--brand)' }}><Icon name="user-round" size={28} /></span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: 'var(--type-h3)' }}>{t.guest}</span>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{t.guestSub}</span>
            </div>
          </div>
          <Button fullWidth iconLeft="user-round" onClick={() => a.setAuthStep('signin')}>{t.signInCta}</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, ...card }}>
          <Avatar name={live ? me!.name || me!.email : 'Ahmed Balushi'} size={60} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: 'var(--type-h3)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{live ? me!.name || me!.email.split('@')[0] : t.userName}</span>
            <span style={{ alignSelf: 'flex-start', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }} dir="ltr">{live ? me!.email : '+968 9123 4567'}</span>
            {!live && <span style={{ font: 'var(--type-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--text-tertiary)' }}>{t.memberSince}</span>}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 12px', ...card }}>
        {rows.map(r => <ListItem key={r.icon} icon={r.icon} color={r.color} title={r.title} subtitle={r.sub} onClick={r.go} />)}
      </div>
      {(!live || me) && (
        <div style={{ padding: '4px 12px', ...card }}>
          <ListItem icon="log-out" danger title={t.signOut} onClick={live ? a.signOut : soon} />
          {live && <ListItem icon="trash-2" danger title={t.deleteAccount} onClick={() => setAskDelete(true)} />}
        </div>
      )}
      {/* Over the whole phone screen, not inside the scrolling page. */}
      {createPortal(<div style={{ position: 'absolute', inset: 0, zIndex: 55, pointerEvents: 'none' }}>
        <BottomSheet open={countryOpen} onClose={() => setCountryOpen(false)} title={t.country}>
          {COUNTRIES.map(c => (
            <button key={c.code} type="button" disabled={!c.live} onClick={() => setCountryOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', minHeight: 56, padding: '10px 4px', border: 'none', background: 'none', cursor: c.live ? 'pointer' : 'default', textAlign: 'start', fontFamily: 'var(--font-sans)', opacity: c.live ? 1 : 0.55 }}>
              <span aria-hidden="true" style={{ flex: 'none', width: 40, height: 40, borderRadius: 12, background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{c.flag}</span>
              <span style={{ flex: 1, font: 'var(--type-body-strong)', color: 'var(--text-primary)' }}>{ar ? c.ar : c.en}</span>
              {c.live ? <Icon name="check" size={20} color="var(--accent)" /> : <Badge tone="neutral" size="sm">{t.comingSoon}</Badge>}
            </button>
          ))}
        </BottomSheet>
        <BottomSheet open={askDelete} onClose={() => setAskDelete(false)} title={t.deleteTitle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '4px 20px calc(24px + var(--safe-bottom))' }}>
            <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{t.deleteBody}</p>
            <Button fullWidth variant="danger" loading={deleting} onClick={remove}>{t.deleteConfirm}</Button>
            <Button fullWidth variant="secondary" onClick={() => setAskDelete(false)}>{t.cancel}</Button>
          </div>
        </BottomSheet>
      </div>, document.querySelector('.mj-frame') || document.body)}
    </div>
  );
}

export function Bookings() {
  const a = useApp();
  const { t, ar, bookings, setBookings } = a;
  const h = helpers(a);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={t.myBookings} onBack={a.back} />
      <div style={{ padding: '8px 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bookings.map(b => {
          const co = a.idx.co.get(b.co);
          const p = PURPOSES.find(x => x[0] === b.p)!;
          const bd = badge(BK_ST, b.st, ar);
          const resched = b.st === 'reschedule';
          const canCancel = ['pending', 'confirmed', 'reschedule'].includes(b.st);
          const accept = () => {
            setBookings(bs => bs.map(x => (x.id === b.id ? { ...x, st: 'confirmed', dAr: x.nAr || x.dAr, dEn: x.nEn || x.dEn, time: x.nTime || x.time } : x)));
            a.showToast(t.rescheduled);
            remote.acceptReschedule(b.id).catch(() => {});
          };
          const cancel = () => {
            setBookings(bs => bs.map(x => (x.id === b.id ? { ...x, st: 'cancelled' } : x)));
            a.showToast(t.cancelledT, 'info');
            remote.cancelBooking(b.id).catch(() => {});
          };
          return (
            <div key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, ...card }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ flex: 'none', width: 48, height: 48, borderRadius: 'var(--radius-tile)', background: 'var(--cat-amber-100)', color: 'var(--cat-amber-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={p[5]} size={24} /></span>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: 'var(--type-title)' }}>{ar ? p[1] : p[2]}</span>
                  {co && <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}><Avatar name={h.coName(co)} src={logoUrl(co.id)} size={18} />{h.coName(co)}</span>}
                </div>
                <Badge tone={bd.tone} size="sm">{bd.label}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', font: 'var(--type-body-sm)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="calendar" size={15} color="var(--text-tertiary)" />{ar ? b.dAr : b.dEn}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="clock" size={15} color="var(--text-tertiary)" />{b.time}</span>
              </div>
              <span style={{ marginTop: -6, font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{b.id}</span>
              {resched && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--info-tint)', font: 'var(--type-body-sm)', color: 'var(--info)' }}>
                  <Icon name="calendar-clock" size={16} /><span style={{ fontWeight: 'var(--fw-bold)' }}>{t.proposed}:</span>{(ar ? b.nAr : b.nEn) + ' · ' + b.nTime}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                {co && <Button variant="secondary" size="sm" iconLeft="message-circle" onClick={() => openWhatsApp(a, co)}>{t.whatsapp}</Button>}
                {resched && <Button size="sm" iconLeft="check" onClick={accept}>{t.acceptTime}</Button>}
                {canCancel && <Button variant="ghost" size="sm" onClick={cancel}>{t.cancel}</Button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Notifications() {
  const a = useApp();
  const { t, ar, setNotifsSeen } = a;
  // Opening the list clears the dot on the «حسابي» tab.
  useEffect(() => setNotifsSeen(true), [setNotifsSeen]);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={t.notifications} onBack={a.back} />
      <div style={{ margin: '8px 20px 40px', padding: '4px 12px', ...card }}>
        {NOTIFS.map((n, k) => <ListItem key={k} icon={n[0]} color={n[1]} title={ar ? n[2] : n[3]} subtitle={(ar ? n[5] : n[6]) + (n[4] ? ' · ' + n[4] : '')} chevron={false} />)}
      </div>
    </div>
  );
}
