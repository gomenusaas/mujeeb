import { useEffect, useRef } from 'react';
import { Avatar, Badge, Button, ChatBubble, EmptyState, Icon, IconButton, ListItem } from '../ds';
import { useApp } from '../app/store';
import { BottomBar, Img, TopBar, callPhone, card, helpers, stop } from '../app/view';
import { BK_ST, NOTIFS, PURPOSES, Q_ST, RFQ_ST } from '../i18n/strings';
import { logoUrl, remote } from '../data/api';
import { Note } from './Flows';

const ROOT = { padding: 'calc(var(--top-inset) + 8px) 20px 100px', display: 'flex', flexDirection: 'column' } as const;
const badge = (m: Record<string, readonly [string, string, string]>, k: string, ar: boolean) => ({ label: m[k][ar ? 0 : 1], tone: m[k][2] });
const fmt3 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export function Messages() {
  const a = useApp();
  const { t, ar, chats } = a;
  const h = helpers(a);
  const ids = Object.keys(chats).filter(id => chats[id].msgs.length && a.idx.co.has(id));
  return (
    <div style={{ ...ROOT, gap: 14 }}>
      <span style={{ font: 'var(--type-h1)' }}>{t.messages}</span>
      {!ids.length && <EmptyState icon="message-circle" title={t.noChats} body={t.noChatsBody} />}
      {ids.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', ...card, overflow: 'hidden' }}>
          {ids.map(id => {
            const co = a.idx.co.get(id)!, c = chats[id], last = c.msgs[c.msgs.length - 1];
            return (
              <button key={id} type="button" onClick={() => a.openChat(id)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', border: 'none', borderBottom: '1px solid var(--border-subtle)', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'start' }}>
                <Avatar name={h.coName(co)} src={logoUrl(id)} size={48} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ font: 'var(--type-body-strong)', color: 'var(--text-primary)' }}>{h.coName(co)}</span>
                    <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{last.time}</span>
                  </span>
                  <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{(last.mine ? t.you : '') + (ar ? last.ar : last.en)}</span>
                  {c.ref && <span style={{ font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{c.ref}</span>}
                </span>
                {c.unread > 0 && <Badge tone="accent" size="sm">{String(c.unread)}</Badge>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ChatPage({ scrollEl }: { scrollEl: React.RefObject<HTMLDivElement | null> }) {
  const a = useApp();
  const { t, ar, top, chats, draft, setDraft } = a;
  const h = helpers(a);
  const co = a.idx.co.get(top.id!)!;
  const c = chats[co.id];
  const n = c?.msgs.length || 0;
  const first = useRef(true);
  useEffect(() => {
    const el = scrollEl.current;
    // Scroll to newest message, but leave the initial top-reset alone.
    if (el && !first.current) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    first.current = false;
  }, [n, scrollEl]);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, padding: 'var(--top-inset) 16px 8px', display: 'flex', alignItems: 'center', gap: 10, background: 'oklch(0.985 0.004 285 / 0.86)', backdropFilter: 'var(--blur-bar)', WebkitBackdropFilter: 'var(--blur-bar)', boxShadow: '0 1px 0 var(--border-subtle)' }}>
        <IconButton icon="arrow-left" size={40} onClick={a.back} label="Back" />
        <div onClick={() => a.go('company', { id: co.id })} style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={40} online />
          <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ font: 'var(--type-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.coName(co)}</span>
            <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{t.replyFast}</span>
          </span>
        </div>
        <IconButton icon="phone" variant="tonal" size={40} onClick={() => callPhone(a, co.phone)} label={t.call} />
      </div>
      <div style={{ flex: 1, padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {c?.ref && (
          <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-sunken)', font: 'var(--type-caption)', color: 'var(--text-secondary)' }}>
            <Icon name="link" size={13} />{t.ref} <span style={{ font: 'var(--type-mono)', fontSize: 11 }}>{c.ref}</span>
          </div>
        )}
        {(c?.msgs || []).map((m, k) => <ChatBubble key={k} mine={m.mine} time={m.time}>{ar ? m.ar : m.en}</ChatBubble>)}
      </div>
      <form onSubmit={e => { e.preventDefault(); a.send(); }} style={{ position: 'sticky', bottom: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px calc(26px + var(--safe-bottom))', background: 'oklch(1 0 0 / 0.94)', backdropFilter: 'var(--blur-bar)', WebkitBackdropFilter: 'var(--blur-bar)', boxShadow: 'var(--shadow-up)' }}>
        <IconButton icon="paperclip" variant="plain" size={44} label="Attach" onClick={() => a.showToast(ar ? 'المرفقات قريبًا' : 'Attachments coming soon', 'info')} />
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder={t.typeMsg} aria-label={t.typeMsg} enterKeyHint="send"
          style={{ flex: 1, minWidth: 0, height: 44, padding: '0 16px', border: 'none', outline: 'none', borderRadius: 'var(--radius-pill)', background: 'var(--surface-sunken)', font: 'var(--type-body)', color: 'var(--text-primary)' }} />
        <IconButton icon="send" variant="filled" size={44} onClick={a.send} label="Send" />
      </form>
    </div>
  );
}

export function Profile() {
  const a = useApp();
  const { t, ar, quotes, bookings, fav } = a;
  const soon = () => a.showToast(ar ? 'قريبًا' : 'Coming soon', 'info');
  const rows = [
    { icon: 'file-text', color: 'violet', title: t.myQuotes, sub: quotes.length + t.requests, go: () => a.go('quotes') },
    { icon: 'calendar-check', color: 'amber', title: t.myBookings, sub: String(bookings.filter(b => ['pending', 'confirmed', 'reschedule'].includes(b.st)).length) + ' ' + t.active, go: () => a.go('bookings') },
    { icon: 'heart', color: 'pink', title: t.favorites, sub: Object.values(fav).filter(Boolean).length + t.companiesN, go: () => a.go('favs') },
    { icon: 'bell', color: 'sky', title: t.notifications, sub: NOTIFS.length + t.newN, go: () => a.go('notifs') },
    { icon: 'languages', color: 'teal', title: t.language, sub: t.langName, go: () => a.setLang(ar ? 'en' : 'ar') },
    { icon: 'settings', color: 'indigo', title: t.settings, go: soon },
    { icon: 'life-buoy', color: 'green', title: t.help, go: soon },
  ];
  return (
    <div style={{ ...ROOT, gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, ...card }}>
        <Avatar name="Ahmed Balushi" size={60} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: 'var(--type-h3)' }}>{t.userName}</span>
          <span style={{ alignSelf: 'flex-start', font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }} dir="ltr">+968 9123 4567</span>
          <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{t.memberSince}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 12px', ...card }}>
        {rows.map(r => <ListItem key={r.icon} icon={r.icon} color={r.color} title={r.title} subtitle={r.sub} onClick={r.go} />)}
      </div>
      <div style={{ padding: '4px 12px', ...card }}>
        <ListItem icon="log-out" danger title={t.signOut} onClick={soon} />
      </div>
    </div>
  );
}

export function Quotes() {
  const a = useApp();
  const { t, ar, quotes } = a;
  const h = helpers(a);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={t.myQuotes} onBack={a.back} />
      <div style={{ padding: '8px 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {quotes.map(q => {
          const co = a.idx.co.get(q.co);
          const b = badge(RFQ_ST, q.st, ar);
          return (
            <div key={q.id} onClick={() => a.go('quote', { id: q.id })} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, ...card, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ flex: 'none', width: 48, height: 48, borderRadius: 'var(--radius-tile)', background: 'var(--brand-tint-strong)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="file-text" size={22} /></span>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: 'var(--type-title)' }}>{ar ? q.tAr : q.tEn}</span>
                  <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{co ? h.coName(co) : ''}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)' }}>
                <span style={{ font: 'var(--type-mono)', color: 'var(--text-secondary)' }}>{q.id}</span>
                <Badge tone={b.tone} size="sm">{b.label}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function QuotePage() {
  const a = useApp();
  const { t, ar, top, quotes, setQuotes } = a;
  const h = helpers(a);
  const q = quotes.find(x => x.id === top.id);
  if (!q) return null;
  const co = a.idx.co.get(q.co)!;
  const rb = badge(RFQ_ST, q.st, ar);
  const Q = q.quote;
  const money = (n: number) => (ar ? fmt3(n) + ' ر.ع.' : 'OMR ' + fmt3(n));
  const totals = Q && (() => {
    const sub = Q.lines.reduce((n, l) => n + l[2] * l[3], 0), net = sub - Q.discount, vat = net * Q.vat;
    return { sub, vat, total: net + vat };
  })();
  const respond = (accept: boolean) => {
    if (!Q) return;
    const st = accept ? 'accepted' : 'rejected';
    setQuotes(qs => qs.map(x => (x.id === q.id && x.quote ? { ...x, quote: { ...x.quote, st }, st: accept ? 'closed' : x.st } : x)));
    a.showToast(accept ? t.accepted : t.rejected, accept ? 'success' : 'info');
    remote.respondQuotation(Q.no, accept).catch(() => {});
  };
  const open = Q && (Q.st === 'sent' || Q.st === 'viewed');
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={ar ? q.tAr : q.tEn} subtitle={q.id} onBack={a.back} />
      <div style={{ flex: 1, padding: '8px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={44} verified />
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: 'var(--type-body-strong)' }}>{h.coName(co)}</span>
            <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{q.date}</span>
          </span>
          <Badge tone={rb.tone} size="sm">{rb.label}</Badge>
        </div>
        {q.askAr && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-card)', background: 'var(--warning-tint)' }}>
            <span style={{ font: 'var(--type-caption)', color: 'oklch(0.48 0.11 65)' }}>{t.providerAsks}</span>
            <span style={{ font: 'var(--type-body)', color: 'var(--text-primary)' }}>{ar ? q.askAr : q.askEn}</span>
            <Button variant="dark" size="sm" iconLeft="message-circle" onClick={() => a.openChat(q.co)} style={{ alignSelf: 'flex-start' }}>{t.replyMsg}</Button>
          </div>
        )}
        {!Q && <EmptyState icon="hourglass" color="violet" title={t.quotation} body={t.waitingQuote} />}
        {Q && totals && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, ...card }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ font: 'var(--type-title)' }}>{t.quotation}</span><span style={{ font: 'var(--type-mono)', color: 'var(--text-tertiary)' }}>{Q.no}</span></span>
                <Badge tone={Q_ST[Q.st][2]} size="sm">{Q_ST[Q.st][ar ? 0 : 1]}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                {Q.lines.map((l, k) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ font: 'var(--type-body-sm)', fontWeight: 600 }}>{ar ? l[0] : l[1]}</span>
                      <span style={{ alignSelf: 'flex-start', font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }} dir="ltr">{l[2] + ' × ' + fmt3(l[3])}</span>
                    </span>
                    <span style={{ font: 'var(--type-body-sm)', fontWeight: 700, whiteSpace: 'nowrap' }}>{money(l[2] * l[3])}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t.subtotal}</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{money(totals.sub)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t.discount}</span><span style={{ color: 'var(--success)', fontWeight: 600 }}>{'− ' + money(Q.discount)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t.vat}</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{money(totals.vat)}</span></div>
                <div style={{ height: 1, background: 'var(--border-default)', margin: '2px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--type-title)', color: 'var(--text-primary)' }}><span>{t.total}</span><span style={{ fontWeight: 800 }}>{money(totals.total)}</span></div>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}><Icon name="clock" size={14} />{t.validUntil} {Q.valid}</span>
              <Button variant="outline" iconLeft="download" fullWidth onClick={() => a.showToast(t.pdfToast)}>{t.downloadPdf}</Button>
            </div>
            <Note icon="info" color="var(--info)">{t.acceptNote}</Note>
          </>
        )}
      </div>
      {open && (
        <BottomBar style={{ display: 'flex', gap: 10, marginTop: 0 }}>
          <Button size="lg" variant="danger" onClick={() => respond(false)}>{t.reject}</Button>
          <Button size="lg" iconLeft="check" onClick={() => respond(true)} style={{ flex: 1 }}>{t.accept}</Button>
        </BottomBar>
      )}
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
                  <Icon name="calendar-clock" size={16} /><span style={{ fontWeight: 700 }}>{t.proposed}:</span>{(ar ? b.nAr : b.nEn) + ' · ' + b.nTime}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" size="sm" iconLeft="message-circle" onClick={() => a.openChat(b.co)}>{t.contactCo}</Button>
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

export function Favorites() {
  const a = useApp();
  const { t, catalog, fav } = a;
  const h = helpers(a);
  const list = catalog.companies.filter(c => fav[c.id]).map(h.coV);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={t.favorites} onBack={a.back} />
      {!list.length && <EmptyState icon="heart" color="pink" title={t.noFav} body={t.noFavBody} />}
      <div style={{ padding: '8px 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map(co => (
          <div key={co.id} onClick={co.open} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, ...card, cursor: 'pointer' }}>
            <span style={{ flex: 'none', width: 88, aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}><Img src={co.cover} /></span>
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ font: 'var(--type-title)' }}>{co.name}</span>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{co.cat}</span>
              <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{co.city}</span>
            </span>
            <span onClick={stop}><IconButton icon="heart" variant="plain" size={40} active={co.fav} onClick={co.onFav} label={t.favorites} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Notifications() {
  const a = useApp();
  const { t, ar } = a;
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={t.notifications} onBack={a.back} />
      <div style={{ margin: '8px 20px 40px', padding: '4px 12px', ...card }}>
        {NOTIFS.map(n => <ListItem key={n[4]} icon={n[0]} color={n[1]} title={ar ? n[2] : n[3]} subtitle={(ar ? n[5] : n[6]) + ' · ' + n[4]} chevron={false} />)}
      </div>
    </div>
  );
}
