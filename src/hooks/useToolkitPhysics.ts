import { useEffect, useRef, type RefObject } from 'react';
import type {
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';

interface Controls {
  wake?: () => void;
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
      const engine = Engine.create({ enableSleeping: false });
      engine.gravity.y = 0;
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
      const random = (index: number) => {
        const value = Math.sin(index * 12.9898 + 7) * 43758.5453;
        return value - Math.floor(value);
      };
      const columns = Math.max(1, Math.floor(width / 145));
      const rows = Math.ceil(sizes.length / columns);
      const bodies = sizes.map((size, index) => {
        const body = Bodies.rectangle(
          Math.max(
            size.width / 2 + 8,
            Math.min(
              width - size.width / 2 - 8,
              (((index % columns) + 0.5) * width) / columns +
                (random(index) - 0.5) * 20,
            ),
          ),
          Math.max(
            size.height / 2 + 8,
            Math.min(
              height - size.height / 2 - 8,
              ((Math.floor(index / columns) + 0.5) * height) / rows,
            ),
          ),
          size.width,
          size.height,
          {
            chamfer: { radius: 6 },
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            restitution: 1,
            angle: (random(index + 40) - 0.5) * 0.16,
          },
        );
        const angle = random(index + 60) * Math.PI * 2;
        const speed = 0.35 + random(index + 80) * 0.3;
        Body.setVelocity(body, {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        });
        Body.setAngularVelocity(body, (random(index + 100) - 0.5) * 0.0015);
        return body;
      });
      let walls: Matter.Body[] = [];
      function buildWalls() {
        walls.forEach((wall) => Composite.remove(engine.world, wall));
        walls = [
          Bodies.rectangle(width / 2, -16, width + 160, 40, {
            isStatic: true,
            restitution: 1,
            friction: 0,
          }),
          Bodies.rectangle(width / 2, height + 16, width + 160, 40, {
            isStatic: true,
            restitution: 1,
            friction: 0,
          }),
          Bodies.rectangle(-36, height / 2, 80, height + 160, {
            isStatic: true,
            restitution: 1,
            friction: 0,
          }),
          Bodies.rectangle(width + 36, height / 2, 80, height + 160, {
            isStatic: true,
            restitution: 1,
            friction: 0,
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
        bodies.forEach((body, index) => {
          // Gentle drift and shallow rotations keep the floating names readable.
          if (Math.abs(body.angle) > 0.2) {
            Body.setAngle(body, Math.sign(body.angle) * 0.2);
            Body.setAngularVelocity(body, -Math.sign(body.angle) * 0.001);
          }
          if (body !== grab?.bodyB) {
            const speed = Math.hypot(body.velocity.x, body.velocity.y);
            if (speed < 0.3) {
              const angle = random(index + 60) * Math.PI * 2;
              Body.setVelocity(body, {
                x: Math.cos(angle) * 0.4,
                y: Math.sin(angle) * 0.4,
              });
            } else if (speed > 0.9) {
              Body.setVelocity(body, {
                x: (body.velocity.x / speed) * 0.9,
                y: (body.velocity.y / speed) * 0.9,
              });
            }
          }
          if (pointer && !grab) {
            const dx = body.position.x - pointer.x;
            const dy = body.position.y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 95 && distance > 1) {
              Sleeping.set(body, false);
              const force = (1 - distance / 95) * 0.00022 * body.mass;
              Body.applyForce(body, body.position, {
                x: (dx / distance) * force,
                y: (dy / distance) * force * 0.45,
              });
            }
          }
        });
        // Fixed steps keep drift consistent on both fast and slower displays.
        accumulator += delta;
        while (accumulator >= 1000 / 60) {
          Engine.update(engine, 1000 / 60);
          accumulator -= 1000 / 60;
        }
        draw();
        schedule();
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
