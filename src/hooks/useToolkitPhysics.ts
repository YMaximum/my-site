import { useEffect, useRef, type RefObject } from 'react';
import type {
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';

interface Controls {
  wake?: () => void;
  reset?: () => void;
  start?: (index: number, x: number, y: number) => void;
  move?: (x: number, y: number, mouse: boolean) => void;
  end?: () => void;
  leave?: () => void;
  key?: (index: number, key: string) => void;
}

export function useToolkitPhysics(
  stage: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  visible: boolean,
) {
  const controls = useRef<Controls>({});
  const visibleNow = useRef(visible);

  useEffect(() => {
    visibleNow.current = visible;
    if (visible) controls.current.wake?.();
  }, [visible]);

  useEffect(() => {
    const element = stage.current;
    if (!enabled || !element) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    async function initialize() {
      const { default: Matter } = await import('matter-js');
      await document.fonts.ready;
      if (cancelled || !element) return;
      const { Bodies, Body, Composite, Constraint, Engine, Sleeping, Vector } =
        Matter;
      const engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1;
      const badges = [
        ...element.querySelectorAll<HTMLLIElement>(
          '.toolkit-badges:first-child li',
        ),
      ];
      const sizes = badges.map((badge) => ({
        width: badge.offsetWidth,
        height: badge.offsetHeight,
      }));
      let width = element.clientWidth;
      let height = element.clientHeight;
      let frame = 0;
      let previousTime = 0;
      let accumulator = 0;
      let pointer: { x: number; y: number } | null = null;
      let grab: Matter.Constraint | null = null;
      const bodies = sizes.map((size, index) =>
        Bodies.rectangle(
          Math.min(
            width - size.width / 2 - 10,
            size.width / 2 +
              10 +
              ((index * 71) % Math.max(1, width - size.width - 20)),
          ),
          -40 - index * 66,
          size.width,
          size.height,
          {
            chamfer: { radius: 6 },
            friction: 0.65,
            frictionStatic: 0.8,
            frictionAir: 0.025,
            restitution: 0.12,
            sleepThreshold: 50,
            angle: ((index % 3) - 1) * 0.08,
          },
        ),
      );
      let walls: Matter.Body[] = [];
      function buildWalls() {
        walls.forEach((wall) => Composite.remove(engine.world, wall));
        walls = [
          Bodies.rectangle(width / 2, height + 20, width + 160, 40, {
            isStatic: true,
          }),
          Bodies.rectangle(-40, height / 2, 80, height + 5000, {
            isStatic: true,
          }),
          Bodies.rectangle(width + 40, height / 2, 80, height + 5000, {
            isStatic: true,
          }),
        ];
        Composite.add(engine.world, walls);
      }
      function draw() {
        bodies.forEach((body, index) => {
          const size = sizes[index];
          badges[index].style.setProperty(
            'transform',
            `translate3d(${body.position.x - size.width / 2}px, ${body.position.y - size.height / 2}px, 0) rotate(${body.angle}rad)`,
          );
        });
      }
      function schedule() {
        if (!frame && visibleNow.current && !document.hidden) {
          element!.removeAttribute('data-settled');
          frame = requestAnimationFrame(tick);
        }
      }
      function tick(time: number) {
        frame = 0;
        if (!visibleNow.current || document.hidden) {
          previousTime = 0;
          return;
        }
        const delta = previousTime
          ? Math.min(time - previousTime, 1000 / 15)
          : 1000 / 60;
        previousTime = time;
        let nearby = false;
        bodies.forEach((body) => {
          // Keep names readable while preserving the feel of a loose pile.
          if (Math.abs(body.angle) > 0.28) {
            Body.setAngle(body, Math.sign(body.angle) * 0.28);
            Body.setAngularVelocity(body, 0);
          }
          if (pointer && !grab) {
            const dx = body.position.x - pointer.x;
            const dy = body.position.y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 95 && distance > 1) {
              nearby = true;
              Sleeping.set(body, false);
              const force = (1 - distance / 95) * 0.00022 * body.mass;
              Body.applyForce(body, body.position, {
                x: (dx / distance) * force,
                y: (dy / distance) * force * 0.45,
              });
            }
          }
        });
        // Fixed steps keep gravity consistent on both fast and slower displays.
        accumulator += delta;
        while (accumulator >= 1000 / 60) {
          Engine.update(engine, 1000 / 60);
          accumulator -= 1000 / 60;
        }
        draw();
        if (grab || nearby || bodies.some((body) => !body.isSleeping))
          schedule();
        else {
          previousTime = 0;
          element!.setAttribute('data-settled', 'true');
        }
      }
      Composite.add(engine.world, bodies);
      buildWalls();
      draw();
      element.setAttribute('data-physics', 'ready');
      const resize = new ResizeObserver(() => {
        const nextWidth = element.clientWidth;
        const nextHeight = element.clientHeight;
        if (nextWidth === width && nextHeight === height) return;
        bodies.forEach((body, index) => {
          Body.setPosition(body, {
            x: Math.max(
              sizes[index].width / 2 + 4,
              Math.min(
                nextWidth - sizes[index].width / 2 - 4,
                (body.position.x * nextWidth) / width,
              ),
            ),
            y: Math.min(nextHeight - sizes[index].height / 2, body.position.y),
          });
          Sleeping.set(body, false);
        });
        width = nextWidth;
        height = nextHeight;
        buildWalls();
        schedule();
      });
      resize.observe(element);
      const onVisibility = () => {
        previousTime = 0;
        schedule();
      };
      document.addEventListener('visibilitychange', onVisibility);
      function coordinates(x: number, y: number) {
        const rect = element!.getBoundingClientRect();
        return {
          x: Math.max(15, Math.min(width - 15, x - rect.left)),
          y: Math.max(15, Math.min(height - 15, y - rect.top)),
        };
      }
      function release() {
        if (grab) Composite.remove(engine.world, grab);
        grab = null;
        pointer = null;
        element!.removeAttribute('data-dragging');
        schedule();
      }
      controls.current = {
        wake: schedule,
        reset() {
          release();
          bodies.forEach((body, index) => {
            Sleeping.set(body, false);
            Body.setPosition(body, {
              x:
                sizes[index].width / 2 +
                10 +
                ((index * 71) % Math.max(1, width - sizes[index].width - 20)),
              y: -40 - index * 66,
            });
            Body.setVelocity(body, { x: 0, y: 0 });
            Body.setAngle(body, ((index % 3) - 1) * 0.08);
            Body.setAngularVelocity(body, 0);
          });
          draw();
          schedule();
        },
        start(index, x, y) {
          release();
          const body = bodies[index];
          const point = coordinates(x, y);
          Sleeping.set(body, false);
          grab = Constraint.create({
            bodyB: body,
            pointA: point,
            pointB: Vector.rotate(
              Vector.sub(point, body.position),
              -body.angle,
            ),
            stiffness: 0.18,
            damping: 0.2,
            length: 0,
          });
          Composite.add(engine.world, grab);
          element!.setAttribute('data-dragging', 'true');
          schedule();
        },
        move(x, y, mouse) {
          const point = coordinates(x, y);
          if (grab) grab.pointA = point;
          else if (mouse) pointer = point;
          schedule();
        },
        end: release,
        leave() {
          if (!grab) pointer = null;
        },
        key(index, key) {
          const body = bodies[index];
          Sleeping.set(body, false);
          const dx = key === 'ArrowLeft' ? -22 : key === 'ArrowRight' ? 22 : 0;
          const dy = key === 'ArrowUp' ? -22 : key === 'ArrowDown' ? 22 : 0;
          Body.setPosition(body, {
            x: Math.max(
              sizes[index].width / 2 + 4,
              Math.min(
                width - sizes[index].width / 2 - 4,
                body.position.x + dx,
              ),
            ),
            y:
              key === 'Enter' || key === ' '
                ? Math.max(40, body.position.y - 100)
                : Math.max(
                    25,
                    Math.min(
                      height - sizes[index].height / 2,
                      body.position.y + dy,
                    ),
                  ),
          });
          Body.setVelocity(body, { x: 0, y: 0 });
          draw();
          schedule();
        },
      };
      schedule();
      dispose = () => {
        cancelAnimationFrame(frame);
        resize.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        controls.current = {};
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        element.removeAttribute('data-physics');
        element.removeAttribute('data-settled');
        element.removeAttribute('data-dragging');
        badges.forEach((badge) => badge.style.removeProperty('transform'));
      };
    }
    void initialize().catch(() => {
      /* The readable static layout remains available if loading fails. */
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [stage, enabled]);

  return {
    reset: () => controls.current.reset?.(),
    start(index: number, event: ReactPointerEvent<HTMLButtonElement>) {
      if (event.button !== 0 || !controls.current.start) return;
      event.preventDefault();
      event.currentTarget.focus({ preventScroll: true });
      event.currentTarget.setPointerCapture(event.pointerId);
      controls.current.start(index, event.clientX, event.clientY);
    },
    move: (event: ReactPointerEvent) =>
      controls.current.move?.(
        event.clientX,
        event.clientY,
        event.pointerType === 'mouse',
      ),
    end: () => controls.current.end?.(),
    leave: () => controls.current.leave?.(),
    key(index: number, event: ReactKeyboardEvent) {
      if (
        ![
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'Enter',
          ' ',
        ].includes(event.key) ||
        !controls.current.key
      )
        return;
      event.preventDefault();
      controls.current.key(index, event.key);
    },
  };
}
