'use client';
import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Icon } from './atoms';

const { useState, useEffect, useRef, createContext, useContext } = React;

/* ========================================================================
   Badge — 3 variants × 8 colors × 2 sizes
   Adapted from /engine/src/components/ui/badge.tsx
   ======================================================================== */
function Badge({ variant = 'soft', color = 'default', size = 'md', className = '', children, ...rest }) {
  const classes = [
    'pv-badge',
    `pv-badge--${variant}`,
    `pv-badge--${color}`,
    `pv-badge--${size}`,
    className,
  ].filter(Boolean).join(' ');
  return <span className={classes} {...rest}>{children}</span>;
}

/* ========================================================================
   Card — composable: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
   ======================================================================== */
function Card({ interactive = false, className = '', children, ...rest }) {
  return (
    <div
      className={`pv-card ${interactive ? 'pv-card--interactive' : ''} ${className}`}
      data-interactive={interactive || undefined}
      {...rest}
    >{children}</div>
  );
}
function CardHeader({ className = '', children, ...rest }) {
  return <div className={`pv-card-header ${className}`} {...rest}>{children}</div>;
}
function CardTitle({ className = '', children, ...rest }) {
  return <h3 className={`pv-card-title ${className}`} {...rest}>{children}</h3>;
}
function CardDescription({ className = '', children, ...rest }) {
  return <p className={`pv-card-desc ${className}`} {...rest}>{children}</p>;
}
function CardContent({ className = '', children, ...rest }) {
  return <div className={`pv-card-content ${className}`} {...rest}>{children}</div>;
}
function CardFooter({ className = '', children, ...rest }) {
  return <div className={`pv-card-footer ${className}`} {...rest}>{children}</div>;
}

/* ========================================================================
   EmptyState — icon + title + description + optional action
   ======================================================================== */
function EmptyState({ icon, title, description, action, className = '', ...rest }) {
  return (
    <div className={`pv-empty ${className}`} {...rest}>
      {icon && <div className="pv-empty__icon" aria-hidden>{icon}</div>}
      <h3 className="pv-empty__title">{title}</h3>
      {description && <p className="pv-empty__desc">{description}</p>}
      {action && <div className="pv-empty__action">{action}</div>}
    </div>
  );
}

/* ========================================================================
   FormField — label + required indicator + error / helper text
   ======================================================================== */
function FormField({ label, required = false, error, helper, htmlFor, className = '', children, ...rest }) {
  return (
    <div className={`pv-field ${className}`} {...rest}>
      {label && (
        <label className="pv-field__label" htmlFor={htmlFor}>
          {label}
          {required && <span className="pv-field__required" aria-hidden> *</span>}
        </label>
      )}
      {children}
      {error && <p id={htmlFor ? `${htmlFor}-error` : undefined} className="pv-field__error" role="alert">{error}</p>}
      {!error && helper && <p id={htmlFor ? `${htmlFor}-helper` : undefined} className="pv-field__helper">{helper}</p>}
    </div>
  );
}

/* ========================================================================
   Input — label/helper/error handled by FormField; this just the input
   Supports left/right icons, sizes (sm/md/lg), error state
   ======================================================================== */
function Input({ inputSize = 'md', error = false, leftIcon, rightIcon, className = '', ...rest }) {
  const inputEl = (
    <input
      className={`pv-input pv-input--${inputSize} ${error ? 'pv-input--error' : ''} ${leftIcon ? 'pv-input--has-left' : ''} ${rightIcon ? 'pv-input--has-right' : ''} ${className}`}
      aria-invalid={error || undefined}
      {...rest}
    />
  );
  if (!leftIcon && !rightIcon) return inputEl;
  return (
    <div className="pv-input-wrap">
      {leftIcon && <span className="pv-input-icon pv-input-icon--left" aria-hidden>{leftIcon}</span>}
      {inputEl}
      {rightIcon && <span className="pv-input-icon pv-input-icon--right" aria-hidden>{rightIcon}</span>}
    </div>
  );
}

/* ========================================================================
   Stepper — horizontal / vertical, with contexts
   ======================================================================== */
const StepperContext = createContext({ orientation: 'horizontal' });
const StepperItemContext = createContext({ status: 'pending', step: undefined });

function Stepper({ orientation = 'horizontal', className = '', children, ...rest }) {
  return (
    <StepperContext.Provider value={{ orientation }}>
      <ol className={`pv-stepper pv-stepper--${orientation} ${className}`} data-orientation={orientation} {...rest}>
        {children}
      </ol>
    </StepperContext.Provider>
  );
}
function StepperItem({ status = 'pending', step, className = '', children, ...rest }) {
  const { orientation } = useContext(StepperContext);
  return (
    <StepperItemContext.Provider value={{ status, step }}>
      <li
        className={`pv-stepper__item pv-stepper__item--${orientation} ${className}`}
        aria-current={status === 'current' ? 'step' : undefined}
        data-status={status}
        {...rest}
      >{children}</li>
    </StepperItemContext.Provider>
  );
}
function StepperIndicator({ className = '', children, ...rest }) {
  const { status, step } = useContext(StepperItemContext);
  const content =
    children ?? (status === 'completed'
      ? <Icon.check size={14} />
      : step !== undefined ? step : null);
  return (
    <div
      className={`pv-stepper__indicator pv-stepper__indicator--${status} ${className}`}
      aria-hidden={children ? undefined : true}
      {...rest}
    >{content}</div>
  );
}
function StepperLabel({ className = '', children, ...rest }) {
  const { status } = useContext(StepperItemContext);
  return <span className={`pv-stepper__label pv-stepper__label--${status} ${className}`} {...rest}>{children}</span>;
}
function StepperDescription({ className = '', children, ...rest }) {
  return <span className={`pv-stepper__desc ${className}`} {...rest}>{children}</span>;
}
function StepperSeparator({ className = '', ...rest }) {
  const { orientation } = useContext(StepperContext);
  const { status } = useContext(StepperItemContext);
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-status={status}
      className={`pv-stepper__sep pv-stepper__sep--${orientation} pv-stepper__sep--${status} ${className}`}
      {...rest}
    />
  );
}

/* ========================================================================
   Tabs — Radix-based. Exports Tabs, TabsList, TabsTrigger, TabsContent
   ======================================================================== */
function Tabs({ className = '', children, ...rest }) {
  return <TabsPrimitive.Root className={`pv-tabs ${className}`} {...rest}>{children}</TabsPrimitive.Root>;
}
function TabsList({ className = '', children, ...rest }) {
  return <TabsPrimitive.List className={`pv-tabs__list ${className}`} {...rest}>{children}</TabsPrimitive.List>;
}
function TabsTrigger({ className = '', children, ...rest }) {
  return <TabsPrimitive.Trigger className={`pv-tabs__trigger ${className}`} {...rest}>{children}</TabsPrimitive.Trigger>;
}
function TabsContent({ className = '', children, ...rest }) {
  return <TabsPrimitive.Content className={`pv-tabs__content ${className}`} {...rest}>{children}</TabsPrimitive.Content>;
}

/* ========================================================================
   ActivityTimeline — vertical timeline with severity-colored dots
   Takes: items = [{id, type: 'info'|'neutral'|'warn'|'error', title, timestamp, tags?, meta?}]
   ======================================================================== */
function ActivityTimeline({ items = [] }) {
  if (!items.length) {
    return (
      <EmptyState
        icon={<Icon.clock size={22} />}
        title="No activity yet"
        description="Start watching a video or sharing a prompt — your learning history will show up here."
      />
    );
  }
  return (
    <ol className="pv-timeline">
      {items.map(ev => {
        const type = ev.type || 'neutral';
        return (
          <li key={ev.id} className={`pv-timeline__item pv-timeline__item--${type}`}>
            <div className="pv-timeline__rail" aria-hidden>
              <span className="pv-timeline__dot" />
              <span className="pv-timeline__line" />
            </div>
            <div className="pv-timeline__body">
              <div className="pv-timeline__head">
                <span className="pv-timeline__title">{ev.title}</span>
                {ev.timestamp && <time className="pv-timeline__time mono">{ev.timestamp}</time>}
              </div>
              {ev.meta && <div className="pv-timeline__meta">{ev.meta}</div>}
              {ev.tags && ev.tags.length > 0 && (
                <div className="pv-timeline__tags">
                  {ev.tags.map((t, i) => (
                    <Badge key={i} variant="soft" color={t.color || 'default'} size="sm">{t.label}</Badge>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ========================================================================
   AvatarUploader — crop modal, base64 output via onSave(dataUrl)
   Adapted from /engine/src/components/ui/avatar-uploader.tsx
   ======================================================================== */
const CROP_SIZE = 280;
const OUTPUT_SIZE = 512;

function AvatarUploader({ currentUrl, initials, onSave }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, offX: 0, offY: 0 });
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function onFilePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Images only'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Max 5 MB'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setImgUrl(reader.result);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setModalOpen(true);
      setError(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function onImageLoad() {
    if (!imgRef.current) return;
    const { naturalWidth: iw, naturalHeight: ih } = imgRef.current;
    const scale = CROP_SIZE / Math.min(iw, ih);
    setZoom(scale);
    setOffset({ x: 0, y: 0 });
  }

  function onMouseDown(e) {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, offX: offset.x, offY: offset.y };
  }

  useEffect(() => {
    if (!dragging) return;
    function onMove(ev) {
      setOffset({
        x: dragStart.current.offX + (ev.clientX - dragStart.current.x),
        y: dragStart.current.offY + (ev.clientY - dragStart.current.y),
      });
    }
    function onUp() { setDragging(false); }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  function saveCrop() {
    if (!imgRef.current) return;
    setSaving(true);
    setError(null);
    try {
      const img = imgRef.current;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const displayW = iw * zoom;
      const displayH = ih * zoom;
      const imgLeft = (CROP_SIZE - displayW) / 2 + offset.x;
      const imgTop = (CROP_SIZE - displayH) / 2 + offset.y;
      const sx = (-imgLeft) / zoom;
      const sy = (-imgTop) / zoom;
      const sSize = CROP_SIZE / zoom;
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onSave(dataUrl);
      setModalOpen(false);
      setImgUrl(null);
    } catch (e) {
      setError('Could not save crop');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="pv-avatar-uploader">
        <div className="pv-avatar-uploader__preview">
          {currentUrl
            ? <img src={currentUrl} alt="" />
            : <span>{initials || '??'}</span>
          }
        </div>
        <div className="pv-avatar-uploader__actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => fileInputRef.current?.click()}>
            {currentUrl ? 'Change photo' : 'Upload photo'}
          </button>
          {currentUrl && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSave(null)}>
              Remove
            </button>
          )}
          <p className="pv-avatar-uploader__hint">JPG, PNG, WebP — max 5 MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: 'none' }}
          onChange={onFilePick}
        />
      </div>

      {modalOpen && imgUrl && (
        <div className="pv-modal" role="dialog" aria-modal="true" aria-label="Crop photo">
          <div className="pv-modal__backdrop" onClick={() => !saving && setModalOpen(false)} />
          <div className="pv-modal__panel">
            <div className="pv-modal__head">
              <h3>Crop your photo</h3>
              <button onClick={() => !saving && setModalOpen(false)} className="pv-modal__close" aria-label="Close">✕</button>
            </div>
            <div className="pv-modal__body">
              <div className="pv-crop" style={{ width: CROP_SIZE, height: CROP_SIZE }}>
                <div
                  className="pv-crop__viewport"
                  onMouseDown={onMouseDown}
                  role="application"
                  aria-label="Drag to reposition your photo"
                >
                  <img
                    ref={imgRef}
                    src={imgUrl}
                    alt=""
                    draggable={false}
                    onLoad={onImageLoad}
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                      transformOrigin: 'center',
                      left: '50%',
                      top: '50%',
                      marginLeft: imgRef.current ? -imgRef.current.naturalWidth / 2 : 0,
                      marginTop: imgRef.current ? -imgRef.current.naturalHeight / 2 : 0,
                    }}
                  />
                </div>
                <div className="pv-crop__ring" aria-hidden />
              </div>
              <div className="pv-crop__zoom">
                <span className="eyebrow">Zoom</span>
                <input
                  type="range"
                  min={0.1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                />
              </div>
              {error && <p className="pv-crop__error">{error}</p>}
            </div>
            <div className="pv-modal__foot">
              <button onClick={() => !saving && setModalOpen(false)} disabled={saving} className="btn btn-ghost">Cancel</button>
              <button onClick={saveCrop} disabled={saving} className="btn btn-primary">
                {saving ? 'Saving…' : 'Save photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export {
  Badge,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  EmptyState,
  FormField, Input,
  Stepper, StepperItem, StepperIndicator, StepperLabel, StepperDescription, StepperSeparator,
  Tabs, TabsList, TabsTrigger, TabsContent,
  ActivityTimeline,
  AvatarUploader,
};
