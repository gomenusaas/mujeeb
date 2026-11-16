import { Avatar, Button, Icon } from '../shared/ds';
import { api, logoOf } from '../api';
import { useA, useLoad } from '../state';
import { Card, PageHeader, Spinner, card } from '../ui';
import { LoadError } from './common';

/** Platform at a glance, plus the companies waiting for review. */
export function Overview() {
  const a = useA();
  const { t, num, pick } = a;
  const o = useLoad(() => api.overview(), []);
  const q = useLoad(() => api.companies('', 'pending'), []);
  const review = () => { a.setCompanyFilter('pending'); a.go('companies'); };
  const d = o.data;
  const tiles: { icon: string; tone: string; label: string; n: number; go?: () => void }[] = d ? [
    { icon: 'hourglass', tone: 'amber', label: t.pendingReview, n: d.pending, go: review },
    { icon: 'building-2', tone: 'green', label: t.liveCompanies, n: d.approved, go: () => { a.setCompanyFilter('approved'); a.go('companies'); } },
    { icon: 'eye-off', tone: 'steel', label: t.hiddenCompanies, n: d.hidden, go: () => { a.setCompanyFilter('hidden'); a.go('companies'); } },
    { icon: 'circle-alert', tone: 'ruby', label: t.rejectedCompanies, n: d.rejected, go: () => { a.setCompanyFilter('rejected'); a.go('companies'); } },
    { icon: 'user-round', tone: 'sky', label: t.customers, n: d.customers, go: () => a.go('users') },
    { icon: 'briefcase', tone: 'violet', label: t.companyAccounts, n: d.providers, go: () => a.go('users') },
    { icon: 'user-plus', tone: 'teal', label: t.newAccounts7, n: d.new_users_7d },
    { icon: 'phone', tone: 'green', label: t.contacts7, n: d.contacts_7d },
    { icon: 'trending-up', tone: 'indigo', label: t.activity7, n: d.events_7d },
    { icon: 'user-check', tone: 'orange', label: t.follows, n: d.follows },
    { icon: 'heart', tone: 'pink', label: t.favorites, n: d.favorites },
    { icon: 'images', tone: 'gold', label: t.projects, n: d.projects },
  ] : [];
  return (
    <>
      <PageHeader title={t.overview} subtitle={t.overviewSub}
        actions={<Button size="sm" variant="outline" iconLeft="refresh-cw" onClick={() => { o.reload(); q.reload(); }}>{t.refresh}</Button>} />
      {o.error ? <LoadError onRetry={o.reload} /> : !d ? <Spinner /> : (
        <div className="pv-kpis" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
          {tiles.map(x => (
            <button key={x.label} type="button" onClick={x.go} disabled={!x.go}
              style={{ ...card, border: 'none', textAlign: 'start', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, cursor: x.go ? 'pointer' : 'default', font: 'inherit', color: 'inherit',
                outline: x.label === t.pendingReview && d.pending ? '2px solid var(--cat-amber-500, #f59e0b)' : undefined }}>
              <span style={{ width: 36, height: 36, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cat-' + x.tone + '-100)', color: 'var(--cat-' + x.tone + '-700)' }}><Icon name={x.icon} size={18} /></span>
              <span style={{ font: '800 26px/30px var(--font-sans)' }}>{num(x.n)}</span>
              <span style={{ font: 'var(--type-body-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>{x.label}</span>
            </button>
          ))}
        </div>
      )}
      {d && <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)', marginTop: -8 }}>{t.contactNote}</span>}
      <Card title={t.reviewQueue} actions={q.data && q.data.length > 0 ? <Button size="sm" iconLeft="arrow-right" onClick={review}>{t.reviewAll}</Button> : undefined}>
        {q.error ? <LoadError onRetry={q.reload} /> : !q.data ? <Spinner size={22} /> : !q.data.length
          ? <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{t.nothingPending}</span>
          : q.data.slice(0, 6).map(c => (
            <button key={c.id} type="button" onClick={review}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 0, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'start', font: 'inherit', color: 'inherit' }}>
              <Avatar name={pick(c.name_ar, c.name_en)} src={logoOf(c)} size={40} />
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ font: 'var(--type-body-strong)' }}>{pick(c.name_ar, c.name_en)}</span>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{pick(c.city_ar, c.city_en)} · {a.catName(c.categories[0])} · {a.when(c.submitted_at)}</span>
              </span>
              <Icon name="chevron-right" size={18} color="var(--text-tertiary)" style={{ transform: a.ar ? 'scaleX(-1)' : undefined }} />
            </button>
          ))}
      </Card>
    </>
  );
}
