'use client';
import React from 'react';
import { PV_DATA } from './data';
import { Icon } from './atoms';

const { useState: useStateL, useEffect: useEffectL, useMemo: useMemoL } = React;

function Leaderboard({ profile, points, simWatch }) {
  const D = PV_DATA;
  const [tab, setTab] = useStateL("group");
  const [board, setBoard] = useStateL([]);
  const [flashId, setFlashId] = useStateL(null);
  const [updatedNow, setUpdatedNow] = useStateL(false);

  // Recompute board when profile/points/tab change
  useEffectL(() => {
    let b = D.makeLeaderboard(profile.field, "intermediate", profile.name, profile.role);
    // Inject current points into "you"
    b = b.map(r => r.isYou ? { ...r, pts: 220 + points } : r);
    b.sort((a, b) => b.pts - a.pts);
    setBoard(b);
  }, [profile, tab]);

  // Recompute when points change → maybe flash
  useEffectL(() => {
    setBoard(prev => {
      const old = prev.findIndex(r => r.isYou);
      const updated = prev.map(r => r.isYou ? { ...r, pts: 220 + points, videos: r.videos + 0 } : r);
      updated.sort((a, b) => b.pts - a.pts);
      const newIdx = updated.findIndex(r => r.isYou);
      if (old !== -1 && newIdx !== -1 && newIdx <= old && points > 0) {
        setFlashId(updated[newIdx].name);
        setTimeout(() => setFlashId(null), 900);
        setUpdatedNow(true);
        setTimeout(() => setUpdatedNow(false), 2500);
      }
      return updated;
    });
  }, [points]);

  const youIdx = board.findIndex(r => r.isYou);
  const fieldName = D.FIELDS.find(f => f.id === profile.field)?.name || "Marketing";

  const tabs = [
    { id: "group", l: "Your Group", s: `${fieldName} · Intermediate` },
    { id: "field", l: "Your Field", s: `${fieldName} · all levels` },
    { id: "level", l: "Your Level", s: "Intermediate · all fields" },
    { id: "global", l: "Global", s: "All learners" },
  ];

  const top = youIdx >= 0 ? board[youIdx] : null;
  const ahead = youIdx > 0 ? board[youIdx - 1] : null;
  const gap = ahead ? ahead.pts - top.pts : 0;

  return (
    <div className="route">
      <div className="shell">
        <div className="hero" style={{padding: "40px 0 0", gridTemplateColumns: "1fr"}}>
          <div>
            <div className="eyebrow mb-16">
              <Icon.trophy size={11}/> Week of April 14 — resets in 4d 12h
              {updatedNow && <span style={{color: "var(--accent-deep)", marginLeft: 12}}>● Updated now</span>}
            </div>
            <h1 className="h-1" style={{fontSize: 44}}>Leaderboard</h1>
          </div>
        </div>

        <div className="lb-tabs">
          {tabs.map(t => (
            <div key={t.id} className={`lb-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.l} <small>{t.s}</small>
            </div>
          ))}
        </div>

        {top && (
          <div className="lb-hero">
            <div style={{position: "relative", zIndex: 1}}>
              <div className="sub">You are</div>
              <h2>#{youIdx + 1}<span style={{color: "var(--fg-3)", fontSize: 22, fontWeight: 500}}> / {board.length}</span></h2>
              <div className="mono dim" style={{fontSize: 12.5}}>{top.pts} pts · {top.videos} videos watched</div>
              {ahead && (
                <div className="gap">📍 <b>{gap} pts</b> from #{youIdx} ({ahead.name})</div>
              )}
              {!ahead && <div className="gap" style={{color: "var(--accent-deep)"}}>👑 You're leading the pack.</div>}
            </div>
            <div style={{position: "relative", zIndex: 1, textAlign: "right"}}>
              <button className="btn btn-accent btn-lg" onClick={simWatch}>
                <Icon.play size={14}/> Simulate watching a video (+10)
              </button>
              <div className="dim mono mt-8" style={{fontSize: 11}}>Try it — watch the rank shuffle in real time.</div>
            </div>
          </div>
        )}

        <div className="lb-list">
          {board.slice(0, 11).map((r, i) => (
            <div key={r.name} className={`lb-row ${i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : ""} ${r.isYou ? "you" : ""} ${flashId === r.name ? "flash" : ""}`}>
              <div className="rank">
                {i === 0 ? <span className="medal">🥇</span> : i === 1 ? <span className="medal">🥈</span> : i === 2 ? <span className="medal">🥉</span> : `${i + 1}`}
              </div>
              <div className="lb-who">
                <div className="ca creator-avatar">{r.initials || r.name.split(" ").map(p => p[0]).join("").slice(0,2)}</div>
                <div>
                  <div className="nm">{r.isYou ? "YOU · " : ""}{r.name}</div>
                  <div className="rl">{r.role}</div>
                </div>
              </div>
              <div className="lb-pts tnum">{r.pts}</div>
              <div className="lb-videos tnum">{r.videos} videos</div>
            </div>
          ))}
        </div>

        <div className="lb-context">
          <div className="ctx">
            <span className="lbl">Your field · all levels</span>
            <span className="val">#{Math.max(1, 8 - Math.floor(points / 30))}<span className="dim" style={{fontSize: 13}}> / 142</span></span>
          </div>
          <div className="ctx">
            <span className="lbl">Your level · all fields</span>
            <span className="val">#{Math.max(1, 12 - Math.floor(points / 25))}<span className="dim" style={{fontSize: 13}}> / 318</span></span>
          </div>
        </div>

        <div style={{height: 96}} />
      </div>
    </div>
  );
}


export { Leaderboard };
