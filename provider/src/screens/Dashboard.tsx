import { useEffect, useState } from 'react';
import { Button, Icon } from '../shared/ds';
import type { StatKind, Stats } from '../data';
import { useP } from '../state';
import { Card, PageHeader, Spinner, card } from '../ui';

const KPIS: { k: StatKind; icon: string; tone: string; label: 'profileViews' | 'waClicks' | 'callClicks' | 'dirClicks' | 'storyViews' | 'serviceViews' | 'newFollowers' }[] = [
  { k: 'profile_view', icon: 'eye', tone: 'violet', label: 'profileViews' },
  { k: 'whatsapp', icon: 'message-circle', tone: 'green', label: 'waClicks' },
  { k: 'call', icon: 'phone', tone: 'sky', label: 'callClicks' },
  { k: 'directions', icon: 'navigation', tone: 'teal', label: 'dirClicks' },
  { k: 'story_view', icon: 'circle-play', tone: 'pink', label: 'storyViews' },
  { k: 'follow', icon: 'user-plus', tone: 'amber', label: 'newFollowers' },
];

export function Dashboard() {
  const p = useP();
  const { t, repo, company } = p;
  const [stats, setStats] = useState<Stats | null>(null);
  const [counts, setCounts] = useState<{ stories: number; services: number; projects: number } | null>(null);
  useEffect(() => {
    repo.stats(company.id).then(setStats).catch(() => setStats(null));
    Promise.all([repo.stories(company.id), repo.services(company.id), repo.albums(company.id)]).then(([st, sv, al]) => setCounts({
      stories: st.filter(s => !s.expires_at || Date.parse(s.expires_at) > Date.now()).length,
      services: sv.filter(s => s.is_published).length, projects: al.filter(a => a.is_published).length,
    })).catch(() => {});
  }, [repo, company.id]);

  return (
    <>
      <PageHeader title={t.hello + (p.ar ? '، ' : ', ') + p.pick(company.name_ar, company.name_en)} subtitle={t.last14 + ' · ' + t.vsPrev}
        actions={<><Button size="sm" iconLeft="circle-play" onClick={() => p.go('stories')}>{t.postStory}</Button><Button size="sm" variant="outline" iconLeft="plus" onClick={() => p.go('services')}>{t.addService}</Button></>} />
      {!stats ? <Spinner /> : (
        <>
          <div className="pv-kpis">
            {KPIS.map(x => <Kpi key={x.k} icon={x.icon} tone={x.tone} label={t[x.label]} cur={stats.totals[x.k].cur} prev={stats.totals[x.k].prev} />)}
          </div>
          <div className="pv-grid-dash">
            <Card title={t.dailyViews} subtitle={t.clickNote}>
              <Bars data={stats.daily} />
            </Card>
            <Card title={t.followersTotal}>
              <span style={{ font: '800 40px/44px var(--font-sans)', color: 'var(--text-primary)' }}>{p.num(stats.followers)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
                <Icon name="user-plus" size={16} color="var(--cat-amber-600)" />+{p.num(stats.totals.follow.cur)} · {t.last14}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                <MiniStat label={t.serviceViews} n={stats.totals.service_view.cur} />
                {counts && <><MiniStat label={t.liveStories} n={counts.stories} /><MiniStat label={t.publishedServices} n={counts.services} /><MiniStat label={t.publishedProjects} n={counts.projects} /></>}
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

function Kpi({ icon, tone, label, cur, prev }: { icon: string; tone: string; label: string; cur: number; prev: number }) {
  const p = useP();
  const diff = prev ? Math.round(((cur - prev) / prev) * 100) : null;
  const up = diff != null && diff >= 0;
  return (
    <div style={{ ...card, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ flex: 'none', width: 36, height: 36, borderRadius: 11, background: 'var(--cat-' + tone + '-100)', color: 'var(--cat-' + tone + '-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={18} /></span>
        <span style={{ font: 'var(--type-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', minWidth: 0 }}>{label}</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ font: '800 28px/32px var(--font-sans)' }}>{p.num(cur)}</span>
        {diff != null && (
          <span dir="ltr" style={{ display: 'inline-flex', alignItems: 'center', gap: 2, font: '700 12px var(--font-sans)', color: up ? 'var(--success)' : 'var(--danger)' }}>
            <Icon name={up ? 'trending-up' : 'trending-down'} size={14} />{(up ? '+' : '') + diff}%
          </span>
        )}
      </span>
    </div>
  );
}

const MiniStat = ({ label, n }: { label: string; n: number }) => {
  const p = useP();
  return (
    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 10, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
      <span>{label}</span><span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.num(n)}</span>
    </span>
  );
};

/** Simple bar chart (SVG) of daily counts, oldest on the reading-start side. */
function Bars({ data }: { data: { day: string; n: number }[] }) {
  const p = useP();
  const max = Math.max(1, ...data.map(d => d.n));
  const W = 560, H = 180, gap = 6, bw = (W - gap * (data.length - 1)) / data.length;
  const fmt = (day: string) => new Date(day + 'T12:00:00').toLocaleDateString(p.ar ? 'ar-OM' : 'en-GB', { day: 'numeric', month: 'short' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" role="img" aria-label={p.t.dailyViews} style={{ transform: p.ar ? 'scaleX(-1)' : undefined }}>
        {data.map((d, k) => {
          const h = Math.max(3, (d.n / max) * (H - 8));
          return <rect key={d.day} x={k * (bw + gap)} y={H - h} width={bw} height={h} rx={5} fill={k === data.length - 1 ? 'var(--brand)' : 'var(--violet-200, oklch(0.88 0.06 292))'}><title>{fmt(d.day) + ': ' + d.n}</title></rect>;
        })}
      </svg>
      <span style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>
        <span>{fmt(data[0].day)}</span><span>{fmt(data[data.length - 1].day)}</span>
      </span>
    </div>
  );
}
