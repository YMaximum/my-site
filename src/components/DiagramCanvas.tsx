import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, Maximize, Pause, Play } from 'lucide-react';
import type { ProjectId } from '../data/portfolio';
import SystemDiagram from './SystemDiagram';
import PreviewButton from './PreviewButton';

type View = { scale: number; x: number; y: number };
type Point = { x: number; y: number };
const width = 820;
const height = 500;
const minimumScale = 0.2;
const maximumScale = 3;

export default function DiagramCanvas({
  project,
  motionEnabled,
}: {
  project: ProjectId;
  motionEnabled: boolean;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const currentView = useRef<View>({ scale: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, Point>());
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);

  function update(next: View) {
    currentView.current = next;
    setView(next);
  }

  function fit() {
    const element = viewport.current;
    if (!element) return;
    update({
      scale: Math.max(
        minimumScale,
        Math.min(
          1,
          (element.clientWidth - 32) / width,
          (element.clientHeight - 32) / height,
        ),
      ),
      x: 0,
      y: 0,
    });
  }

  function zoom(factor: number, point: Point = { x: 0, y: 0 }) {
    const previous = currentView.current;
    const scale = Math.max(
      minimumScale,
      Math.min(maximumScale, previous.scale * factor),
    );
    const ratio = scale / previous.scale;
    update({
      scale,
      x: point.x - (point.x - previous.x) * ratio,
      y: point.y - (point.y - previous.y) * ratio,
    });
  }

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    // Portrait phones start at a readable zoom; Fit still shows the full graph.
    const observer = new ResizeObserver(() => {
      const scale = Math.max(
        minimumScale,
        Math.min(
          1,
          (element.clientWidth - 32) / width,
          (element.clientHeight - 32) / height,
        ),
      );
      const initialScale =
        element.clientWidth < 640 && element.clientHeight >= 350
          ? Math.max(0.8, scale)
          : scale;
      currentView.current = { scale: initialScale, x: 0, y: 0 };
      setView(currentView.current);
    });
    observer.observe(element);
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const bounds = element!.getBoundingClientRect();
      const previous = currentView.current;
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? bounds.height
            : 1);
      const scale = Math.max(
        minimumScale,
        Math.min(
          maximumScale,
          previous.scale *
            Math.exp(-Math.max(-100, Math.min(100, delta)) * 0.002),
        ),
      );
      const point = {
        x: event.clientX - bounds.left - bounds.width / 2,
        y: event.clientY - bounds.top - bounds.height / 2,
      };
      const ratio = scale / previous.scale;
      currentView.current = {
        scale,
        x: point.x - (point.x - previous.x) * ratio,
        y: point.y - (point.y - previous.y) * ratio,
      };
      setView(currentView.current);
    }
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      observer.disconnect();
      element.removeEventListener('wheel', onWheel);
    };
  }, []);

  function localPoint(clientX: number, clientY: number): Point {
    const bounds = viewport.current!.getBoundingClientRect();
    return {
      x: clientX - bounds.left - bounds.width / 2,
      y: clientY - bounds.top - bounds.height / 2,
    };
  }

  function release(pointerId: number) {
    pointers.current.delete(pointerId);
    setDragging(pointers.current.size > 0);
  }

  return (
    <div className='diagram-preview-canvas'>
      <div
        className='diagram-canvas-toolbar'
        role='group'
        aria-label='Diagram controls'
      >
        <PreviewButton
          className='icon-button'
          label='Zoom out'
          disabled={view.scale <= minimumScale}
          onActivate={() => zoom(1 / 1.25)}
        >
          <Minus size={18} aria-hidden='true' />
        </PreviewButton>
        <output aria-label='Diagram zoom'>
          {Math.round(view.scale * 100)}%
        </output>
        <PreviewButton
          className='icon-button'
          label='Zoom in'
          disabled={view.scale >= maximumScale}
          onActivate={() => zoom(1.25)}
        >
          <Plus size={18} aria-hidden='true' />
        </PreviewButton>
        <PreviewButton
          className='icon-button'
          label='Fit diagram to canvas'
          onActivate={fit}
        >
          <Maximize size={18} aria-hidden='true' />
        </PreviewButton>
        {motionEnabled && (
          <PreviewButton
            className='icon-button'
            label={
              paused
                ? 'Play connection animation'
                : 'Pause connection animation'
            }
            onActivate={() => setPaused(!paused)}
          >
            {paused ? (
              <Play size={18} aria-hidden='true' />
            ) : (
              <Pause size={18} aria-hidden='true' />
            )}
          </PreviewButton>
        )}
      </div>
      <div
        ref={viewport}
        className='diagram-canvas'
        role='region'
        aria-label='System diagram canvas'
        aria-describedby='diagram-canvas-help'
        tabIndex={0}
        data-dragging={dragging}
        data-lines={motionEnabled && !paused ? 'animated' : 'static'}
        onKeyDown={(event) => {
          const key = event.key;
          if (
            ![
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              '+',
              '=',
              '-',
              '0',
              'Home',
            ].includes(key)
          )
            return;
          event.preventDefault();
          if (key === '+' || key === '=') zoom(1.25);
          else if (key === '-') zoom(1 / 1.25);
          else if (key === '0' || key === 'Home') fit();
          else {
            const previous = currentView.current;
            update({
              ...previous,
              x:
                previous.x +
                (key === 'ArrowRight' ? 40 : key === 'ArrowLeft' ? -40 : 0),
              y:
                previous.y +
                (key === 'ArrowDown' ? 40 : key === 'ArrowUp' ? -40 : 0),
            });
          }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0 || pointers.current.size >= 2) return;
          if (event.pointerType === 'mouse') event.preventDefault();
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          pointers.current.set(
            event.pointerId,
            localPoint(event.clientX, event.clientY),
          );
          setDragging(true);
        }}
        onPointerMove={(event) => {
          const previousPoint = pointers.current.get(event.pointerId);
          if (!previousPoint) return;
          const point = localPoint(event.clientX, event.clientY);
          const oldPoints = [...pointers.current.values()].slice(0, 2);
          pointers.current.set(event.pointerId, point);
          const newPoints = [...pointers.current.values()].slice(0, 2);
          const previous = currentView.current;
          if (oldPoints.length === 2) {
            const center = (points: Point[]) => ({
              x: (points[0].x + points[1].x) / 2,
              y: (points[0].y + points[1].y) / 2,
            });
            const distance = (points: Point[]) =>
              Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
            const oldCenter = center(oldPoints);
            const newCenter = center(newPoints);
            const scale = Math.max(
              minimumScale,
              Math.min(
                maximumScale,
                (previous.scale * distance(newPoints)) /
                  Math.max(1, distance(oldPoints)),
              ),
            );
            const ratio = scale / previous.scale;
            update({
              scale,
              x: newCenter.x - (oldCenter.x - previous.x) * ratio,
              y: newCenter.y - (oldCenter.y - previous.y) * ratio,
            });
          } else
            update({
              ...previous,
              x: previous.x + point.x - previousPoint.x,
              y: previous.y + point.y - previousPoint.y,
            });
        }}
        onPointerUp={(event) => release(event.pointerId)}
        onPointerCancel={(event) => release(event.pointerId)}
        onLostPointerCapture={(event) => release(event.pointerId)}
      >
        <div
          className='diagram-canvas-scene'
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
        >
          <SystemDiagram project={project} />
        </div>
      </div>
      <p id='diagram-canvas-help' className='diagram-canvas-help'>
        Drag to pan · Scroll or pinch to zoom · Arrow keys to move · +/− to zoom
        · 0 to fit
      </p>
    </div>
  );
}
