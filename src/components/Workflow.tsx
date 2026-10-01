import Icon from './Icons';
import { workflow } from '../data/portfolio';

export default function Workflow({
  stage,
  onStageChange,
}: {
  stage: number;
  onStageChange: (stage: number) => void;
}) {
  const current = workflow[stage];

  return (
    <div className='workflow'>
      <ol
        className='workflow-steps'
        aria-label='Explore the development workflow'
      >
        {workflow.map((step, index) => (
          <li key={step.id}>
            <button
              className={`workflow-step ${stage === index ? 'is-active' : ''}`}
              aria-pressed={stage === index}
              aria-controls='workflow-detail'
              onClick={() => onStageChange(index)}
            >
              <span className='step-number'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{step.title}</span>
              <Icon name='ArrowRight' size={16} />
            </button>
          </li>
        ))}
      </ol>
      <div
        id='workflow-detail'
        className='workflow-panel'
        aria-live='polite'
        aria-atomic='true'
      >
        <div className='workflow-detail' key={current.id}>
          <span className='workflow-detail-label'>
            Step {stage + 1} of {workflow.length}
          </span>
          <h3>{current.heading}</h3>
          <p>{current.description}</p>
          <div className='workflow-responsibilities'>
            <div>
              <span>
                <Icon name='Target' size={16} /> My part
              </span>
              <p>{current.human}</p>
            </div>
            <div>
              <span>
                <Icon name='Sparkles' size={16} /> AI support
              </span>
              <p>{current.ai}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
