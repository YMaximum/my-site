import { useEffect, useRef, useState } from 'react';
import type { Project } from '../data/portfolio';
import Icon from './Icons';
import DiagramCanvas from './DiagramCanvas';
import PreviewButton from './PreviewButton';

function animateClose(element: HTMLDialogElement, enabled: boolean) {
  if (!element.open || element.dataset.closing) return null;
  if (!enabled) {
    element.close();
    return null;
  }
  element.dataset.closing = 'true';
  const animation = element.animate(
    [
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(12px) scale(0.98)' },
    ],
    { duration: 180, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
  );
  void animation.finished
    .then(() => {
      element.close();
      animation.cancel();
      delete element.dataset.closing;
    })
    .catch(() => {
      delete element.dataset.closing;
    });
  return animation;
}

function isOutside(event: React.PointerEvent<HTMLDialogElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  return (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  );
}

export default function ProjectDialog({
  project,
  onClose,
  motionEnabled,
}: {
  project: Project | null;
  onClose: () => void;
  motionEnabled: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closingAnimation = useRef<Animation | null>(null);
  const pointerStartedOutside = useRef(false);
  const [displayedProject, setDisplayedProject] = useState(project);
  // Retain the content during exit, including when browser Back clears the URL.
  if (project && project !== displayedProject) setDisplayedProject(project);

  function requestClose() {
    const element = dialog.current;
    if (element && !element.dataset.closing) {
      closingAnimation.current = animateClose(element, motionEnabled);
    }
  }

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (project && !element.open) {
      element.showModal();
      element.scrollTop = 0;
    } else if (!project) {
      closingAnimation.current = animateClose(element, motionEnabled);
    }
    return () => {
      closingAnimation.current?.cancel();
      closingAnimation.current = null;
    };
  }, [project, motionEnabled]);

  return (
    <dialog
      ref={dialog}
      className='project-dialog'
      aria-labelledby='case-study-title'
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onPointerDown={(event) => {
        pointerStartedOutside.current = event.button === 0 && isOutside(event);
      }}
      onPointerUp={(event) => {
        if (pointerStartedOutside.current && isOutside(event)) requestClose();
        pointerStartedOutside.current = false;
      }}
      onPointerCancel={() => {
        pointerStartedOutside.current = false;
      }}
    >
      {displayedProject && (
        <>
          <div className='dialog-top'>
            <h2 id='case-study-title'>{displayedProject.title}</h2>
            <PreviewButton
              className='icon-button dialog-close'
              label='Close system diagram'
              onActivate={requestClose}
            >
              <Icon name='X' size={22} />
            </PreviewButton>
          </div>
          <DiagramCanvas
            key={displayedProject.id}
            project={displayedProject.id}
            motionEnabled={motionEnabled}
          />
        </>
      )}
    </dialog>
  );
}
