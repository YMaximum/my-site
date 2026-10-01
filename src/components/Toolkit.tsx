import { useEffect, useRef, useState } from 'react';
import { toolkit } from '../data/portfolio';
import { TechnologyMark } from './TechTags';
import { techStyle } from '../data/technologies';

export default function Toolkit({ motionEnabled }: { motionEnabled: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const autoScroll = motionEnabled && visible;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
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
  }, [motionEnabled]);

  return (
    <section
      className='experience-toolkit'
      aria-label='Technology toolkit'
      data-mode={motionEnabled ? 'marquee' : 'static'}
    >
      <div
        ref={stage}
        className='toolkit-stage'
        tabIndex={!motionEnabled ? 0 : undefined}
        role={!motionEnabled ? 'group' : undefined}
        aria-label={!motionEnabled ? 'Technology skills' : undefined}
      >
        <div className='toolkit-track'>
          <ul
            className='toolkit-badges'
            aria-label='Technology skills and development tools'
          >
            {toolkit.map((name) => (
              <li key={name} style={techStyle(name)}>
                <span className='toolkit-badge'>
                  <TechnologyMark name={name} />
                </span>
              </li>
            ))}
          </ul>
          {motionEnabled && (
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
