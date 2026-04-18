/* global React, window */
const { useState: useStateT, useMemo: useMemoT } = React;

function ToolDetail({ toolId, onWatch, goto }) {
  const D = window.PV_DATA;
  const tool = D.tool(toolId) || D.TOOLS[0];
  const [level, setLevel] = useStateT("beginner");

  const videos = useMemoT(() => D.byLevel(tool.id, level), [tool.id, level]);
  const lvl = D.LEVELS.find(l => l.id === level);

  const totalVideos = D.byTool(tool.id).length;
  const totalLearners = tool.learners;

  return (
    <div className="route">
      <div className="shell">
        <button className="btn btn-ghost btn-sm mt-24" onClick={() => goto("browse")} style={{padding: "6px 0"}}>
          ← Browse all tools
        </button>

        <div className="tool-hero">
          <div>
            <div className="tool-mark-lg">{tool.mark}</div>
            <div className="eyebrow mb-8">{tool.cat} · By {tool.maker}</div>
            <h1>{tool.name}</h1>
            <p className="muted" style={{fontSize: 17, maxWidth: 540, margin: "0 0 24px", lineHeight: 1.5}}>{tool.desc}</p>
            <div className="flex gap-12">
              <button className="btn btn-primary">Start learning <Icon.arrow size={14}/></button>
              <button className="btn btn-secondary"><Icon.bookmark size={14}/> Save</button>
              <a className="btn btn-ghost" href="#" onClick={e => e.preventDefault()}>Official site ↗</a>
            </div>
          </div>
          <div className="path-card" style={{padding: 20}}>
            <div className="eyebrow mb-16">Tool stats</div>
            <div className="row-gap-12">
              <div className="flex-between"><span className="muted">Videos</span><span className="mono tnum" style={{fontWeight: 600}}>{totalVideos}</span></div>
              <div className="flex-between"><span className="muted">Active learners</span><span className="mono tnum" style={{fontWeight: 600}}>{D.fmtViews(totalLearners)}</span></div>
              <div className="flex-between"><span className="muted">Avg rating</span><span className="mono tnum" style={{fontWeight: 600, color: "var(--accent-deep)"}}>★ 4.6</span></div>
              <div className="flex-between"><span className="muted">Completion</span><span className="mono tnum" style={{fontWeight: 600}}>76%</span></div>
            </div>
          </div>
        </div>

        <div className="level-tabs">
          {D.LEVELS.map(l => (
            <div key={l.id} className={`level-tab ${level === l.id ? "active" : ""}`} onClick={() => setLevel(l.id)}>
              {l.name}
              <span className="count">{D.byLevel(tool.id, l.id).length}</span>
            </div>
          ))}
        </div>

        <div className="path-meta-grid">
          <div className="cell">
            <div className="lbl">Time commit</div>
            <div className="val">{lvl.hours}</div>
          </div>
          <div className="cell">
            <div className="lbl">Videos</div>
            <div className="val tnum">{videos.length}</div>
          </div>
          <div className="cell">
            <div className="lbl">Your progress</div>
            <div className="val" style={{color: "var(--accent-deep)"}}>{level === "beginner" ? "62%" : "0%"}</div>
          </div>
        </div>

        <div className="card" style={{padding: 20, marginBottom: 24, background: "var(--bg-sunk)", borderStyle: "dashed"}}>
          <div className="muted" style={{fontSize: 14}}>{lvl.desc}</div>
        </div>

        <div className="video-grid dense">
          {videos.map(v => <VideoCard key={v.id} video={v} onClick={onWatch} />)}
        </div>

        <div style={{height: 96}} />
      </div>
    </div>
  );
}

window.ToolDetail = ToolDetail;
