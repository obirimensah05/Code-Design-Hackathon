/* global React, window */
const { useState: useStateW, useEffect: useEffectW } = React;

function Tweaks({ tweaks, setTweaks, onClose }) {
  const set = (k, v) => setTweaks({ ...tweaks, [k]: v });

  const swatches = [
    { hue: 145, label: "Neon green" },
    { hue: 200, label: "Cyan" },
    { hue: 280, label: "Purple" },
    { hue: 30,  label: "Amber" },
    { hue: 0,   label: "Coral" },
  ];

  const variants = [
    { id: "editorial", label: "Editorial" },
    { id: "feed",      label: "Feed"      },
    { id: "library",   label: "Library"   },
    { id: "path",      label: "Path"      },
  ];

  const gamifLevels = [
    { id: "subtle", label: "Subtle" },
    { id: "medium", label: "Medium" },
    { id: "heavy",  label: "Heavy"  },
  ];

  const roles = [
    { id: "marketing", label: "Marketing" },
    { id: "dev",       label: "Dev"       },
    { id: "design",    label: "Design"    },
    { id: "legal",     label: "Legal"     },
    { id: "hr",        label: "HR"        },
    { id: "ops",       label: "Ops"       },
  ];

  return (
    <div className="tweaks-panel">
      <div className="tweaks-head">
        <b>Tweaks</b>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
      </div>
      <div className="tweaks-body">
        <div className="row">
          <label>Home variant</label>
          <div className="seg seg-grid">
            {variants.map(v => (
              <button key={v.id} className={tweaks.homeVariant === v.id ? "on" : ""} onClick={() => set("homeVariant", v.id)}>{v.label}</button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Gamification intensity</label>
          <div className="seg">
            {gamifLevels.map(g => (
              <button key={g.id} className={tweaks.gamification === g.id ? "on" : ""} onClick={() => set("gamification", g.id)}>{g.label}</button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Role lens</label>
          <div className="seg seg-grid">
            {roles.map(r => (
              <button key={r.id} className={tweaks.roleLens === r.id ? "on" : ""} onClick={() => set("roleLens", r.id)}>{r.label}</button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Theme</label>
          <div className="seg">
            {["light", "dark"].map(t => (
              <button key={t} className={tweaks.theme === t ? "on" : ""} onClick={() => set("theme", t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Accent color</label>
          <div className="swatch-row">
            {swatches.map(s => (
              <div key={s.hue} className={`swatch ${tweaks.accentHue === s.hue ? "sel" : ""}`}
                style={{background: `oklch(0.86 0.22 ${s.hue})`}}
                title={s.label}
                onClick={() => set("accentHue", s.hue)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.Tweaks = Tweaks;
