'use client';
import React from 'react';
import { PV_DATA } from './data';

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// --- Logo ---
function PVLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-mark">
      <rect x="3" y="3" width="26" height="26" rx="6" fill="var(--brand)" />
      <rect x="3" y="3" width="26" height="26" rx="6" fill="url(#pv-grad)" opacity="0.35" />
      <circle cx="16" cy="16" r="6.5" stroke="var(--accent)" strokeWidth="1.6" fill="none" />
      <circle cx="16" cy="16" r="2" fill="var(--accent)" />
      <line x1="16" y1="9.5" x2="16" y2="6.5" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
      <defs>
        <radialGradient id="pv-grad" cx="0.7" cy="0.3" r="0.8">
          <stop offset="0" stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// --- Verified check ---
function Verified({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className="verified" aria-hidden>
      <circle cx="6" cy="6" r="6" fill="var(--brand)" />
      <path d="M3.4 6.2 5.2 7.8 8.7 4.4" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- Icons ---
const Icon = {
  search: (p) => <svg width={p?.size||16} height={p?.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  star: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.1 8.6 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.6"/></svg>,
  starO: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><polygon points="12 2 15.1 8.6 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.6"/></svg>,
  eye: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  arrow: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  play: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>,
  check: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  filter: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>,
  trend: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>,
  trophy: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M17 5h3v3a3 3 0 0 1-3 3M7 5H4v3a3 3 0 0 0 3 3"/></svg>,
  upload: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M6 10l6-6 6 6M4 20h16"/></svg>,
  bookmark: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>,
  clock: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  bolt: (p) => <svg width={p?.size||14} height={p?.size||14} viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>,
};

// --- Striped thumbnail ---
function Thumb({ label, duration }) {
  return (
    <div className="thumb">
      <div className="thumb-label">{label}</div>
      {duration && <div className="duration">{duration}</div>}
      <div className="play"><div className="play-circle"><Icon.play size={14} /></div></div>
    </div>
  );
}

// --- Video card ---
function VideoCard({ video, onClick }) {
  const D = PV_DATA;
  const tool = D.tool(video.toolId);
  const creator = D.creator(video.creatorId);
  return (
    <div className="card interactive video-card" onClick={() => onClick && onClick(video)}>
      <Thumb label={tool.name} duration={video.duration} />
      <div className="flex gap-6 items-center mb-8" style={{flexWrap: "wrap"}}>
        <span className={`tag ${video.level}`}>{video.level}</span>
        <span className="tag">{tool.name}</span>
      </div>
      <h3>{video.title}</h3>
      <div className="meta-row mono">
        <span>{D.fmtViews(video.views)} views</span>
        <span>·</span>
        <span style={{display: "inline-flex", alignItems: "center", gap: 3}}><Icon.star size={11}/> {video.rating}</span>
        <span>·</span>
        <span>{video.completion}%</span>
      </div>
      <div className="creator-row">
        <div className="creator-avatar">{creator.initials}</div>
        <div style={{fontSize: 12.5}}>
          <span style={{fontWeight: 500}}>{creator.name}</span>
          {creator.verified && <Verified />}
          <div style={{color: "var(--fg-3)", fontSize: 11.5}}>{creator.role}</div>
        </div>
      </div>
    </div>
  );
}

// --- Toast system ---
function ToastStack({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.accent ? "toast-accent" : ""} ${t.out ? "out" : ""}`}>
          {t.icon}
          <div>{t.msg}</div>
          {t.pts && <span className="pts">+{t.pts} pts</span>}
        </div>
      ))}
    </div>
  );
}

// --- Top nav ---
function TopNav({ route, goto, points, pillFlash, onProfile, profile, gamification }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "browse", label: "Browse Tools" },
    { id: "learning", label: "My Learning" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "share", label: "Share Knowledge" },
  ];
  return (
    <div className="topnav">
      <div className="shell topnav-inner">
        <div className="brand" onClick={() => goto("home")}>
          <PVLogo size={26} />
          <span className="brand-name"><b>Prompt</b>University</span>
        </div>
        <div className="nav-links">
          {items.map(it => (
            <div key={it.id} className={`nav-link ${route === it.id ? "active" : ""}`} onClick={() => goto(it.id)}>
              {it.label}
            </div>
          ))}
        </div>
        <div className="nav-right">
          {gamification !== "subtle" && (
            <div className={`points-pill ${pillFlash ? "flash" : ""} ${gamification === "heavy" ? "heavy" : ""}`} title="Your points this week">
              <span className="dot" />
              <span className="tnum">{points}</span>
              <span style={{color: "var(--fg-3)", marginLeft: 2}}>pts</span>
            </div>
          )}
          <div className="avatar" onClick={onProfile} title={profile?.name || "Profile"}>
            {profile?.initials || "JR"}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Star rater ---
function StarRater({ value, onChange, size = 22 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars" onMouseLeave={() => setHover(0)}>
      {[1,2,3,4,5].map(i => {
        const on = (hover || value) >= i;
        return (
          <div key={i}
            className={`star ${on ? "on" : ""}`}
            onMouseEnter={() => setHover(i)}
            onClick={() => onChange(i)}
            style={{width: size, height: size}}>
            {on ? <Icon.star size={size}/> : <Icon.starO size={size}/>}
          </div>
        );
      })}
    </div>
  );
}


export { PVLogo, Verified, Icon, Thumb, VideoCard, ToastStack, TopNav, StarRater };
