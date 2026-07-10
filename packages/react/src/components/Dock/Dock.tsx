import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { trackDock, type DockProps } from '@jolt/core';
import '@jolt/core/styles/dock.css';

/** A row of items that magnify toward the cursor, like the macOS dock. */
export function Dock({
  items = ['Home', 'Search', 'Files', 'Mail', 'Trash'],
  size = 44,
  magnification = 1.8,
  range = 140,
  color = '#7c5cff',
}: DockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = trackDock(el, { range, maxScale: magnification });
    return () => controller.revert();
  }, [items, magnification, range]);

  const vars = { '--jolt-size': `${size}px`, '--jolt-color': color } as CSSProperties;

  return (
    <div ref={ref} className="jolt-dock" style={vars} role="list">
      {items.map((label, i) => (
        <span key={i} data-jolt-dock-item role="listitem" aria-label={label} title={label}>
          {label.slice(0, 1)}
        </span>
      ))}
    </div>
  );
}
