import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { toolkit } from '../data/portfolio';
import { TechnologyMark } from './TechTags';
import { techStyle } from '../data/technologies';
import { useToolkitPhysics } from '../hooks/useToolkitPhysics';

const desktopQuery = '(min-width: 641px)';
function subscribe(onChange: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

export default function Toolkit({ motionEnabled }: { motionEnabled: boolean }) {
  const desktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(desktopQuery).matches,
    () => false,
  );
  const stage = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const physics = useToolkitPhysics(
    stage,
    desktop && motionEnabled && activated,
    visible,
  );
  const autoScroll =
    !desktop && motionEnabled && visible && !paused && !interacting;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setActivated(true);
      },
      { threshold: 0.08 },
    );
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!autoScroll || !element) return;
    let frame = 0;
    let previous = 0;
    let position = element.scrollLeft;
    function tick(time: number) {
      if (!element || document.hidden) {
        frame = 0;
        previous = 0;
        return;
      }
      const group = element.querySelector<HTMLElement>('.toolkit-badges');
      const loopWidth = (group?.offsetWidth ?? 0) + 16;
      if (loopWidth) {
        position += Math.min(previous ? time - previous : 0, 40) * 0.04;
        if (position >= loopWidth) position -= loopWidth;
        element.scrollLeft = position;
      }
      previous = time;
      frame = requestAnimationFrame(tick);
    }
    function wake() {
      if (!document.hidden && !frame) frame = requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', wake);
    wake();
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', wake);
    };
  }, [autoScroll]);

  // Each layout starts at the beginning, avoiding leftover marquee scroll offsets.
  useEffect(() => {
    if (stage.current) stage.current.scrollLeft = 0;
  }, [desktop, motionEnabled]);

  return (
    <section
      className='experience-toolkit'
      aria-labelledby='toolkit-title'
      data-mode={desktop ? (motionEnabled ? 'physics' : 'static') : 'carousel'}
    >
      <div className='toolkit-heading'>
        <h3 id='toolkit-title'>Tools I build with</h3>
        {desktop ? (
          <button
            className='icon-button toolkit-control'
            aria-label='Drop the toolkit badges again'
            disabled={!motionEnabled}
            onClick={physics.reset}
          >
            <RotateCcw size={17} aria-hidden='true' />
          </button>
        ) : (
          <button
            className='icon-button toolkit-control'
            disabled={!motionEnabled}
            aria-label={
              paused ? 'Play toolkit carousel' : 'Pause toolkit carousel'
            }
            aria-pressed={!paused && motionEnabled}
            onClick={() => setPaused(!paused)}
          >
            {paused || !motionEnabled ? (
              <Play size={17} aria-hidden='true' />
            ) : (
              <Pause size={17} aria-hidden='true' />
            )}
          </button>
        )}
      </div>
      <p id='toolkit-hint' className='toolkit-hint'>
        {desktop && motionEnabled
          ? 'Drag a badge, or use arrow keys. Enter lifts it.'
          : desktop
            ? 'A few of the tools I work with.'
            : 'My everyday toolkit. Swipe to explore.'}
      </p>
      <div
        ref={stage}
        className='toolkit-stage'
        aria-label='Overall technology toolkit'
        tabIndex={desktop ? -1 : 0}
        onPointerMove={physics.move}
        onPointerUp={physics.end}
        onPointerCancel={physics.end}
        onPointerLeave={() => {
          physics.leave();
          setInteracting(false);
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setInteracting(true);
        }}
        onTouchStart={() => setInteracting(true)}
        onTouchEnd={() => setInteracting(false)}
        onTouchCancel={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setInteracting(false);
        }}
      >
        <div className='toolkit-track'>
          <ul
            className='toolkit-badges'
            aria-label='Technology skills and development tools'
          >
            {toolkit.map((name, index) => (
              <li key={name} style={techStyle(name)}>
                {desktop && motionEnabled ? (
                  <button
                    className='toolkit-badge'
                    aria-label={`Move ${name} badge`}
                    aria-describedby='toolkit-hint'
                    onPointerDown={(event) => physics.start(index, event)}
                    onLostPointerCapture={physics.end}
                    onKeyDown={(event) => physics.key(index, event)}
                  >
                    <TechnologyMark name={name} />
                  </button>
                ) : (
                  <span className='toolkit-badge'>
                    <TechnologyMark name={name} />
                  </span>
                )}
              </li>
            ))}
          </ul>
          {!desktop && (
            <ul className='toolkit-badges toolkit-copy' aria-hidden='true'>
              {toolkit.map((name) => (
                <li key={name} style={techStyle(name)}>
                  <span className='toolkit-badge'>
                    <TechnologyMark name={name} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
