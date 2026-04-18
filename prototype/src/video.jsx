/* global React, window */
const { useState: useStateV, useEffect: useEffectV, useRef: useRefV } = React;

function VideoPage({ video, onWatch, onRate, goto, watched, rating, openLangdock, langdockDone }) {
  const D = window.PV_DATA;
  const tool = D.tool(video.toolId);
  const creator = D.creator(video.creatorId);

  const [playing, setPlaying] = useStateV(false);
  const [progress, setProgress] = useStateV(watched ? 100 : 0);
  const [floats, setFloats] = useStateV([]);
  const [done, setDone] = useStateV(watched);
  const [myRating, setMyRating] = useStateV(rating || 0);
  const playerRef = useRefV(null);

  useEffectV(() => {
    if (!playing) return;
    const start = performance.now();
    const startProgress = progress;
    let raf;
    const tick = (t) => {
      const elapsed = t - start;
      const next = Math.min(100, startProgress + (elapsed / 60)); // ~6s to fill
      setProgress(next);
      if (next < 100 && playing) raf = requestAnimationFrame(tick);
      else if (next >= 100) { setPlaying(false); markDone(); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const markDone = () => {
    if (done) return;
    setDone(true);
    onWatch(video);
    spawnFloat("+10 pts");
  };

  const spawnFloat = (text) => {
    const id = Math.random().toString(36).slice(2);
    const left = 30 + Math.random() * 50;
    setFloats(f => [...f, { id, text, left }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1100);
  };

  const handleRate = (r) => {
    if (myRating === 0) {
      spawnFloat("+3 pts");
      onRate(video, r);
    }
    setMyRating(r);
  };

  const next = D.byTool(video.toolId).filter(v => v.id !== video.id).slice(0, 4);

  return (
    <div className="route">
      <div className="shell">
        <button className="btn btn-ghost btn-sm mt-24" onClick={() => goto("tool", { toolId: tool.id })} style={{padding: "6px 0"}}>
          ← {tool.name}
        </button>

        <div className="video-page">
          <div>
            <div className="player" ref={playerRef} onClick={() => !done && setPlaying(p => !p)}>
              <div className="player-tag mono">{tool.name} · {video.level}</div>
              {!playing && progress < 100 && (
                <div className="play-big" onClick={(e) => { e.stopPropagation(); setPlaying(true); }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A0A0B"><polygon points="6 4 20 12 6 20"/></svg>
                </div>
              )}
              {progress >= 100 && (
                <div style={{position: "relative", zIndex: 2, color: "#fff", textAlign: "center"}}>
                  <div className="mono" style={{fontSize: 11, opacity: 0.7, letterSpacing: "0.08em", textTransform: "uppercase"}}>Watched</div>
                  <div style={{fontSize: 22, fontWeight: 600, marginTop: 6}}>+10 pts earned</div>
                </div>
              )}
              <div className="player-bottom">
                <div className="play" onClick={(e) => { e.stopPropagation(); setPlaying(p => !p); }} style={{cursor: "pointer"}}>{playing ? "⏸" : "▶"}</div>
                <span>{Math.floor(progress * (parseInt(video.duration) / 100))}:{String(Math.floor(((progress * 60) % 60))).padStart(2, "0")}</span>
                <div className="scrub"><span style={{width: `${progress}%`}} /></div>
                <span>{video.duration}</span>
              </div>
              {floats.map(f => (
                <div key={f.id} className="float-pts" style={{left: `${f.left}%`, top: "40%"}}>{f.text}</div>
              ))}
            </div>

            <div className="mt-24">
              <div className="flex gap-8 items-center mb-8" style={{flexWrap: "wrap"}}>
                <span className={`tag ${video.level}`}>{video.level}</span>
                <span className="tag">{tool.name}</span>
                <span className="dim mono" style={{fontSize: 12}}>{D.fmtViews(video.views)} views · {video.completion}% completion</span>
              </div>
              <h1 className="h-1" style={{fontSize: 28, marginBottom: 16}}>{video.title}</h1>

              <div className="card" style={{padding: 18, marginBottom: 24, background: "linear-gradient(135deg, color-mix(in oklch, #5B4FE9 6%, var(--bg-elev)), var(--bg-elev))", borderColor: "color-mix(in oklch, #5B4FE9 20%, var(--border))"}}>
                <div style={{display: "flex", alignItems: "center", gap: 16}}>
                  <div style={{flex: 1}}>
                    <div className="eyebrow mb-8" style={{color: "#5B4FE9"}}>◆ Hands-on practice</div>
                    <div style={{fontSize: 14, fontWeight: 600, marginBottom: 4}}>Try this exercise on {tool.name}</div>
                    <div className="muted" style={{fontSize: 13}}>We'll open a Langdock chat with the right model and a starter prompt. Earn +15 pts when you send it.</div>
                  </div>
                  <button className="try-langdock" onClick={() => openLangdock && openLangdock(video)}>
                    <div className="tl-mark">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    Try on Langdock
                    {langdockDone && <span style={{marginLeft: 2, fontSize: 12}}>✓</span>}
                  </button>
                </div>
              </div>

              <div className="card" style={{padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 24}}>
                <div className="creator-avatar" style={{width: 44, height: 44, fontSize: 14}}>{creator.initials}</div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 600, fontSize: 14.5}}>{creator.name}{creator.verified && <Verified />}</div>
                  <div className="dim" style={{fontSize: 12.5}}>{creator.role} · {creator.company} · 24 videos · 12.4k followers</div>
                </div>
                <button className="btn btn-secondary btn-sm">Follow</button>
              </div>

              <div className="card" style={{padding: 20, marginBottom: 24}}>
                <div className="flex-between mb-16">
                  <div>
                    <div className="eyebrow mb-8">Rate this video</div>
                    <div className="muted" style={{fontSize: 13}}>{myRating ? `You rated ${myRating} ★` : "Help others find quality content"}</div>
                  </div>
                  <StarRater value={myRating} onChange={handleRate} />
                </div>
                <div className="flex gap-12 items-center" style={{borderTop: "1px solid var(--border)", paddingTop: 16}}>
                  <button className={`btn ${done ? "btn-secondary" : "btn-accent"}`} onClick={markDone}>
                    {done ? <><Icon.check size={14}/> Marked watched</> : <>Mark as watched</>}
                  </button>
                  <button className="btn btn-ghost btn-sm"><Icon.bookmark size={13}/> Save</button>
                  <div style={{flex: 1}} />
                  <div className="mono dim" style={{fontSize: 12}}>★ {video.rating} avg from {Math.floor(video.views / 80)} ratings</div>
                </div>
              </div>

              <h3 className="h-3 mb-16">Up next in {tool.name}</h3>
              <div className="video-grid dense">
                {next.map(v => <VideoCard key={v.id} video={v} onClick={(vv) => goto("video", { videoId: vv.id })} />)}
              </div>
            </div>
          </div>

          <aside className="row-gap-24" style={{alignSelf: "start", position: "sticky", top: 80}}>
            <div className="card" style={{padding: 20}}>
              <div className="eyebrow mb-16"><Icon.bolt size={11}/> Earn points</div>
              <div className="row-gap-12">
                <div className="flex-between" style={{fontSize: 13}}>
                  <span className="muted">Watch &gt;80%</span>
                  <span className="mono" style={{fontWeight: 600, color: done ? "var(--accent-deep)" : "var(--fg-3)"}}>+10 {done && "✓"}</span>
                </div>
                <div className="flex-between" style={{fontSize: 13}}>
                  <span className="muted">Rate the video</span>
                  <span className="mono" style={{fontWeight: 600, color: myRating ? "var(--accent-deep)" : "var(--fg-3)"}}>+3 {myRating > 0 && "✓"}</span>
                </div>
                <div className="flex-between" style={{fontSize: 13}}>
                  <span className="muted">Try on Langdock</span>
                  <span className="mono" style={{fontWeight: 600, color: langdockDone ? "#5B4FE9" : "var(--fg-3)"}}>+15 {langdockDone && "✓"}</span>
                </div>
              </div>
            </div>

            <div className="card" style={{padding: 20}}>
              <div className="eyebrow mb-16">Discussion · 18</div>
              <div className="row-gap-12">
                {[
                  { who: "AP", name: "Anna Park", t: "The prompt at 3:45 is gold — saved me 2 hours today.", time: "2h" },
                  { who: "TB", name: "Tom B.", t: "Anyone tried this with the new model? Same results?", time: "5h" },
                  { who: "JR", name: "Jordan R.", t: "Worth following up with the Beginner intro first.", time: "1d" },
                ].map((c, i) => (
                  <div key={i} style={{paddingTop: i ? 12 : 0, borderTop: i ? "1px solid var(--border)" : "none"}}>
                    <div className="flex gap-8 items-center mb-8">
                      <div className="creator-avatar">{c.who}</div>
                      <div style={{fontSize: 12.5, fontWeight: 600}}>{c.name}</div>
                      <div className="dim mono" style={{fontSize: 11}}>{c.time}</div>
                    </div>
                    <div style={{fontSize: 13, color: "var(--fg-2)"}}>{c.t}</div>
                  </div>
                ))}
              </div>
              <textarea className="textarea mt-16" placeholder="Add to the discussion…" rows={2} />
            </div>
          </aside>
        </div>

        <div style={{height: 96}} />
      </div>
    </div>
  );
}

window.VideoPage = VideoPage;
