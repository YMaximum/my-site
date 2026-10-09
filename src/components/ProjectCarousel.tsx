import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projects, type ProjectId } from '../data/portfolio';
import SystemDiagram from './SystemDiagram';
import TechTags from './TechTags';

export default function ProjectCarousel({
  index,
  interactive,
  onChange,
  onOpen,
}: {
  index: number;
  interactive: boolean;
  onChange: (index: number) => void;
  onOpen: (id: ProjectId) => void;
}) {
  const [direction, setDirection] = useState(1);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressOpen = useRef(false);
  function select(next: number, direction: number) {
    setDirection(direction);
    onChange((next + projects.length) % projects.length);
  }
  return (
    <div
      className='project-carousel'
      role='region'
      aria-roledescription={interactive ? 'carousel' : undefined}
      aria-label='Company projects'
      onKeyDown={(event) => {
        if (event.target instanceof HTMLSelectElement) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          const step = event.key === 'ArrowRight' ? 1 : -1;
          select(index + step, step);
        }
      }}
    >
      <div className='carousel-toolbar'>
        <label className='carousel-select'>
          <span className='sr-only'>Choose a project</span>
          <select
            value={projects[index].id}
            onChange={(event) => {
              const next = projects.findIndex(
                (project) => project.id === event.target.value,
              );
              select(next, next >= index ? 1 : -1);
            }}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </label>
        <div className='carousel-tabs' aria-label='Choose a project'>
          {projects.map((item, i) => (
            <button
              key={item.id}
              aria-label={`Show ${item.title.toLowerCase()}`}
              aria-pressed={index === i}
              aria-controls='project-slide'
              onClick={() => select(i, i >= index ? 1 : -1)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className='carousel-arrows'>
          <button
            className='icon-button'
            aria-label='Previous project'
            aria-controls='project-slide'
            onClick={() => select(index - 1, -1)}
          >
            <ArrowLeft size={19} aria-hidden='true' />
          </button>
          <button
            className='icon-button'
            aria-label='Next project'
            aria-controls='project-slide'
            onClick={() => select(index + 1, 1)}
          >
            <ArrowRight size={19} aria-hidden='true' />
          </button>
        </div>
      </div>
      <div
        id='project-slide'
        aria-live='polite'
        aria-atomic='true'
        onTouchStart={(event) => {
          suppressOpen.current = false;
          touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchCancel={() => {
          touchStart.current = null;
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            suppressOpen.current = true;
            select(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
          }
        }}
      >
        {projects.map((project, projectIndex) => (
          <article
            hidden={interactive && projectIndex !== index}
            key={project.id}
            className={`carousel-card ${direction < 0 ? 'from-left' : ''}`}
            role={interactive ? 'group' : undefined}
            aria-roledescription={interactive ? 'slide' : undefined}
            aria-label={
              interactive
                ? `${projectIndex + 1} of ${projects.length}`
                : undefined
            }
          >
            <div className='carousel-copy'>
              <span className='project-category'>{project.category}</span>
              <h3>{project.title}</h3>
              <p className='project-purpose'>{project.summary}</p>
              <p className='project-association'>
                Associated with <strong>{project.association}</strong>
              </p>
              <TechTags technologies={project.technologies} />
            </div>
            <div className='carousel-system'>
              <div className='diagram-preview-trigger'>
                <SystemDiagram project={project.id} />
                <button
                  className='diagram-open-button'
                  aria-label={`Preview ${project.title.toLowerCase()} system diagram`}
                  aria-haspopup='dialog'
                  onClick={(event) => {
                    if (event.detail === 0 || !suppressOpen.current)
                      onOpen(project.id);
                  }}
                />
              </div>
              <p className='architecture-summary'>{project.architecture}</p>
            </div>
          </article>
        ))}
      </div>
      <p className='carousel-progress'>
        <span>
          {String(index + 1).padStart(2, '0')} /{' '}
          {String(projects.length).padStart(2, '0')}
        </span>{' '}
        <span className='carousel-hint'>
          Company products ·{' '}
          <span className='desktop-carousel-hint'>
            Use arrows or swipe to explore
          </span>
          <span className='mobile-carousel-hint'>Swipe to explore</span>
        </span>
      </p>
    </div>
  );
}
