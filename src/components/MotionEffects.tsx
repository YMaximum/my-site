import { useEffect, useRef } from 'react';

export default function MotionEffects({ enabled }: { enabled: boolean }) {
  const scene = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = scene.current;
    const indicator = progress.current;
    let scrollFrame = 0;
    let pointerFrame = 0;

    function updateScroll() {
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      const value = distance > 0 ? window.scrollY / distance : 0;
      indicator?.style.setProperty(
        '--progress',
        String(Math.min(1, Math.max(0, value))),
      );
      if (enabled)
        background?.style.setProperty('--scroll-offset', `${value * -90}px`);
    }

    function onScroll() {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(updateScroll);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        background?.style.setProperty(
          '--pointer-x',
          `${(event.clientX / window.innerWidth - 0.5) * 22}px`,
        );
        background?.style.setProperty(
          '--pointer-y',
          `${(event.clientY / window.innerHeight - 0.5) * 22}px`,
        );
      });
    }

    function resetPointer() {
      background?.style.setProperty('--pointer-x', '0px');
      background?.style.setProperty('--pointer-y', '0px');
    }

    const headerHeight = getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height')
      .trim();
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }),
      { threshold: 0.08, rootMargin: `-${headerHeight} 0px 0px 0px` },
    );
    document
      .querySelectorAll('[data-reveal]')
      .forEach((element) => observer.observe(element));
    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (enabled) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerleave', resetPointer);
    } else {
      resetPointer();
      background?.style.setProperty('--scroll-offset', '0px');
    }

    return () => {
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(pointerFrame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', resetPointer);
    };
  }, [enabled]);

  return (
    <>
      <div className='ambient-scene' ref={scene} aria-hidden='true'>
        <div className='ambient-grid' />
        <div className='geometry-field'>
          <div className='geometry geometry-orbit'>
            <span />
            <i />
          </div>
          <div className='geometry geometry-square'>
            <span />
          </div>
          <div className='geometry geometry-diamond' />
          <div className='geometry geometry-cross'>
            <span />
            <span />
          </div>
        </div>
      </div>
      <div className='reading-progress' ref={progress} aria-hidden='true' />
    </>
  );
}
