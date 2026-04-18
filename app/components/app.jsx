'use client';
import React from 'react';
import { PV_DATA } from './data';
import { Icon, VideoCard, ToastStack, TopNav } from './atoms';
import { Onboarding } from './onboarding';
import { Home } from './home';
import { Browse } from './browse';
import { ToolDetail } from './tool';
import { VideoPage } from './video';
import { LangdockPanel } from './langdock';
import { Leaderboard } from './leaderboard';
import { Tweaks } from './tweaks';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
  AvatarUploader, ActivityTimeline,
  FormField, Input, EmptyState, Badge,
} from './ui';

const DEFAULT_TWEAKS = {
  theme: "light",
  accentHue: 30,
  homeVariant: "editorial",
  gamification: "subtle",
  roleLens: "dev",
};

const { useState, useEffect, useMemo, useCallback, useRef } = React;

function App() {
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem("pv_profile");
    return stored ? JSON.parse(stored) : null;
  });
  const [route, setRoute] = useState(() => localStorage.getItem("pv_route") || "home");
  const [routeParams, setRouteParams] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pv_route_params") || "{}"); } catch { return {}; }
  });
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("pv_points") || "120", 10));
  const [pillFlash, setPillFlash] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [watched, setWatched] = useState(() => { try { return JSON.parse(localStorage.getItem("pv_watched") || "{}"); } catch { return {}; }});
  const [ratings, setRatings] = useState(() => { try { return JSON.parse(localStorage.getItem("pv_ratings") || "{}"); } catch { return {}; }});
  const [tweaks, setTweaks] = useState(() => ((typeof window !== "undefined" && window.__PV_TWEAKS) || DEFAULT_TWEAKS));
  const [editAvail, setEditAvail] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [langdockVideo, setLangdockVideo] = useState(null);
  const [langdockCompletedFor, setLangdockCompletedFor] = useState(() => { try { return JSON.parse(localStorage.getItem("pv_ld_done") || "{}"); } catch { return {}; } });

  // Persist
  useEffect(() => { if (profile) localStorage.setItem("pv_profile", JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem("pv_route", route); }, [route]);
  useEffect(() => { localStorage.setItem("pv_route_params", JSON.stringify(routeParams)); }, [routeParams]);
  useEffect(() => { localStorage.setItem("pv_points", String(points)); }, [points]);
  useEffect(() => { localStorage.setItem("pv_watched", JSON.stringify(watched)); }, [watched]);
  useEffect(() => { localStorage.setItem("pv_ratings", JSON.stringify(ratings)); }, [ratings]);
  useEffect(() => { localStorage.setItem("pv_ld_done", JSON.stringify(langdockCompletedFor)); }, [langdockCompletedFor]);

  const openLangdock = useCallback((v) => { setLangdockVideo(v); }, []);
  const closeLangdock = useCallback(() => setLangdockVideo(null), []);
  useEffect(() => { window.__openLangdock = openLangdock; }, [openLangdock]);
  const onLangdockComplete = useCallback((v) => {
    setLangdockCompletedFor(prev => {
      if (prev[v.id]) return prev;
      setPoints(p => p + 15);
      setPillFlash(true);
      setTimeout(() => setPillFlash(false), 1200);
      setToasts(ts => [...ts, { id: Math.random().toString(36), msg: "Practice complete", pts: 15, accent: true }]);
      return { ...prev, [v.id]: Date.now() };
    });
  }, []);

  // Apply tweaks → CSS variables + dataset
  useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    document.documentElement.dataset.gamif = tweaks.gamification || "medium";
    document.documentElement.style.setProperty("--accent-h", tweaks.accentHue);
  }, [tweaks]);

  // Role lens: layer tweaks.roleLens over profile.field for live demo
  const lensProfile = useMemo(() => {
    if (!profile) return profile;
    const lens = tweaks.roleLens;
    if (!lens || lens === profile.field) return profile;
    const roleMap = {
      marketing: "Marketing Manager",
      dev: "Full-stack Developer",
      design: "Product Designer",
      legal: "Legal Counsel",
      hr: "People Ops Lead",
      ops: "Operations Manager",
    };
    return { ...profile, field: lens, role: roleMap[lens] || profile.role };
  }, [profile, tweaks.roleLens]);

  // Listener for host edit-mode protocol — register first, then announce
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      // Tweaks panel is persistent now — host activate/deactivate messages
      // are accepted but no longer gate visibility.
    };
    window.addEventListener("message", onMsg);
    setEditAvail(true);
    window.parent.postMessage({type: "__edit_mode_available"}, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const persistTweaks = useCallback((next) => {
    setTweaks(next);
    window.parent.postMessage({type: "__edit_mode_set_keys", edits: next}, "*");
  }, []);

  const goto = useCallback((r, params = {}) => {
    setRoute(r);
    setRouteParams(params);
    window.scrollTo({top: 0, behavior: "auto"});
  }, []);

  const toast = useCallback((opts) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, ...opts }]);
    setTimeout(() => setToasts(t => t.map(x => x.id === id ? {...x, out: true} : x)), 2400);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2700);
  }, []);

  const flashPill = useCallback(() => {
    setPillFlash(true);
    setTimeout(() => setPillFlash(false), 800);
  }, []);

  const onWatch = useCallback((video) => {
    if (watched[video.id]) {
      goto("video", { videoId: video.id });
      return;
    }
    // Mark watched + add points
    setWatched(w => ({ ...w, [video.id]: true }));
    setPoints(p => p + 10);
    flashPill();
    toast({ msg: "Video watched", pts: 10, accent: true, icon: <Icon.bolt size={14}/> });
    if (route !== "video") goto("video", { videoId: video.id });
  }, [watched, route, goto, toast, flashPill]);

  const onRate = useCallback((video, r) => {
    if (ratings[video.id]) return;
    setRatings(rs => ({ ...rs, [video.id]: r }));
    setPoints(p => p + 3);
    flashPill();
    toast({ msg: `Rated ${r} ★`, pts: 3, accent: true, icon: <Icon.star size={14}/> });
  }, [ratings, toast, flashPill]);

  const simWatch = useCallback(() => {
    setPoints(p => p + 10);
    flashPill();
    toast({ msg: "Simulated watch", pts: 10, accent: true, icon: <Icon.bolt size={14}/> });
  }, [toast, flashPill]);

  // ----- Render
  // Persistent tweaks block — always rendered, floats fixed bottom-right.
  const tweaksBlock = (
    <Tweaks
      tweaks={tweaks}
      setTweaks={persistTweaks}
      onClose={() => {}}
    />
  );

  if (!profile) {
    return (
      <>
        <Onboarding onDone={(p) => { setProfile(p); setRoute("home"); }} />
        {tweaksBlock}
      </>
    );
  }

  const activeProfile = lensProfile || profile;
  let page;
  if (route === "home") page = <Home profile={activeProfile} goto={goto} onWatch={onWatch} points={points} variant={tweaks.homeVariant} gamification={tweaks.gamification} />;
  else if (route === "browse") page = <Browse onWatch={(v) => goto("video", { videoId: v.id })} goto={goto} profile={activeProfile} />;
  else if (route === "tool") page = <ToolDetail toolId={routeParams.toolId} onWatch={(v) => goto("video", { videoId: v.id })} goto={goto} />;
  else if (route === "video") {
    const v = PV_DATA.video(routeParams.videoId) || PV_DATA.VIDEOS[0];
    page = <VideoPage video={v} onWatch={onWatch} onRate={onRate} goto={goto} watched={!!watched[v.id]} rating={ratings[v.id] || 0} openLangdock={openLangdock} langdockDone={!!langdockCompletedFor[v.id]} />;
  }
  else if (route === "leaderboard") page = <Leaderboard profile={activeProfile} points={points} simWatch={simWatch} />;
  else if (route === "learning") page = <Learning profile={activeProfile} goto={goto} watched={watched} />;
  else if (route === "share") page = <ShareKnowledge goto={goto} profile={activeProfile} />;
  else if (route === "profile") page = <Profile profile={profile} setProfile={setProfile} points={points} watched={watched} langdockCompletedFor={langdockCompletedFor} tweaks={tweaks} setTweaks={persistTweaks} />;
  else page = <Home profile={activeProfile} goto={goto} onWatch={onWatch} points={points} variant={tweaks.homeVariant} gamification={tweaks.gamification} />;

  const content = (
    <div className="app">
      <TopNav route={route} goto={goto} points={points} pillFlash={pillFlash} profile={activeProfile} onProfile={() => goto("profile")} gamification={tweaks.gamification} />
      {page}
      <ToastStack toasts={toasts} />
      <LangdockPanel open={!!langdockVideo} video={langdockVideo} onClose={closeLangdock} onComplete={onLangdockComplete} />
      {tweaksBlock}
      <button className="mobile-toggle" onClick={() => setMobile(m => !m)}>
        {mobile ? "← Desktop" : "📱 Mobile preview"}
      </button>
    </div>
  );

  if (mobile) {
    return (
      <div className="mobile-stage">
        <div className="mobile-frame">
          <div className="status">
            <span>9:41</span>
            <span style={{display: "flex", gap: 6, alignItems: "center"}}>
              <span style={{fontSize: 10}}>●●●●</span>
              <span>100%</span>
            </span>
          </div>
          <div className="scroll">
            <MobileView profile={profile} route={route} routeParams={routeParams} goto={goto} onWatch={onWatch} points={points} simWatch={simWatch} watched={watched} ratings={ratings} onRate={onRate} />
          </div>
          <div className="tabbar">
            {[
              { id: "home", l: "Home", icon: "◉" },
              { id: "browse", l: "Browse", icon: "▦" },
              { id: "leaderboard", l: "Ranks", icon: "▲" },
              { id: "share", l: "Share", icon: "↑" },
              { id: "profile", l: "Me", icon: "●" },
            ].map(t => (
              <div key={t.id} className={`tab ${route === t.id ? "active" : ""}`} onClick={() => goto(t.id)}>
                <span style={{fontSize: 18, lineHeight: 1}}>{t.icon}</span>
                {t.l}
              </div>
            ))}
          </div>
        </div>
        <ToastStack toasts={toasts} />
        {tweaksBlock}
        <button className="mobile-toggle" onClick={() => setMobile(false)}>← Desktop</button>
      </div>
    );
  }

  return content;
}

// ---- Profile (editable, local-only, no backend) ----
function Profile({ profile, setProfile, points, watched, langdockCompletedFor, tweaks, setTweaks }) {
  const D = PV_DATA;
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const savedTimeoutRef = useRef(null);

  useEffect(() => { setForm(profile); }, [profile]);
  useEffect(() => () => { if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current); }, []);

  const dirty = JSON.stringify(form) !== JSON.stringify(profile);

  const save = () => {
    const initials = (form.name || "").split(/\s+/).map(s => s[0]).slice(0, 2).join("").toUpperCase() || profile.initials;
    setProfile({ ...form, initials });
    setSaved(true);
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
    savedTimeoutRef.current = setTimeout(() => setSaved(false), 2500);
  };

  const toggleGoal = (g) => {
    const has = form.goals?.includes(g);
    setForm({ ...form, goals: has ? form.goals.filter(x => x !== g) : [...(form.goals || []), g] });
  };

  // Avatar upload persists immediately (no save button) — feels like direct manipulation.
  const onAvatarSave = (dataUrl) => {
    const next = { ...profile, avatarDataUrl: dataUrl || undefined };
    setProfile(next);
    setForm(next);
  };

  const watchedCount = Object.keys(watched || {}).length;
  const langdockCount = Object.keys(langdockCompletedFor || {}).length;

  // Build timeline items from watched + langdock events, newest first.
  const timelineItems = useMemo(() => {
    const relTime = (ts) => {
      const diff = Date.now() - ts;
      const h = diff / 3_600_000;
      if (h < 1) return `${Math.max(1, Math.round(diff / 60_000))}m ago`;
      if (h < 24) return `${Math.round(h)}h ago`;
      const d = Math.round(h / 24);
      return `${d}d ago`;
    };
    const events = [];
    Object.entries(watched || {}).forEach(([id, ts]) => {
      const v = D.video(parseInt(id, 10));
      if (!v) return;
      const tool = D.tool(v.toolId);
      events.push({
        id: `w-${id}`,
        type: "info",
        ts,
        title: `Watched "${v.title}"`,
        meta: `${tool?.name || ""} · ${v.level}`,
        timestamp: relTime(ts),
        tags: [{ label: v.level, color: "info" }, { label: "+10 pts", color: "accent" }],
      });
    });
    Object.entries(langdockCompletedFor || {}).forEach(([id, ts]) => {
      const v = D.video(parseInt(id, 10));
      if (!v) return;
      events.push({
        id: `l-${id}`,
        type: "accent",
        ts,
        title: `Practiced on Langdock`,
        meta: v.title,
        timestamp: relTime(ts),
        tags: [{ label: "+15 pts", color: "accent" }],
      });
    });
    return events.sort((a, b) => b.ts - a.ts).slice(0, 30);
  }, [watched, langdockCompletedFor, D]);

  const identityTab = (
    <div className="row-gap-20">
      <div className="pv-card pv-card--padded">
        <h2 className="h-2">Photo</h2>
        <p className="dim" style={{fontSize: 13, marginTop: 0, marginBottom: 16}}>
          Add a real photo or keep the initials. Stored in your browser only.
        </p>
        <AvatarUploader
          currentUrl={form.avatarDataUrl || null}
          initials={profile.initials}
          onSave={onAvatarSave}
        />
      </div>

      <div className="pv-card pv-card--padded">
        <h2 className="h-2">Identity</h2>
        <p className="dim" style={{fontSize: 13, marginTop: 0, marginBottom: 16}}>
          Name, email, and role — shown on the leaderboard and on anything you share.
        </p>
        <div className="row-gap-16">
          <FormField label="Name" htmlFor="pf-name">
            <Input id="pf-name" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" />
          </FormField>
          <FormField label="Email" htmlFor="pf-email" helper="We don't send anything yet — this is just for your profile display.">
            <Input id="pf-email" type="email" value={form.email || ""} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@work.com" />
          </FormField>
          <FormField label="Role / Title" htmlFor="pf-role">
            <Input id="pf-role" value={form.role || ""} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. Marketing Manager" />
          </FormField>
        </div>
      </div>

      <div className="pv-card pv-card--padded">
        <h2 className="h-2">Field</h2>
        <p className="dim" style={{fontSize: 13, marginTop: 0, marginBottom: 16}}>
          How we tailor your home. Also shows on your public profile.
        </p>
        <div className="field-grid" style={{gridTemplateColumns: "repeat(2, 1fr)"}}>
          {D.FIELDS.map(f => (
            <div key={f.id} className={`opt ${form.field === f.id ? "sel" : ""}`} onClick={() => setForm({...form, field: f.id})}>
              <span style={{fontFamily: "var(--mono)", fontSize: 13, opacity: 0.6, width: 14}}>{f.icon}</span>
              {f.name}
            </div>
          ))}
        </div>
      </div>

      <div className="pv-card pv-card--padded">
        <h2 className="h-2">Goals</h2>
        <p className="dim" style={{fontSize: 13, marginTop: 0, marginBottom: 16}}>
          Pick everything that fits. We'll weight recommendations around these.
        </p>
        <div className="field-grid">
          {D.GOALS.map(g => {
            const sel = form.goals?.includes(g);
            return (
              <div key={g} className={`opt ${sel ? "sel" : ""}`} onClick={() => toggleGoal(g)}>
                <div className="check">{sel && <Icon.check size={11}/>}</div>
                {g}
              </div>
            );
          })}
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-ghost" onClick={() => setForm(profile)} disabled={!dirty}>
          Discard changes
        </button>
        <div className="profile-save-row">
          {saved && <span className="profile-saved">Saved <Icon.check size={12}/></span>}
          <button className="btn btn-primary btn-lg" onClick={save} disabled={!dirty}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );

  const activityTab = (
    <div className="row-gap-20">
      <div className="pv-card pv-card--padded">
        <h2 className="h-2">Your numbers</h2>
        <p className="dim" style={{fontSize: 13, marginTop: 0, marginBottom: 20}}>
          Adds up as you watch, rate, and share.
        </p>
        <div className="stat-strip" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
          <div className="stat"><div className="num tnum">{points}</div><div className="lbl">Points</div></div>
          <div className="stat"><div className="num tnum">{watchedCount}</div><div className="lbl">Watched</div></div>
          <div className="stat"><div className="num tnum">{langdockCount}</div><div className="lbl">Practiced</div></div>
        </div>
      </div>

      <div className="pv-card pv-card--padded">
        <h2 className="h-2">Recent activity</h2>
        <p className="dim" style={{fontSize: 13, marginTop: 0, marginBottom: 20}}>
          Last 30 things you did in the app.
        </p>
        <ActivityTimeline items={timelineItems} />
      </div>
    </div>
  );

  const appearanceTab = (
    <div className="row-gap-20">
      <div className="pv-card pv-card--padded">
        <h2 className="h-2">Theme</h2>
        <p className="dim" style={{fontSize: 13, marginTop: 0, marginBottom: 16}}>
          Warm light or warm charcoal. Pick what your eyes prefer.
        </p>
        <div className="theme-radio">
          {["light", "dark"].map(t => (
            <button
              key={t}
              className={`theme-radio__opt ${tweaks.theme === t ? "sel" : ""}`}
              onClick={() => setTweaks({ ...tweaks, theme: t })}
            >
              <span className={`theme-radio__swatch theme-radio__swatch--${t}`} aria-hidden />
              <span style={{textTransform: "capitalize", fontWeight: 500}}>{t}</span>
              {tweaks.theme === t && <Icon.check size={14} />}
            </button>
          ))}
        </div>
        <p className="dim mono" style={{fontSize: 11.5, marginTop: 12}}>
          More visual controls live in the Tweaks bubble (bottom right).
        </p>
      </div>

      <div className="pv-card pv-card--padded pv-card--danger">
        <h2 className="h-2">Reset everything</h2>
        <p className="dim" style={{fontSize: 13.5, marginTop: 0, marginBottom: 16}}>
          Clears your profile, watched history, points, and ratings from this browser. There's no server copy — once you reset, it's gone.
        </p>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (!confirm("Reset everything? This can't be undone.")) return;
            localStorage.clear();
            location.reload();
          }}
        >
          Reset demo
        </button>
      </div>
    </div>
  );

  const avatarNode = form.avatarDataUrl
    ? <img src={form.avatarDataUrl} alt="" className="avatar-xl avatar-xl--img" />
    : <div className="avatar-xl">{profile.initials}</div>;

  return (
    <div className="route">
      <div className="shell">
        <div className="hero profile-hero" style={{padding: "40px 0 24px", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 24}}>
          <div>
            <div className="eyebrow mb-16">Your profile</div>
            <h1 className="h-1" style={{fontSize: 44, margin: 0}}>{profile.name}</h1>
            <p className="muted" style={{fontSize: 15, maxWidth: 540, marginTop: 8}}>
              <Badge variant="soft" color="info" size="sm" style={{marginRight: 8}}>
                {D.FIELDS.find(f => f.id === profile.field)?.name || "—"}
              </Badge>
              {profile.role} · saved locally in this browser
            </p>
          </div>
          {avatarNode}
        </div>

        <Tabs defaultValue="identity">
          <TabsList>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <TabsContent value="identity">{identityTab}</TabsContent>
          <TabsContent value="activity">{activityTab}</TabsContent>
          <TabsContent value="appearance">{appearanceTab}</TabsContent>
        </Tabs>

        <div style={{height: 96}} />
      </div>
    </div>
  );
}

// ---- Two extra screens to keep the app feeling whole ----
function Learning({ profile, goto, watched }) {
  const D = PV_DATA;
  const watchedVideos = D.VIDEOS.filter(v => watched[v.id]);
  const rec = D.TOOLS.slice(0, 4);
  return (
    <div className="route">
      <div className="shell">
        <div className="hero" style={{padding: "40px 0", gridTemplateColumns: "1fr"}}>
          <div>
            <div className="eyebrow mb-16">My learning</div>
            <h1 className="h-1" style={{fontSize: 44}}>Continue where you left off.</h1>
          </div>
        </div>

        <div className="section-head"><h2>In progress</h2><div className="head-meta">{rec.length} active paths</div></div>
        <div className="row-gap-12 mb-24">
          {rec.map((t, i) => (
            <div key={t.id} className="card" style={{padding: 20, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center"}}>
              <div className="tool-mark" style={{width: 48, height: 48, fontSize: 14, borderRadius: 12}}>{t.mark}</div>
              <div>
                <div style={{fontWeight: 600, fontSize: 15.5, marginBottom: 4}}>{t.name} <span className="dim mono" style={{fontSize: 11.5, marginLeft: 6, textTransform: "uppercase", letterSpacing: 0.06 + "em"}}>{["Beginner","Intermediate","Advanced","Beginner"][i]}</span></div>
                <div className="progress-bar" style={{maxWidth: 480, marginTop: 8}}><span style={{width: `${[100,62,38,14][i]}%`}}/></div>
                <div className="dim mono" style={{fontSize: 11.5, marginTop: 6}}>{[8, 5, 3, 1][i]} / {[8, 8, 8, 7][i]} videos · last watched 2d ago</div>
              </div>
              <button className="btn btn-primary" onClick={() => goto("tool", { toolId: t.id })}>Continue</button>
            </div>
          ))}
        </div>

        <div className="section-head"><h2>Watched recently</h2><div className="head-meta">{watchedVideos.length} videos</div></div>
        {watchedVideos.length === 0 ? (
          <div className="pv-card">
            <EmptyState
              icon={<Icon.play size={22} />}
              title="Nothing watched yet"
              description="Start a video and this is where your history will live. Each one earns you 10 points."
              action={
                <button className="btn btn-primary" onClick={() => goto("browse")}>
                  Browse videos
                </button>
              }
            />
          </div>
        ) : (
          <div className="video-grid dense">
            {watchedVideos.slice(0, 8).map(v => <VideoCard key={v.id} video={v} onClick={(vv) => goto("video", { videoId: vv.id })}/>)}
          </div>
        )}
        <div style={{height: 96}}/>
      </div>
    </div>
  );
}

function ShareKnowledge({ goto, profile }) {
  const D = PV_DATA;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ url: "", tool: "chatgpt", level: "beginner", title: "", desc: "", field: "marketing" });
  return (
    <div className="route">
      <div className="shell">
        <div className="hero" style={{padding: "40px 0 0", gridTemplateColumns: "1fr"}}>
          <div>
            <div className="eyebrow mb-16">Creator</div>
            <h1 className="h-1" style={{fontSize: 44}}>Share what you know.</h1>
            <p className="muted" style={{fontSize: 16, maxWidth: 540, marginTop: 16}}>Paste a YouTube link, tag the tool & level. Live in 30 seconds.</p>
          </div>
        </div>

        <div className="card" style={{padding: 32, maxWidth: 720, margin: "32px 0"}}>
          <div className="step-bar mb-24">
            <span className={step >= 0 ? "active" : ""} />
            <span className={step >= 1 ? "active" : ""} />
          </div>
          {step === 0 && (
            <div className="row-gap-24">
              <div>
                <h2 className="h-2 mb-8">Step 1 — Paste your video URL</h2>
                <p className="muted" style={{fontSize: 13.5, margin: 0}}>YouTube or Vimeo. We'll embed it automatically.</p>
              </div>
              <input className="input" placeholder="https://youtube.com/watch?v=..." value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
              <div className="flex gap-12" style={{justifyContent: "flex-end"}}>
                <button className="btn btn-primary" onClick={() => setStep(1)}>Next →</button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="row-gap-24">
              <div>
                <h2 className="h-2 mb-8">Step 2 — Tag your video</h2>
                <p className="muted" style={{fontSize: 13.5, margin: 0}}>So learners can find it.</p>
              </div>
              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
                <div className="row-gap-12">
                  <label className="eyebrow">Tool</label>
                  <select className="select" value={form.tool} onChange={e => setForm({...form, tool: e.target.value})}>
                    {D.TOOLS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="row-gap-12">
                  <label className="eyebrow">Level</label>
                  <select className="select" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                    {D.LEVELS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="row-gap-12">
                <label className="eyebrow">Title</label>
                <input className="input" placeholder="e.g. Building a daily ChatGPT workflow" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="row-gap-12">
                <label className="eyebrow">Description</label>
                <textarea className="textarea" rows={3} placeholder="What will learners walk away with?" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}/>
              </div>
              <div className="row-gap-12">
                <label className="eyebrow">Primary field</label>
                <select className="select" value={form.field} onChange={e => setForm({...form, field: e.target.value})}>
                  {D.FIELDS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="flex gap-12" style={{justifyContent: "space-between"}}>
                <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-accent" onClick={() => { alert("Published! (demo)"); goto("home"); }}>Publish video ✓</button>
              </div>
            </div>
          )}
        </div>

        <div className="section-head mt-24"><h2>Your creator stats</h2><div className="head-meta">Last 30 days</div></div>
        <div className="stat-strip">
          <div className="stat"><div className="num tnum">8</div><div className="lbl">Videos uploaded</div></div>
          <div className="stat"><div className="num tnum">12.4<small>k</small></div><div className="lbl">Total views</div></div>
          <div className="stat"><div className="num tnum">4.7<small>★</small></div><div className="lbl">Avg rating</div></div>
          <div className="stat"><div className="num tnum">82<small>%</small></div><div className="lbl">Avg completion</div></div>
        </div>

        <div style={{height: 96}}/>
      </div>
    </div>
  );
}

// --- Mobile view: a compact rerender of the same data ---
function MobileView({ profile, route, routeParams, goto, onWatch, points, simWatch, watched, ratings, onRate }) {
  const D = PV_DATA;
  if (route === "home") {
    const trending = D.VIDEOS.slice(0, 6);
    return (
      <div>
        <div style={{padding: "8px 0 16px"}}>
          <div className="eyebrow mb-8">Welcome back</div>
          <div style={{fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05}}>{profile.name.split(" ")[0]}.</div>
        </div>
        <div className="card" style={{padding: 16, marginBottom: 20, background: "linear-gradient(140deg, var(--brand-tint), var(--bg-elev))"}}>
          <div className="eyebrow mb-8">This week</div>
          <div className="flex-between">
            <div><div className="mono tnum" style={{fontSize: 28, fontWeight: 600}}>{points} pts</div><div className="dim mono" style={{fontSize: 11}}>#2 · Marketing</div></div>
            <button className="btn btn-accent btn-sm" onClick={simWatch}>+ Watch</button>
          </div>
        </div>
        <div className="eyebrow mb-8">Recommended tools</div>
        <div style={{display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 16, marginInline: -16, paddingInline: 16}}>
          {D.TOOLS.slice(0, 6).map(t => (
            <div key={t.id} className="tool-tile" style={{minWidth: 140, padding: 12}} onClick={() => goto("tool", { toolId: t.id })}>
              <div className="tool-mark" style={{width: 28, height: 28, fontSize: 11, marginBottom: 8}}>{t.mark}</div>
              <div className="tool-name" style={{fontSize: 13}}>{t.name}</div>
              <div className="dim mono" style={{fontSize: 10}}>{t.cat}</div>
            </div>
          ))}
        </div>
        <div className="eyebrow mb-8">Trending</div>
        <div className="row-gap-12">
          {trending.map(v => <VideoCard key={v.id} video={v} onClick={() => goto("video", { videoId: v.id })}/>)}
        </div>
      </div>
    );
  }
  if (route === "browse") {
    return (
      <div>
        <div style={{fontSize: 24, fontWeight: 600, margin: "8px 0 16px"}}>Browse</div>
        <div className="row-gap-12">
          {D.VIDEOS.slice(0, 12).map(v => <VideoCard key={v.id} video={v} onClick={() => goto("video", { videoId: v.id })}/>)}
        </div>
      </div>
    );
  }
  if (route === "leaderboard") {
    return <Leaderboard profile={profile} points={points} simWatch={simWatch} />;
  }
  if (route === "video") {
    const v = D.video(routeParams.videoId) || D.VIDEOS[0];
    return <VideoPage video={v} onWatch={onWatch} onRate={onRate} goto={goto} watched={!!watched[v.id]} rating={ratings[v.id] || 0} openLangdock={window.__openLangdock} langdockDone={false} />;
  }
  if (route === "tool") {
    return <ToolDetail toolId={routeParams.toolId} onWatch={(v) => goto("video", { videoId: v.id })} goto={goto} />;
  }
  if (route === "share") {
    return <ShareKnowledge goto={goto} profile={profile} />;
  }
  if (route === "profile") {
    return (
      <div>
        <div style={{textAlign: "center", padding: "20px 0"}}>
          <div className="creator-avatar" style={{width: 64, height: 64, fontSize: 22, margin: "0 auto 12px"}}>{profile.initials}</div>
          <div style={{fontSize: 20, fontWeight: 600}}>{profile.name}</div>
          <div className="dim" style={{fontSize: 13}}>{profile.role}</div>
        </div>
        <div className="stat-strip" style={{gridTemplateColumns: "1fr 1fr"}}>
          <div className="stat"><div className="num tnum">{points}</div><div className="lbl">Points</div></div>
          <div className="stat"><div className="num tnum">12</div><div className="lbl">Videos</div></div>
        </div>
      </div>
    );
  }
  return null;
}



export default App;
