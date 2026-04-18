'use client';
import React from 'react';
import { PV_DATA } from './data';
import { Icon, VideoCard } from './atoms';

const { useState: useStateB, useMemo: useMemoB } = React;

function Browse({ onWatch, goto, profile }) {
  const D = PV_DATA;
  const [tool, setTool] = useStateB("all");
  const [level, setLevel] = useStateB("all");
  const [field, setField] = useStateB("all");
  const [sort, setSort] = useStateB("popular");
  const [q, setQ] = useStateB("");

  const filtered = useMemoB(() => {
    let v = D.VIDEOS.slice();
    if (tool !== "all") v = v.filter(x => x.toolId === tool);
    if (level !== "all") v = v.filter(x => x.level === level);
    if (field !== "all") v = v.filter(x => x.field === field);
    if (q.trim()) v = v.filter(x => x.title.toLowerCase().includes(q.toLowerCase()));
    if (sort === "popular") v.sort((a,b) => b.views - a.views);
    else if (sort === "new") v.sort((a,b) => b.id - a.id);
    else if (sort === "rated") v.sort((a,b) => b.rating - a.rating);
    return v.slice(0, 24);
  }, [tool, level, field, sort, q]);

  return (
    <div className="route">
      <div className="shell">
        <div className="hero" style={{padding: "40px 0 0", gridTemplateColumns: "1fr"}}>
          <div>
            <div className="eyebrow mb-16">Browse</div>
            <h1 className="h-1" style={{fontSize: 44, letterSpacing: "-0.025em"}}>
              {filtered.length === 24 ? "200+" : filtered.length} videos. <span className="dim">Find your next.</span>
            </h1>
          </div>
        </div>

        <div className="filter-bar">
          <input className="search-input" placeholder="Search videos…" value={q} onChange={e => setQ(e.target.value)} />
          <div className="group">
            <span className="group-label">Tool</span>
            <select className="select" style={{width: "auto", padding: "7px 10px", fontSize: 12.5}} value={tool} onChange={e => setTool(e.target.value)}>
              <option value="all">All tools</option>
              {D.TOOLS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="group">
            <span className="group-label">Level</span>
            {["all", ...D.LEVELS.map(l => l.id)].map(l => (
              <div key={l} className={`chip brand ${level === l ? "active" : ""}`} onClick={() => setLevel(l)}>
                {l === "all" ? "All" : l}
              </div>
            ))}
          </div>
          <div className="group">
            <span className="group-label">Field</span>
            <select className="select" style={{width: "auto", padding: "7px 10px", fontSize: 12.5}} value={field} onChange={e => setField(e.target.value)}>
              <option value="all">All fields</option>
              {D.FIELDS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div style={{flex: 1}} />
          <div className="group">
            <span className="group-label">Sort</span>
            {[{id:"popular",l:"Most watched"},{id:"new",l:"Newest"},{id:"rated",l:"Best rated"}].map(s => (
              <div key={s.id} className={`chip ${sort === s.id ? "active" : ""}`} onClick={() => setSort(s.id)}>{s.l}</div>
            ))}
          </div>
        </div>

        <div className="video-grid">
          {filtered.map(v => <VideoCard key={v.id} video={v} onClick={onWatch} />)}
        </div>
        {filtered.length === 0 && (
          <div className="card" style={{padding: 48, textAlign: "center", color: "var(--fg-3)"}}>
            Nothing matches those filters — try removing one to see more.
          </div>
        )}
        <div style={{height: 96}} />
      </div>
    </div>
  );
}


export { Browse };
