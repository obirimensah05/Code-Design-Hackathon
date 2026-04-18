'use client';
import React from 'react';
import { PV_DATA } from './data';
import { Icon, VideoCard, Verified, Avatar, thumbUrl } from './atoms';
import { Reveal, Stagger, CountUp, Ring, ProgressBar } from './motion-fx';

const { useState: useStateH, useMemo: useMemoH, useEffect: useEffectH, useRef: useRefH } = React;

/* =====================================================================
   Home variants — all four live here.
   The active one is chosen by app.jsx based on tweaks.homeVariant.
   Every variant reads `gamification` (subtle|medium|heavy) from props so
   Tweaks can dial it up and down.
   ===================================================================== */

/* -------- shared bits -------- */

function HeroStats({ profile, points, gamification, fieldName }) {
  if (gamification === "subtle") {
    return (
      <Stagger className="stat-strip subtle" stagger={0.07}>
        <div className="stat">
          <div className="num tnum"><CountUp value={12} duration={1.1} /></div>
          <div className="lbl">Videos watched</div>
        </div>
        <div className="stat">
          <div className="num tnum"><CountUp value={4} duration={0.9} /><small>wk</small></div>
          <div className="lbl">Streak</div>
        </div>
        <div className="stat">
          <div className="num tnum"><CountUp value={3} duration={0.8} /></div>
          <div className="lbl">Active paths</div>
        </div>
        <div className="stat">
          <div className="num tnum"><CountUp value={62} duration={1.2} /><small>%</small></div>
          <div className="lbl">Avg completion</div>
        </div>
      </Stagger>
    );
  }
  if (gamification === "heavy") {
    return (
      <Stagger className="stat-strip heavy" stagger={0.07}>
        <div className="stat">
          <div className="num tnum" style={{color: "var(--accent-deep)"}}><CountUp value={points} duration={1.3} /><small>pts</small></div>
          <div className="lbl">⚡ This week</div>
        </div>
        <div className="stat">
          <div className="num tnum" style={{color: "var(--accent-deep)"}}>#2<small>/40</small></div>
          <div className="lbl">🏆 {fieldName} rank</div>
        </div>
        <div className="stat">
          <div className="num tnum"><CountUp value={12} duration={1.1} /></div>
          <div className="lbl">🎥 Watched</div>
        </div>
        <div className="stat">
          <div className="num tnum"><CountUp value={4} duration={0.9} /><small>🔥</small></div>
          <div className="lbl">Week streak</div>
        </div>
      </Stagger>
    );
  }
  return (
    <Stagger className="stat-strip" stagger={0.07}>
      <div className="stat"><div className="num tnum"><CountUp value={points} duration={1.3} /><small>pts</small></div><div className="lbl">This week</div></div>
      <div className="stat"><div className="num tnum">#2<small>/40</small></div><div className="lbl">{fieldName} rank</div></div>
      <div className="stat"><div className="num tnum"><CountUp value={12} duration={1.1} /></div><div className="lbl">Videos watched</div></div>
      <div className="stat"><div className="num tnum"><CountUp value={4} duration={0.9} /><small>wk</small></div><div className="lbl">Streak</div></div>
    </Stagger>
  );
}

/* =====================================================================
   V1 — EDITORIAL (the "magazine homepage")
   ===================================================================== */
function HomeEditorial({ profile, goto, onWatch, points, gamification }) {
  const D = PV_DATA;
  const recommended = useMemoH(() => D.TOOLS.slice(0, 6), []);
  const trending = useMemoH(() => D.VIDEOS.slice(0, 8), []);
  const topCreators = D.CREATORS.slice(0, 6);
  const fieldName = D.FIELDS.find(f => f.id === profile.field)?.name || "your field";
  const myProgress = [
    { tool: "ChatGPT", level: "Beginner", pct: 100 },
    { tool: "ChatGPT", level: "Intermediate", pct: 62 },
    { tool: "Midjourney", level: "Beginner", pct: 38 },
    { tool: "Cursor", level: "Beginner", pct: 14 },
  ];

  return (
    <div className="route">
      <div className="shell">
        <section className="hero">
          <div>
            <div className="hero-meta">
              <span className="live-dot" />
              Live · {fieldName} · {profile.role}
            </div>
            <h1>
              Welcome back,<br/>
              <em>{profile.name.split(" ")[0]}.</em>
            </h1>
            <p className="lead">
              The exact AI tools, skill levels, and peers shaped around your day in {fieldName.toLowerCase()}.
            </p>
            <div className="ctas">
              <button className="btn btn-primary btn-lg" onClick={() => goto("learning")}>
                Continue learning <Icon.arrow size={14}/>
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => goto("browse")}>
                <Icon.search size={14}/> Browse all tools
              </button>
            </div>
          </div>

          <Reveal className="path-card" y={16} delay={0.1}>
            <div className="path-head">
              <div className="tool-mark">CG</div>
              <div>
                <div style={{fontSize: 13.5, fontWeight: 600}}>Your active path</div>
                <div className="dim mono" style={{fontSize: 11.5}}>ChatGPT for {fieldName}</div>
              </div>
            </div>
            {myProgress.map((p, i) => (
              <div key={i} className="progress-row">
                <div style={{fontSize: 12.5}}>
                  <div style={{fontWeight: 500}}>{p.tool}</div>
                  <div className="dim mono" style={{fontSize: 11}}>{p.level}</div>
                </div>
                <div className="progress-bar"><ProgressBar value={p.pct} delay={0.25 + i * 0.08} /></div>
                <div className="pct tnum"><CountUp value={p.pct} duration={0.9} suffix="%" /></div>
              </div>
            ))}
          </Reveal>
        </section>

        <HeroStats profile={profile} points={points} gamification={gamification} fieldName={fieldName} />

        <section className="mb-24">
          <div className="section-head">
            <div>
              <div className="eyebrow mb-8">Recommended for {fieldName.toLowerCase()}</div>
              <h2>Tools to learn next</h2>
            </div>
            <div className="head-meta">{recommended.length} tools</div>
          </div>
          <Stagger className="tool-grid" stagger={0.05} y={18}>
            {recommended.map(t => (
              <div key={t.id} className="tool-tile" onClick={() => goto("tool", { toolId: t.id })}>
                <div className="tool-mark">{t.mark}</div>
                <div className="tool-cat">{t.cat}</div>
                <div className="tool-name">{t.name}</div>
                <div className="dim" style={{fontSize: 12, marginBottom: 14, lineHeight: 1.4}}>{t.desc}</div>
                <div className="tool-stats mono">
                  <span><Icon.play size={11}/> {t.videos}</span>
                  <span><Icon.eye size={11}/> {PV_DATA.fmtViews(t.learners)}</span>
                </div>
              </div>
            ))}
          </Stagger>
        </section>

        <div className="spacer" />

        <section className="mb-24">
          <div className="section-head">
            <div>
              <div className="eyebrow mb-8"><Icon.trend size={11}/> Trending in {fieldName.toLowerCase()}</div>
              <h2>This week's most-watched</h2>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => goto("browse")}>See all <Icon.arrow size={12}/></button>
          </div>
          <Stagger className="video-grid" stagger={0.06} y={18}>
            {trending.slice(0, 4).map(v => (
              <VideoCard key={v.id} video={v} onClick={(vv) => onWatch(vv)} />
            ))}
          </Stagger>
        </section>

        <div className="spacer" />

        <section className="mb-24">
          <div className="section-head">
            <div>
              <div className="eyebrow mb-8">People to learn from</div>
              <h2>Top creators in your field</h2>
            </div>
            <div className="head-meta">Updated daily</div>
          </div>
          <Stagger className="creator-strip" stagger={0.04} y={14}>
            {topCreators.map(c => (
              <div key={c.id} className="creator-tile">
                <Avatar name={c.name} initials={c.initials} size={44} className="ca" />
                <div className="who">
                  <b>{c.name}{c.verified && <Verified />}</b>
                  <small>{c.role} · {c.company}</small>
                </div>
              </div>
            ))}
          </Stagger>
        </section>

        <div style={{height: 96}} />
      </div>
    </div>
  );
}

/* =====================================================================
   V2 — FEED (TikTok-style vertical reel of peer tips)
   ===================================================================== */
function HomeFeed({ profile, goto, onWatch, points, gamification }) {
  const D = PV_DATA;
  const fieldName = D.FIELDS.find(f => f.id === profile.field)?.name || "your field";
  const feedVideos = useMemoH(() =>
    D.VIDEOS.filter(v => v.field === profile.field || Math.random() > 0.5).slice(0, 10),
    [profile.field]
  );
  const [active, setActive] = useStateH(0);

  const v = feedVideos[active] || feedVideos[0];
  const tool = D.tool(v.toolId);
  const creator = D.creator(v.creatorId);

  return (
    <div className="route">
      <div className="shell">
        <div className="feed-layout">
          {/* LEFT rail: context */}
          <Reveal as="aside" className="feed-rail" y={12}>
            <div className="eyebrow mb-16">For you · {fieldName}</div>
            <h1 className="hd-1" style={{fontSize: 32, marginBottom: 12, letterSpacing: "-0.025em"}}>
              Peer tips, one at a time.
            </h1>
            <p className="muted" style={{fontSize: 14, lineHeight: 1.55, marginBottom: 24}}>
              Snackable 3-minute videos from people doing your job. Swipe to skip. Tap to go deep.
            </p>
            <HeroStats profile={profile} points={points} gamification={gamification} fieldName={fieldName} />
          </Reveal>

          {/* CENTER: vertical reel */}
          <Stagger className="reel" stagger={0.05} y={20}>
            {feedVideos.map((vv, idx) => {
              const vtool = D.tool(vv.toolId);
              const vcreator = D.creator(vv.creatorId);
              const isActive = idx === active;
              return (
                <div key={vv.id} className={`reel-card ${isActive ? "active" : ""}`}>
                  <div className="reel-player">
                    <img className="reel-player-img" src={thumbUrl(vv.id, 960, 540)} alt="" loading="lazy" decoding="async" />
                    <div className="reel-player-bg" />
                    <div className="reel-player-ctrl">
                      <div className="play-big" onClick={() => onWatch(vv)}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A0A0B"><polygon points="6 4 20 12 6 20"/></svg>
                      </div>
                    </div>
                    <div className="reel-player-tag mono">{vtool.name} · {vv.level}</div>
                    <div className="reel-player-duration mono">{vv.duration}</div>
                  </div>
                  <div className="reel-meta">
                    <div className="flex gap-8 items-center mb-8" style={{flexWrap: "wrap"}}>
                      <span className={`tag ${vv.level}`}>{vv.level}</span>
                      <span className="tag">{vtool.name}</span>
                      <span className="dim mono" style={{fontSize: 11.5}}>{D.fmtViews(vv.views)} views · ★ {vv.rating}</span>
                    </div>
                    <h3 className="hd-3" style={{fontSize: 18, marginBottom: 10}}>{vv.title}</h3>
                    <div className="flex gap-8 items-center">
                      <Avatar name={vcreator.name} initials={vcreator.initials} size={28} className="creator-avatar" />
                      <div style={{fontSize: 12.5}}>
                        <span style={{fontWeight: 600}}>{vcreator.name}</span>
                        {vcreator.verified && <Verified/>} <span className="dim">· {vcreator.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="reel-actions">
                    <button className="reel-act" onClick={() => { if (idx > 0) setActive(idx - 1); }} title="Previous">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 15l-6-6-6 6"/></svg>
                    </button>
                    <button className="reel-act accent" onClick={() => onWatch(vv)} title="Watch">
                      <Icon.play size={16} />
                    </button>
                    <button className="reel-act" onClick={() => { if (idx < feedVideos.length - 1) setActive(idx + 1); }} title="Next">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <div className="reel-act ghost" title="Save"><Icon.bookmark size={14}/></div>
                    <div className="reel-act ghost" title="Share">↗</div>
                    <div className="reel-counter mono">{idx + 1}/{feedVideos.length}</div>
                  </div>
                </div>
              );
            })}
          </Stagger>

          {/* RIGHT rail: discussion on active video */}
          <Reveal as="aside" className="feed-rail right" y={12} delay={0.1}>
            <div className="eyebrow mb-16">Discussion · {tool.name}</div>
            <Stagger className="row-gap-12" stagger={0.06} y={10}>
              {[
                { who: creator.initials, name: creator.name, t: "Full walkthrough in the Intermediate path — link in comments.", time: "2h" },
                { who: "AP", name: "Anna Park", t: `The prompt at 3:45 saved me 2 hrs today in ${fieldName.toLowerCase()}.`, time: "5h" },
                { who: "TB", name: "Tom B.", t: "Same flow works on Claude too — tested this morning.", time: "1d" },
              ].map((c, i) => (
                <div key={i} style={{paddingTop: i ? 12 : 0, borderTop: i ? "1px solid var(--border)" : "none"}}>
                  <div className="flex gap-8 items-center mb-8">
                    <Avatar name={c.name} initials={c.who} size={28} className="creator-avatar" />
                    <div style={{fontSize: 12.5, fontWeight: 600}}>{c.name}</div>
                    <div className="dim mono" style={{fontSize: 11}}>{c.time}</div>
                  </div>
                  <div style={{fontSize: 13, color: "var(--fg-2)"}}>{c.t}</div>
                </div>
              ))}
            </Stagger>
            <textarea className="textarea mt-16" placeholder="Reply to this tip…" rows={2} />
          </Reveal>
        </div>

        <div style={{height: 96}} />
      </div>
    </div>
  );
}

/* =====================================================================
   V3 — LIBRARY (shelves, browse-first)
   ===================================================================== */
function HomeLibrary({ profile, goto, onWatch, points, gamification }) {
  const D = PV_DATA;
  const fieldName = D.FIELDS.find(f => f.id === profile.field)?.name || "your field";

  const shelves = useMemoH(() => {
    return [
      { id: "llm", title: "Large language models", sub: "Text, chat, reasoning", tools: D.TOOLS.filter(t => t.cat === "LLM") },
      { id: "image", title: "Image generation", sub: "Visuals, art, concepts", tools: D.TOOLS.filter(t => t.cat === "Image") },
      { id: "code", title: "Code & development", sub: "IDEs, copilots, agents", tools: D.TOOLS.filter(t => t.cat === "Code") },
      { id: "video", title: "Video & audio", sub: "Generation, editing, voice", tools: D.TOOLS.filter(t => t.cat === "Video" || t.cat === "Audio") },
      { id: "design", title: "Design & productivity", sub: "Canvas, docs, workflow", tools: D.TOOLS.filter(t => ["Design", "Productivity", "Marketing"].includes(t.cat)) },
    ];
  }, []);

  return (
    <div className="route">
      <div className="shell">
        <section className="lib-hero">
          <Reveal y={16}>
            <div className="hero-meta">
              <span style={{width: 6, height: 6, background: "var(--fg)", display: "inline-block"}} />
              The library · open 24/7
            </div>
            <h1 className="h-display" style={{fontSize: "clamp(44px, 6.2vw, 76px)"}}>
              Walk the stacks.
            </h1>
            <p className="lead" style={{fontSize: 17, maxWidth: 540}}>
              {D.TOOLS.length} AI tools organized by category. Each with four skill levels, hand-picked by practitioners in {fieldName.toLowerCase()}.
            </p>
            <div className="ctas">
              <button className="btn btn-primary btn-lg" onClick={() => goto("browse")}>
                <Icon.search size={14}/> Search the library
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => goto("learning")}>Your shelf</button>
            </div>
          </Reveal>
          <HeroStats profile={profile} points={points} gamification={gamification} fieldName={fieldName} />
        </section>

        {shelves.map(shelf => (
          <section key={shelf.id} className="shelf">
            <div className="shelf-head">
              <div>
                <div className="eyebrow mb-8">Shelf</div>
                <h2 className="hd-2" style={{fontSize: 26, letterSpacing: "-0.02em"}}>{shelf.title}</h2>
                <div className="dim mono" style={{fontSize: 12, marginTop: 6}}>{shelf.sub} · {shelf.tools.length} titles</div>
              </div>
              <div className="dim mono" style={{fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", alignSelf: "end"}}>
                {"—".repeat(Math.max(2, 20 - shelf.title.length))}
              </div>
            </div>
            <Stagger className="shelf-row" stagger={0.04} y={14}>
              {shelf.tools.map(t => (
                <div key={t.id} className="book" onClick={() => goto("tool", { toolId: t.id })}
                     style={{"--book-hue": (t.id.charCodeAt(0) * 13) % 360}}>
                  <div className="book-spine">
                    <div className="book-mark mono">{t.mark}</div>
                    <div className="book-title">{t.name}</div>
                    <div className="book-stats mono">{t.videos}</div>
                  </div>
                  <div className="book-preview">
                    <div className="tool-mark">{t.mark}</div>
                    <div style={{fontWeight: 600, fontSize: 14, marginTop: 8}}>{t.name}</div>
                    <div className="dim mono" style={{fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em"}}>{t.cat}</div>
                    <div style={{fontSize: 12, color: "var(--fg-2)", marginTop: 8, lineHeight: 1.4}}>{t.desc}</div>
                    <div className="flex gap-12 mt-16 mono" style={{fontSize: 11, color: "var(--fg-3)"}}>
                      <span>{t.videos} videos</span>
                      <span>{D.fmtViews(t.learners)} learners</span>
                    </div>
                  </div>
                </div>
              ))}
            </Stagger>
          </section>
        ))}

        <div style={{height: 96}} />
      </div>
    </div>
  );
}

/* =====================================================================
   V4 — PATH (today's lesson + peers at your company)
   ===================================================================== */
function HomePath({ profile, goto, onWatch, points, gamification }) {
  const D = PV_DATA;
  const fieldName = D.FIELDS.find(f => f.id === profile.field)?.name || "your field";

  // Today's lesson — pick a deterministic video for the user
  const today = useMemoH(() => {
    const recs = D.VIDEOS.filter(v => v.level === "intermediate").slice(12, 16);
    return recs[0];
  }, []);
  const todayTool = D.tool(today.toolId);
  const todayCreator = D.creator(today.creatorId);

  const peers = useMemoH(() => D.CREATORS.slice(0, 5), []);
  const peerActivity = [
    { who: "Sarah Chen", act: "watched", what: "Better prompts for Claude", time: "12m ago" },
    { who: "Marcus Wei", act: "published", what: "Cursor workflows for staff engineers", time: "1h ago" },
    { who: "Priya Iyer", act: "completed", what: "ChatGPT · Intermediate", time: "3h ago" },
    { who: "Tom Bergström", act: "rated ★5", what: "Midjourney lighting tricks", time: "5h ago" },
    { who: "Emma Wilson", act: "watched", what: "Copy.ai for product launches", time: "yesterday" },
  ];

  return (
    <div className="route">
      <div className="shell">
        <section className="path-hero">
          <div className="path-today">
            <div className="eyebrow mb-16">◉ Today's lesson · {new Date().toLocaleDateString("en-US", {weekday: "long"})}</div>
            <div className="flex gap-12 items-center mb-16">
              <div className="tool-mark-lg" style={{width: 56, height: 56, fontSize: 16, borderRadius: 14}}>{todayTool.mark}</div>
              <div>
                <div className="dim mono" style={{fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.06em"}}>
                  {todayTool.name} · {today.level} · {today.duration}
                </div>
                <div className="mono" style={{fontSize: 11, color: "var(--accent-deep)", marginTop: 4}}>
                  Picked for {fieldName.toLowerCase()}
                </div>
              </div>
            </div>
            <h1 className="h-display" style={{fontSize: "clamp(38px, 4.6vw, 56px)", marginBottom: 20}}>
              {today.title}
            </h1>
            <div className="flex gap-8 items-center mb-24">
              <Avatar name={todayCreator.name} initials={todayCreator.initials} size={32} className="creator-avatar" />
              <div>
                <div style={{fontWeight: 600, fontSize: 13.5}}>{todayCreator.name}{todayCreator.verified && <Verified/>}</div>
                <div className="dim mono" style={{fontSize: 11.5}}>{todayCreator.role} · {todayCreator.company}</div>
              </div>
            </div>
            <div className="ctas">
              <button className="btn btn-accent btn-lg" onClick={() => onWatch(today)}>
                <Icon.play size={14}/> Start today's lesson · {today.duration}
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => goto("learning")}>Skip — continue path →</button>
            </div>
            <div className="path-today-meta mono">
              <div><span className="dim">Why this</span> {todayTool.name} is the #1 tool for {fieldName.toLowerCase()}, and this is your weakest skill area.</div>
              <div><span className="dim">Earn</span> +10 pts · +1 streak day · {today.completion}% of peers completed this</div>
            </div>
          </div>

          <Reveal className="path-gauge" y={16}>
            <div className="eyebrow mb-16">Your week</div>
            <div className="gauge-ring">
              <Ring size={120} stroke={8} value={4} total={5} duration={1.5}>
                <div className="tnum mono" style={{fontSize: 28, fontWeight: 600}}><CountUp value={4} duration={1.2} /><span className="dim" style={{fontSize: 14}}>/5</span></div>
                <div className="dim mono" style={{fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em"}}>days</div>
              </Ring>
            </div>
            <div className="row-gap-12 mt-24" style={{width: "100%"}}>
              <div className="flex-between" style={{fontSize: 13}}><span className="muted">This week</span><span className="mono tnum" style={{fontWeight: 600}}><CountUp value={points} /> pts</span></div>
              <div className="flex-between" style={{fontSize: 13}}><span className="muted">Rank in {fieldName}</span><span className="mono tnum" style={{fontWeight: 600}}>#2 / 40</span></div>
              <div className="flex-between" style={{fontSize: 13}}><span className="muted">Streak</span><span className="mono tnum" style={{fontWeight: 600}}>4 weeks {gamification === "heavy" && "🔥"}</span></div>
            </div>
          </Reveal>
        </section>

        <section className="path-peers">
          <div className="section-head">
            <div>
              <div className="eyebrow mb-8">◎ Your peers</div>
              <h2 className="hd-2">What others in {fieldName.toLowerCase()} are learning</h2>
            </div>
            <div className="head-meta">Live · {peers.length} active</div>
          </div>
          <div className="peer-strip">
            {peers.map(p => (
              <div key={p.id} className="peer-dot">
                <Avatar name={p.name} initials={p.initials} size={48} className="ca creator-avatar" />
                <div style={{fontSize: 12, fontWeight: 600, marginTop: 8}}>{p.name.split(" ")[0]}</div>
                <div className="dim mono" style={{fontSize: 10}}>{p.company}</div>
                <span className="peer-live" />
              </div>
            ))}
          </div>
          <div className="peer-feed">
            {peerActivity.map((a, i) => {
              const ini = a.who.split(" ").map(s => s[0]).slice(0,2).join("");
              return (
                <div key={i} className="peer-row">
                  <Avatar name={a.who} initials={ini} size={32} className="creator-avatar" />
                  <div style={{flex: 1, fontSize: 13.5}}>
                    <b>{a.who}</b> <span className="dim">{a.act}</span> <span style={{fontWeight: 500}}>"{a.what}"</span>
                  </div>
                  <div className="dim mono" style={{fontSize: 11}}>{a.time}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="path-next">
          <div className="section-head">
            <div>
              <div className="eyebrow mb-8">↗ After today</div>
              <h2 className="hd-2">Next three days on your path</h2>
            </div>
          </div>
          <div className="path-timeline">
            {[
              { d: "Tomorrow", t: "Claude for long-doc analysis", mins: 9, tool: "CL" },
              { d: "Wednesday", t: "Prompt patterns that scale", mins: 7, tool: "GP" },
              { d: "Thursday", t: "Connecting AI to your stack", mins: 12, tool: "NA" },
            ].map((d, i) => (
              <div key={i} className="path-day">
                <div className="path-day-meta mono">{d.d}</div>
                <div className="tool-mark" style={{marginBottom: 12}}>{d.tool}</div>
                <div style={{fontWeight: 600, fontSize: 14.5, marginBottom: 6}}>{d.t}</div>
                <div className="dim mono" style={{fontSize: 11.5}}>{d.mins} min · +10 pts</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{height: 96}} />
      </div>
    </div>
  );
}

/* -------- router -------- */
function Home(props) {
  const variant = props.variant || "editorial";
  if (variant === "feed") return <HomeFeed {...props} />;
  if (variant === "library") return <HomeLibrary {...props} />;
  if (variant === "path") return <HomePath {...props} />;
  return <HomeEditorial {...props} />;
}


export { Home };
