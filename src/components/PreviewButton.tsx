import { useRef } from 'react';
import type { ReactNode } from 'react';

// Canvas gestures can suppress the next compatibility click on touch devices.
// Activate a completed touch tap once; retain native mouse and keyboard clicks.
export default function PreviewButton({
  label,
  className = 'icon-button',
  disabled = false,
  onActivate,
  children,
}: {
  label: string;
  className?: string;
  disabled?: boolean;
  onActivate: () => void;
  children: ReactNode;
}) {
  const touch = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  return (
    <button
      className={className}
      aria-label={label}
      disabled={disabled}
      onPointerDown={(event) => {
        suppressClick.current = false;
        touch.current =
          event.pointerType === 'touch'
            ? { id: event.pointerId, x: event.clientX, y: event.clientY }
            : null;
      }}
      onPointerUp={(event) => {
        const start = touch.current;
        touch.current = null;
        if (!start || start.id !== event.pointerId) return;
        suppressClick.current = true;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          !disabled &&
          Math.hypot(event.clientX - start.x, event.clientY - start.y) < 10 &&
          event.clientX >= bounds.left &&
          event.clientX <= bounds.right &&
          event.clientY >= bounds.top &&
          event.clientY <= bounds.bottom
        )
          onActivate();
      }}
      onPointerCancel={() => {
        touch.current = null;
      }}
      onClick={(event) => {
        if (event.detail !== 0 && suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        onActivate();
      }}
    >
      {children}
    </button>
  );
}
