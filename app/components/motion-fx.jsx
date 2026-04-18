'use client';
import React from 'react';
import { animate, inView, scroll } from 'motion';

const { useEffect, useRef } = React;

const EASE = [0.2, 0.65, 0.35, 1];
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Reveal({ children, delay = 0, y = 24, duration = 0.7, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }
    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px)`;
    el.style.willChange = 'opacity, transform';
    const stop = inView(el, () => {
      animate(
        el,
        { opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0px)'] },
        { duration, delay, easing: EASE }
      );
    });
    return () => { if (stop) stop(); };
  }, [delay, y, duration]);
  return (
    <Tag ref={ref} className={`mfx-reveal ${className}`} {...rest}>{children}</Tag>
  );
}

function Stagger({ children, stagger = 0.06, y = 20, duration = 0.55, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.children);
    if (!items.length) return;
    if (prefersReduced()) {
      items.forEach(it => { it.style.opacity = '1'; it.style.transform = 'none'; });
      return;
    }
    items.forEach(it => {
      it.style.opacity = '0';
      it.style.transform = `translateY(${y}px)`;
      it.style.willChange = 'opacity, transform';
    });
    const stop = inView(el, () => {
      animate(
        items,
        { opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0px)'] },
        { duration, delay: (i) => i * stagger, easing: EASE }
      );
    });
    return () => { if (stop) stop(); };
  }, [stagger, y, duration]);
  return (
    <Tag ref={ref} className={`mfx-stagger ${className}`} {...rest}>{children}</Tag>
  );
}

function CountUp({ value, duration = 1.2, format, prefix = '', suffix = '', className = '', ...rest }) {
  const ref = useRef(null);
  const fmt = format || ((v) => Math.round(v).toLocaleString());
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) { el.textContent = `${prefix}${fmt(value)}${suffix}`; return; }
    el.textContent = `${prefix}${fmt(0)}${suffix}`;
    let controls;
    const stop = inView(el, () => {
      controls = animate(0, value, {
        duration,
        easing: [0.22, 0.61, 0.36, 1],
        onUpdate: (v) => { if (el) el.textContent = `${prefix}${fmt(v)}${suffix}`; },
      });
    });
    return () => { if (controls) controls.stop(); if (stop) stop(); };
  }, [value, duration, prefix, suffix]);
  return <span ref={ref} className={className} {...rest}>{prefix}{fmt(value)}{suffix}</span>;
}

function Ring({ value = 0, total = 1, size = 120, stroke = 8, duration = 1.4, trackColor = 'var(--bg-sunk)', fillColor = 'var(--accent-deep)', children }) {
  const ref = useRef(null);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const target = c * (1 - Math.min(1, value / total));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) { el.style.strokeDashoffset = String(target); return; }
    el.style.strokeDasharray = String(c);
    el.style.strokeDashoffset = String(c);
    const stop = inView(el, () => {
      animate(el, { strokeDashoffset: [c, target] }, { duration, easing: [0.22, 0.61, 0.36, 1] });
    });
    return () => { if (stop) stop(); };
  }, [target, c, duration]);
  return (
    <div className="mfx-ring" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={fillColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ value = 0, duration = 0.9, delay = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pct = Math.max(0, Math.min(100, value));
    if (prefersReduced()) { el.style.width = `${pct}%`; return; }
    el.style.width = '0%';
    const stop = inView(el, () => {
      animate(el, { width: ['0%', `${pct}%`] }, { duration, delay, easing: EASE });
    });
    return () => { if (stop) stop(); };
  }, [value, duration, delay]);
  return <span ref={ref} className={className} style={{ display: 'block', height: '100%' }} />;
}

function ScrollBar() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) { el.style.transform = 'scaleX(1)'; return; }
    const stop = scroll((progress) => {
      if (el) el.style.transform = `scaleX(${progress})`;
    });
    return () => { if (stop) stop(); };
  }, []);
  return <div ref={ref} className="mfx-scrollbar" aria-hidden />;
}

function HoverLift({ children, lift = -3, scale = 1.005, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) return;
    const onEnter = () => animate(el, { transform: `translateY(${lift}px) scale(${scale})` }, { duration: 0.28, easing: EASE });
    const onLeave = () => animate(el, { transform: 'translateY(0px) scale(1)' }, { duration: 0.32, easing: EASE });
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [lift, scale]);
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}

export { Reveal, Stagger, CountUp, Ring, ProgressBar, ScrollBar, HoverLift };
