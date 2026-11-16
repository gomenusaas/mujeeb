import { useEffect, useState } from 'react';
import { Button, EmptyState, Icon } from '../shared/ds';
import type { Story } from '../data';
import { useList, useP } from '../state';
import { Card, Confirm, Field, FileButton, Modal, PageHeader, Pill, Spinner, card } from '../ui';

const MAX_BYTES = 150 * 1024 * 1024;
const hours = (ms: number) => Math.max(1, Math.round(ms / 36e5));

/** First frame of a video as a JPEG, used as the story thumbnail. Resolves null if the browser can't decode it. */
function videoPoster(file: File): Promise<Blob | null> {
  return new Promise(resolve => {
    const v = document.createElement('video');
    const url = URL.createObjectURL(file);
    const done = (b: Blob | null) => { URL.revokeObjectURL(url); resolve(b); };
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
    v.onloadeddata = () => { v.currentTime = Math.min(0.5, (v.duration || 1) / 2); };
    v.onseeked = () => {
      const c = document.createElement('canvas');
      c.width = v.videoWidth; c.height = v.videoHeight;
      c.getContext('2d')?.drawImage(v, 0, 0);
      c.toBlob(done, 'image/jpeg', 0.82);
    };
    v.onerror = () => done(null);
    setTimeout(() => done(null), 10000);
  });
}

export function Stories() {
  const p = useP();
  const { t, repo, company } = p;
  const { items, reload } = useList(() => repo.stories(company.id), [repo, company.id]);
  const [compose, setCompose] = useState(false);
  const [del, setDel] = useState<Story | null>(null);
  const [busy, setBusy] = useState(false);
  const now = Date.now();
  const live = (items || []).filter(s => s.expires_at && Date.parse(s.expires_at) > now);
  const old = (items || []).filter(s => s.expires_at && Date.parse(s.expires_at) <= now);
  const remove = async () => {
    if (!del?.id) return;
    setBusy(true);
    try { await repo.deleteStory(del.id); p.showToast(t.deleted); reload(); } catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); setDel(null); }
  };
  return (
    <>
      <PageHeader title={t.stories} subtitle={t.storyHelp} actions={<Button iconLeft="plus" onClick={() => setCompose(true)}>{t.newStory}</Button>} />
      {!items ? <Spinner /> : (
        <>
          {!live.length
            ? <Card><EmptyState icon="circle-play" title={t.noStories} body={t.noStoriesBody} action={<Button iconLeft="plus" onClick={() => setCompose(true)}>{t.newStory}</Button>} /></Card>
            : <div className="pv-tiles" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>{live.map(s => <StoryCard key={s.id} s={s} live onDelete={() => setDel(s)} />)}</div>}
          {old.length > 0 && (
            <>
              <span style={{ font: 'var(--type-h3)', marginTop: 8 }}>{t.recentExpired}</span>
              <div className="pv-tiles" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>{old.map(s => <StoryCard key={s.id} s={s} onDelete={() => setDel(s)} />)}</div>
            </>
          )}
        </>
      )}
      {compose && <Composer onClose={() => setCompose(false)} onPosted={() => { setCompose(false); reload(); }} />}
      <Confirm open={!!del} busy={busy} onCancel={() => setDel(null)} onConfirm={remove} />
    </>
  );
}

function StoryCard({ s, live, onDelete }: { s: Story; live?: boolean; onDelete: () => void }) {
  const p = useP();
  const { t } = p;
  const thumb = s.poster_url || (s.kind === 'image' ? s.media_url : null);
  const left = s.expires_at ? Date.parse(s.expires_at) - Date.now() : 0;
  const ago = s.created_at ? Date.now() - Date.parse(s.created_at) : 0;
  return (
    <div style={{ ...card, overflow: 'hidden', opacity: live ? 1 : 0.7 }}>
      <div style={{ position: 'relative', aspectRatio: '9/16', background: 'var(--neutral-800, #222)' }}>
        {thumb
          ? <img src={thumb} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <video src={s.media_url} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
        <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, oklch(0 0 0 / .35), transparent 30%, transparent 55%, oklch(0 0 0 / .72))' }} />
        <span style={{ position: 'absolute', top: 10, insetInlineStart: 10 }}><Pill tone={live ? 'green' : 'neutral'}>{live ? t.live : t.expired}</Pill></span>
        {s.kind === 'video' && <span style={{ position: 'absolute', top: 12, insetInlineEnd: 10, width: 26, height: 26, borderRadius: '50%', background: 'oklch(0 0 0 / .4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" size={12} filled /></span>}
        <span style={{ position: 'absolute', insetInline: 12, bottom: 12, display: 'flex', flexDirection: 'column', gap: 4, color: '#fff' }}>
          <span style={{ font: '700 13px/17px var(--font-sans)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.pick(s.caption_ar, s.caption_en)}</span>
          <span style={{ font: 'var(--type-caption)', opacity: 0.85 }}>
            {(live ? t.hoursLeft.replace('{n}', p.num(hours(left))) : t.postedAgo.replace('{n}', p.num(hours(ago))))}
          </span>
        </span>
      </div>
      <div style={{ padding: 10 }}><Button size="sm" variant="danger" fullWidth iconLeft="trash-2" onClick={onDelete}>{t.delete}</Button></div>
    </div>
  );
}

function Composer({ onClose, onPosted }: { onClose: () => void; onPosted: () => void }) {
  const p = useP();
  const { t, repo, company } = p;
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [capAr, setCapAr] = useState('');
  const [capEn, setCapEn] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const isVideo = !!file && file.type.startsWith('video/');
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const pick = (fs: File[]) => {
    const f = fs[0];
    if (f.size > MAX_BYTES) return setErr(t.tooBig);
    setErr('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const publish = async () => {
    if (!file) return setErr(t.chooseMedia);
    setBusy(true);
    try {
      const media_url = await repo.upload(company.id, file, 'story-' + file.name);
      let poster_url: string | null = null;
      if (isVideo) {
        const blob = await videoPoster(file);
        if (blob) poster_url = await repo.upload(company.id, blob, 'story-poster.jpg');
      }
      await repo.createStory({ company_id: company.id, kind: isVideo ? 'video' : 'image', media_url, poster_url, caption_ar: capAr.trim(), caption_en: capEn.trim() });
      p.showToast(t.posted);
      onPosted();
    } catch { p.showToast(t.uploadFailed, 'error'); } finally { setBusy(false); }
  };

  return (
    <Modal open onClose={onClose} title={t.newStory} width={720}
      footer={<><Button variant="outline" onClick={onClose}>{t.cancel}</Button><Button iconLeft="send" loading={busy} onClick={publish}>{busy ? t.publishing : t.publish}</Button></>}>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 200px', maxWidth: '100%', aspectRatio: '9/16', borderRadius: 16, overflow: 'hidden', background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {!file && <Icon name="image-plus" size={36} color="var(--text-tertiary)" />}
          {file && !isVideo && <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          {file && isVideo && <video src={preview} muted playsInline autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div style={{ flex: '1 1 260px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FileButton accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" variant="secondary" size="md" icon={file ? 'refresh-cw' : 'upload'} onFiles={pick}>
              {file ? (isVideo ? t.video : t.photo) + ' · ' + t.change : t.chooseMedia}
            </FileButton>
            <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: err ? 'var(--danger)' : 'var(--text-tertiary)' }}>{err || t.mediaRules}</span>
          </span>
          <Field label={t.captionAr} dir="rtl" value={capAr} onChange={setCapAr} multiline rows={2} />
          <Field label={t.captionEn} dir="ltr" value={capEn} onChange={setCapEn} multiline rows={2} />
          <span style={{ display: 'flex', gap: 8, alignItems: 'flex-start', font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}><Icon name="clock" size={16} />{t.storyHelp}</span>
        </div>
      </div>
    </Modal>
  );
}
