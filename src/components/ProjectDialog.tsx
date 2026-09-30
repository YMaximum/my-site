import { useEffect, useRef } from 'react';
import type { Project } from '../data/portfolio';
import Icon from './Icons';

export default function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (project && !element?.open) element?.showModal();
    if (!project && element?.open) element.close();
  }, [project]);

  return (
    <dialog
      ref={dialog}
      className='project-dialog'
      aria-labelledby='case-study-title'
      onClose={onClose}
    >
      {project && (
        <div className='dialog-content'>
          <div className='dialog-top'>
            <span className='project-category'>{project.category}</span>
            <button
              className='icon-button dialog-close'
              aria-label='Close case study'
              onClick={() => dialog.current?.close()}
            >
              <Icon name='X' size={22} />
            </button>
          </div>
          <h2 id='case-study-title'>{project.title}</h2>
          <p className='dialog-summary'>{project.summary}</p>
          <ul className='tech-list' aria-label='Technologies'>
            {project.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className='case-study-section'>
            <h3>The problem</h3>
            <p>{project.context}</p>
          </div>
          <div className='case-study-section'>
            <h3>My contribution</h3>
            <p>{project.contribution}</p>
          </div>
          <div className='case-study-section'>
            <h3>The decisions</h3>
            <div className='case-decisions'>
              {project.decisions.map((decision) => (
                <div key={decision.title}>
                  <Icon name='Check' size={18} />
                  <div>
                    <h4>{decision.title}</h4>
                    <p>{decision.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='case-study-section case-outcome'>
            <h3>The result</h3>
            <p>{project.outcome}</p>
          </div>
          <div className='dialog-actions'>
            {project.repository && (
              <a
                className='button button-primary'
                href={project.repository}
                target='_blank'
                rel='noreferrer'
              >
                <Icon name='Github' size={18} /> Explore the repository{' '}
                <Icon name='ArrowUpRight' size={16} />
              </a>
            )}
            <button
              className='text-button'
              onClick={() => dialog.current?.close()}
            >
              Back to selected work <Icon name='ArrowRight' size={17} />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
