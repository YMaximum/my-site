import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
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
  const physics = useToolkitPhysics(
    stage,
    desktop && motionEnabled && activated,
    visible,
  );
  const autoScroll = !desktop && motionEnabled && visible;

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
      const loopWidth = (group?.offsetWidth ?? 0) + 32;
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

  useEffect(() => {
    if (stage.current) stage.current.scrollLeft = 0;
  }, [desktop, motionEnabled]);

  return (
    <section
      className='experience-toolkit'
      aria-label='Technology toolkit'
      data-mode={motionEnabled ? (desktop ? 'floating' : 'marquee') : 'static'}
    >
      <div
        ref={stage}
        className='toolkit-stage'
        tabIndex={!desktop && !motionEnabled ? 0 : undefined}
        role={!desktop && !motionEnabled ? 'group' : undefined}
        aria-label={
          !desktop && !motionEnabled ? 'Technology skills' : undefined
        }
        onPointerMove={physics.move}
        onPointerUp={physics.end}
        onPointerCancel={physics.end}
        onPointerLeave={physics.leave}
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
                    aria-description='Drag to move, or use arrow keys.'
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
          {!desktop && motionEnabled && (
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
