'use client';
import React from 'react';
import { PV_DATA } from './data';
import { PVLogo, Icon } from './atoms';

const { useState: useStateO } = React;

function Onboarding({ onDone }) {
  const D = PV_DATA;
  const [step, setStep] = useStateO(0);
  const [data, setData] = useStateO({
    name: "Jordan Reed",
    email: "jordan@example.com",
    newToAi: false,
    usedTools: ["chatgpt", "midjourney"],
    field: "marketing",
    role: "Marketing Manager",
    goals: ["Save time on daily tasks", "Build skills for my career"],
  });
  const total = 5;
  const next = () => step < total - 1 ? setStep(step + 1) : finish();
  const back = () => setStep(Math.max(0, step - 1));
  const finish = () => {
    const initials = data.name.split(/\s+/).map(s => s[0]).slice(0, 2).join("").toUpperCase() || "JR";
    onDone({ ...data, initials });
  };

  const steps = [
    {
      title: "Welcome.",
      sub: "Let's set up your vault. Two minutes.",
      body: (
        <div className="row-gap-24">
          <div className="row-gap-12">
            <label className="eyebrow">Your name</label>
            <input className="input" value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Full name" />
          </div>
          <div className="row-gap-12">
            <label className="eyebrow">Email</label>
            <input className="input" value={data.email} onChange={e => setData({...data, email: e.target.value})} placeholder="you@work.com" />
          </div>
        </div>
      )
    },
    {
      title: "What's your AI experience?",
      sub: "We'll calibrate recommendations.",
      body: (
        <div className="row-gap-24">
          <div className="field-grid">
            {[{v:false, l:"I've used AI tools before"}, {v:true, l:"I'm new to AI"}].map(o => (
              <div key={o.l} className={`opt ${data.newToAi === o.v ? "sel" : ""}`} onClick={() => setData({...data, newToAi: o.v})}>
                <div className="check">{data.newToAi === o.v && <Icon.check size={11}/>}</div>
                {o.l}
              </div>
            ))}
          </div>
          <div className="row-gap-12">
            <label className="eyebrow">Tools you've used</label>
            <div className="tools-grid-pick">
              {D.TOOLS.slice(0, 18).map(t => {
                const sel = data.usedTools.includes(t.id);
                return (
                  <div key={t.id} className={`opt ${sel ? "sel" : ""}`} onClick={() => {
                    setData({...data, usedTools: sel ? data.usedTools.filter(x => x !== t.id) : [...data.usedTools, t.id]});
                  }}>
                    <b>{t.name}</b>
                    <small style={{color: "var(--fg-3)"}}>{t.cat}</small>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "What field are you in?",
      sub: "We'll tailor your homepage and recommendations.",
      body: (
        <div className="field-grid" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
          {D.FIELDS.map(f => (
            <div key={f.id} className={`opt ${data.field === f.id ? "sel" : ""}`} onClick={() => setData({...data, field: f.id})}>
              <span style={{fontFamily: "var(--mono)", fontSize: 13, opacity: 0.6, width: 14}}>{f.icon}</span>
              {f.name}
            </div>
          ))}
        </div>
      )
    },
    {
      title: "What's your role?",
      sub: "Helps us match you with the right peers.",
      body: (
        <div className="row-gap-12">
          <label className="eyebrow">Role / Title</label>
          <input className="input" value={data.role} onChange={e => setData({...data, role: e.target.value})} placeholder="e.g. Marketing Manager, Full-stack Developer" />
          <div className="dim mt-8" style={{fontSize: 12.5}}>This appears on your profile and the leaderboard.</div>
        </div>
      )
    },
    {
      title: "What are your goals?",
      sub: "Pick everything that fits.",
      body: (
        <div className="field-grid">
          {D.GOALS.map(g => {
            const sel = data.goals.includes(g);
            return (
              <div key={g} className={`opt ${sel ? "sel" : ""}`} onClick={() => {
                setData({...data, goals: sel ? data.goals.filter(x => x !== g) : [...data.goals, g]});
              }}>
                <div className="check">{sel && <Icon.check size={11}/>}</div>
                {g}
              </div>
            );
          })}
        </div>
      )
    },
  ];

  const cur = steps[step];

  return (
    <div className="onboard">
      <div className="onboard-side">
        <div className="brand">
          <PVLogo size={32} />
          <span className="brand-name" style={{fontSize: 18}}><b>Prompt</b>Vault</span>
        </div>
        <div style={{position: "relative", zIndex: 1}}>
          <div className="eyebrow mb-16">Your vault, in 5 questions</div>
          <h1 className="h-display" style={{fontSize: 44, marginBottom: 16}}>
            Master AI tools. <em style={{color: "var(--accent-deep)", fontStyle: "normal"}}>Your way.</em>
          </h1>
          <p className="muted" style={{fontSize: 15, maxWidth: 360, lineHeight: 1.55}}>
            We'll match you with the exact tools, skill levels, and people you need for your role.
          </p>
        </div>
        <div className="row-gap-12" style={{position: "relative", zIndex: 1}}>
          <div className="eyebrow">Trusted by 8,420 learners</div>
          <div className="flex gap-8">
            {["SC", "MW", "PI", "TB", "NP"].map((i, idx) => (
              <div key={idx} className="creator-avatar" style={{width: 28, height: 28, marginLeft: idx ? -8 : 0}}>{i}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="onboard-form">
        <div className="step-bar">
          {Array.from({length: total}).map((_, i) => (
            <span key={i} className={i < step ? "done" : i === step ? "active" : ""} />
          ))}
        </div>
        <div className="row-gap-12">
          <div className="eyebrow">Step {step + 1} of {total}</div>
          <h1 className="h-1" style={{fontSize: 36}}>{cur.title}</h1>
          <p className="muted" style={{fontSize: 15, margin: 0}}>{cur.sub}</p>
        </div>
        <div className="route" key={step}>{cur.body}</div>
        <div className="flex gap-12" style={{marginTop: "auto"}}>
          {step > 0 && <button className="btn btn-ghost" onClick={back}>← Back</button>}
          <div style={{flex: 1}} />
          <button className="btn btn-primary btn-lg" onClick={next}>
            {step === total - 1 ? "Enter the vault" : "Continue"} <Icon.arrow size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}


export { Onboarding };
