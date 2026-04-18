'use client';
import React from 'react';

const { useState, useEffect, useRef, useCallback } = React;

const POS_KEY = 'pv_tweaks_pos';
const COLLAPSED_KEY = 'pv_tweaks_collapsed';

function loadPos() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(POS_KEY) || 'null'); } catch { return null; }
}
function savePos(pos) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch {}
}
function loadCollapsed() {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(COLLAPSED_KEY); } catch { return null; }
}
function saveCollapsed(v) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(COLLAPSED_KEY, v ? '1' : '0'); } catch {}
}

function Tweaks({ tweaks, setTweaks }) {
  // Default collapsed on mobile, expanded on desktop. Persist user choice.
  const [collapsed, setCollapsed] = useState(() => {
    const stored = loadCollapsed();
    if (stored !== null) return stored === '1';
    if (typeof window !== 'undefined' && window.innerWidth < 720) return true;
    return false;
  });

  // Position: null = anchored bottom-right. Once the user drags, a fixed
  // x/y pair overrides the anchor.
  const [pos, setPos] = useState(loadPos);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0, size: null });
  const elRef = useRef(null);

  useEffect(() => { saveCollapsed(collapsed); }, [collapsed]);
  useEffect(() => { if (pos) savePos(pos); }, [pos]);

  // Clamp position inside viewport on resize so the panel doesn't disappear.
  useEffect(() => {
    const clamp = () => {
      if (!pos || !elRef.current) return;
      const w = elRef.current.offsetWidth;
      const h = elRef.current.offsetHeight;
      const maxX = Math.max(8, window.innerWidth - w - 8);
      const maxY = Math.max(8, window.innerHeight - h - 8);
      setPos(p => {
        if (!p) return p;
        const x = Math.min(Math.max(8, p.x), maxX);
        const y = Math.min(Math.max(8, p.y), maxY);
        return x !== p.x || y !== p.y ? { x, y } : p;
      });
    };
    clamp();
    window.addEventListener('resize', clamp);
    return () => window.removeEventListener('resize', clamp);
  }, [pos, collapsed]);

  const onPointerDown = useCallback((e) => {
    if (!elRef.current) return;
    // Ignore drags originating from buttons / inputs / swatches.
    const tag = e.target.tagName;
    const isControl = tag === 'BUTTON' || tag === 'INPUT' || e.target.closest('button, input, .swatch');
    if (isControl) return;
    e.preventDefault();
    const rect = elRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragStart.current = {
      x: clientX,
      y: clientY,
      px: rect.left,
      py: rect.top,
      size: { w: rect.width, h: rect.height },
    };
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const clampNext = (x, y) => {
      const w = dragStart.current.size?.w || 0;
      const h = dragStart.current.size?.h || 0;
      const maxX = Math.max(8, window.innerWidth - w - 8);
      const maxY = Math.max(8, window.innerHeight - h - 8);
      return { x: Math.min(Math.max(8, x), maxX), y: Math.min(Math.max(8, y), maxY) };
    };
    const onMove = (ev) => {
      const cx = ev.clientX ?? ev.touches?.[0]?.clientX ?? 0;
      const cy = ev.clientY ?? ev.touches?.[0]?.clientY ?? 0;
      const dx = cx - dragStart.current.x;
      const dy = cy - dragStart.current.y;
      const next = clampNext(dragStart.current.px + dx, dragStart.current.py + dy);
      setPos(next);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging]);

  const set = (k, v) => setTweaks({ ...tweaks, [k]: v });

  const swatches = [
    { hue: 145, label: 'Neon green' },
    { hue: 200, label: 'Cyan' },
    { hue: 280, label: 'Purple' },
    { hue: 30, label: 'Amber' },
    { hue: 0, label: 'Coral' },
  ];

  const variants = [
    { id: 'editorial', label: 'Editorial' },
    { id: 'feed', label: 'Feed' },
    { id: 'library', label: 'Library' },
    { id: 'path', label: 'Path' },
  ];

  const gamifLevels = [
    { id: 'subtle', label: 'Subtle' },
    { id: 'medium', label: 'Medium' },
    { id: 'heavy', label: 'Heavy' },
  ];

  const roles = [
    { id: 'marketing', label: 'Marketing' },
    { id: 'dev', label: 'Dev' },
    { id: 'design', label: 'Design' },
    { id: 'legal', label: 'Legal' },
    { id: 'hr', label: 'HR' },
    { id: 'ops', label: 'Ops' },
  ];

  const positionStyle = pos
    ? { left: pos.x + 'px', top: pos.y + 'px', right: 'auto', bottom: 'auto' }
    : undefined;

  if (collapsed) {
    return (
      <button
        ref={elRef}
        className={`tweaks-bubble ${dragging ? 'is-dragging' : ''}`}
        style={positionStyle}
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        onClick={(e) => {
          if (dragging) return;
          // Only expand on clean clicks (no drag happened).
          setCollapsed(false);
        }}
        aria-label="Open tweaks panel"
        title="Drag to move · click to open"
      >
        <span className="tweaks-bubble-dot" aria-hidden />
        <span className="tweaks-bubble-label">Tweaks</span>
      </button>
    );
  }

  return (
    <div
      ref={elRef}
      className={`tweaks-panel ${dragging ? 'is-dragging' : ''}`}
      style={positionStyle}
      role="region"
      aria-label="Design tweaks"
    >
      <div
        className="tweaks-head"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        title="Drag to move"
      >
        <b>Tweaks</b>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse tweaks panel"
          title="Collapse"
        >
          ✕
        </button>
      </div>
      <div className="tweaks-body">
        <div className="row">
          <label>Home variant</label>
          <div className="seg seg-grid">
            {variants.map(v => (
              <button key={v.id} className={tweaks.homeVariant === v.id ? 'on' : ''} onClick={() => set('homeVariant', v.id)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Gamification intensity</label>
          <div className="seg">
            {gamifLevels.map(g => (
              <button key={g.id} className={tweaks.gamification === g.id ? 'on' : ''} onClick={() => set('gamification', g.id)}>
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Role lens</label>
          <div className="seg seg-grid">
            {roles.map(r => (
              <button key={r.id} className={tweaks.roleLens === r.id ? 'on' : ''} onClick={() => set('roleLens', r.id)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Theme</label>
          <div className="seg">
            {['light', 'dark'].map(t => (
              <button key={t} className={tweaks.theme === t ? 'on' : ''} onClick={() => set('theme', t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Accent color</label>
          <div className="swatch-row">
            {swatches.map(s => (
              <div
                key={s.hue}
                className={`swatch ${tweaks.accentHue === s.hue ? 'sel' : ''}`}
                style={{ background: `oklch(0.86 0.22 ${s.hue})` }}
                title={s.label}
                onClick={() => set('accentHue', s.hue)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Tweaks };
