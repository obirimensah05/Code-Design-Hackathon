'use client';
import React from 'react';

const { useState, useEffect, useRef, useCallback } = React;

const CORNER_KEY = 'pv_tweaks_corner';
const COLLAPSED_KEY = 'pv_tweaks_collapsed';
const CORNERS = ['tl', 'tr', 'bl', 'br'];
const DEFAULT_CORNER = 'br';
const MARGIN = 16;

function loadCorner() {
  if (typeof window === 'undefined') return DEFAULT_CORNER;
  try {
    const c = localStorage.getItem(CORNER_KEY);
    return CORNERS.includes(c) ? c : DEFAULT_CORNER;
  } catch { return DEFAULT_CORNER; }
}
function saveCorner(c) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(CORNER_KEY, c); } catch {}
}
function loadCollapsed() {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(COLLAPSED_KEY); } catch { return null; }
}
function saveCollapsed(v) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(COLLAPSED_KEY, v ? '1' : '0'); } catch {}
}

function cornerStyle(c) {
  const m = MARGIN + 'px';
  if (c === 'tl') return { top: m, left: m, right: 'auto', bottom: 'auto' };
  if (c === 'tr') return { top: m, right: m, left: 'auto', bottom: 'auto' };
  if (c === 'bl') return { bottom: m, left: m, top: 'auto', right: 'auto' };
  return { bottom: m, right: m, top: 'auto', left: 'auto' };
}

function nearestCorner(rectLeft, rectTop, w, h) {
  const cx = rectLeft + w / 2;
  const cy = rectTop + h / 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const left = cx < vw / 2;
  const top = cy < vh / 2;
  return (top ? 't' : 'b') + (left ? 'l' : 'r');
}

function Tweaks({ tweaks, setTweaks }) {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = loadCollapsed();
    if (stored !== null) return stored === '1';
    if (typeof window !== 'undefined' && window.innerWidth < 720) return true;
    return false;
  });

  // Anchored corner (persisted) + optional freehand drag coords during gesture
  const [corner, setCorner] = useState(loadCorner);
  const [dragPos, setDragPos] = useState(null); // {x, y} while actively dragging
  const [dragging, setDragging] = useState(false);
  const [didMove, setDidMove] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0, size: null });
  const elRef = useRef(null);

  useEffect(() => { saveCollapsed(collapsed); }, [collapsed]);
  useEffect(() => { saveCorner(corner); }, [corner]);

  const onPointerDown = useCallback((e) => {
    if (!elRef.current) return;
    const isControl = e.target.closest('button, input, .swatch, .tweaks-body');
    // On the collapsed bubble the whole thing IS a button, so we look at the
    // target's own classList instead.
    const isControlOnBubble = e.currentTarget.classList.contains('tweaks-bubble')
      ? false
      : isControl;
    if (isControlOnBubble) return;
    e.preventDefault();
    const rect = elRef.current.getBoundingClientRect();
    const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragStart.current = { x: cx, y: cy, px: rect.left, py: rect.top, size: { w: rect.width, h: rect.height } };
    setDidMove(false);
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const clampXY = (x, y) => {
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
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDidMove(true);
      if (ev.cancelable) ev.preventDefault();
      setDragPos(clampXY(dragStart.current.px + dx, dragStart.current.py + dy));
    };
    const onUp = () => {
      // Snap to nearest corner based on where the element is now
      if (elRef.current && dragPos) {
        const w = dragStart.current.size?.w || elRef.current.offsetWidth;
        const h = dragStart.current.size?.h || elRef.current.offsetHeight;
        setCorner(nearestCorner(dragPos.x, dragPos.y, w, h));
      }
      setDragPos(null);
      setDragging(false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('touchcancel', onUp);
    };
  }, [dragging, dragPos]);

  const set = (k, v) => setTweaks({ ...tweaks, [k]: v });

  const variants = [
    { id: 'editorial', label: 'Editorial' },
    { id: 'feed',      label: 'Feed' },
    { id: 'library',   label: 'Library' },
    { id: 'path',      label: 'Path' },
  ];
  const gamifLevels = [
    { id: 'subtle', label: 'Subtle' },
    { id: 'medium', label: 'Medium' },
    { id: 'heavy',  label: 'Heavy' },
  ];
  const roles = [
    { id: 'marketing', label: 'Marketing' },
    { id: 'dev',       label: 'Dev' },
    { id: 'design',    label: 'Design' },
    { id: 'legal',     label: 'Legal' },
    { id: 'hr',        label: 'HR' },
    { id: 'ops',       label: 'Ops' },
  ];

  // While dragging, follow the finger / cursor. Otherwise anchor to corner.
  const style = dragPos
    ? { left: dragPos.x + 'px', top: dragPos.y + 'px', right: 'auto', bottom: 'auto' }
    : cornerStyle(corner);

  const className = (base) => `${base} corner-${corner}${dragging ? ' is-dragging' : ''}`;

  if (collapsed) {
    return (
      <button
        ref={elRef}
        className={className('tweaks-bubble')}
        style={style}
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        onClick={() => { if (!didMove) setCollapsed(false); }}
        aria-label="Open tweaks panel"
        title="Drag to any corner · click to open"
      >
        <span className="tweaks-bubble-dot" aria-hidden />
        <span className="tweaks-bubble-label">Tweaks</span>
      </button>
    );
  }

  return (
    <div
      ref={elRef}
      className={className('tweaks-panel')}
      style={style}
      role="region"
      aria-label="Design tweaks"
    >
      <div
        className="tweaks-head"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        title="Drag to any corner"
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
              <button key={v.id} className={tweaks.homeVariant === v.id ? 'on' : ''} onClick={() => set('homeVariant', v.id)}>{v.label}</button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Gamification intensity</label>
          <div className="seg">
            {gamifLevels.map(g => (
              <button key={g.id} className={tweaks.gamification === g.id ? 'on' : ''} onClick={() => set('gamification', g.id)}>{g.label}</button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Role lens</label>
          <div className="seg seg-grid">
            {roles.map(r => (
              <button key={r.id} className={tweaks.roleLens === r.id ? 'on' : ''} onClick={() => set('roleLens', r.id)}>{r.label}</button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>Theme</label>
          <div className="seg">
            {['light', 'dark'].map(t => (
              <button key={t} className={tweaks.theme === t ? 'on' : ''} onClick={() => set('theme', t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Tweaks };
