import Icon from './Icons';
import type { ProjectId } from '../data/portfolio';

function IntegrationVisual() {
  return (
    <div className='integration-visual'>
      <div className='visual-toolbar'>
        <span>
          <Icon name='GitBranch' size={16} /> A clearer path for data
        </span>
        <span className='visual-caption'>Conceptual workflow</span>
      </div>
      <div className='integration-canvas'>
        <svg
          className='integration-lines'
          viewBox='0 0 600 320'
          preserveAspectRatio='none'
          aria-hidden='true'
        >
          <path d='M130 100H192Q212 100 212 120V150Q212 170 232 170H300' />
          <path d='M130 240H192Q212 240 212 220V190Q212 170 232 170' />
          <path
            className='flow-pulse'
            d='M130 100H192Q212 100 212 120V150Q212 170 232 170H300'
          />
          <path
            className='flow-pulse'
            d='M130 240H192Q212 240 212 220V190Q212 170 232 170H300'
          />
        </svg>
        <div className='data-node source-node source-one'>
          <span className='node-icon'>
            <Icon name='Database' size={20} />
          </span>
          <span>
            Source data<small>Tables and queries</small>
          </span>
          <i className='node-port' />
        </div>
        <div className='data-node source-node source-two'>
          <span className='node-icon'>
            <Icon name='Network' size={20} />
          </span>
          <span>
            Another source<small>Connect what matters</small>
          </span>
          <i className='node-port' />
        </div>
        <div className='data-node mapping-node'>
          <div className='mapping-heading'>
            <Icon name='SlidersHorizontal' size={20} />
            <span>Shape & map</span>
          </div>
          <div className='mapping-row'>
            <span>Source field</span>
            <Icon name='ArrowRight' size={14} />
            <span>Target field</span>
          </div>
          <div className='mapping-row'>
            <span>Source key</span>
            <Icon name='ArrowRight' size={14} />
            <span>Target key</span>
          </div>
          <span className='mapping-note'>
            <Icon name='CheckCheck' size={14} /> Make the relationship clear
          </span>
        </div>
        <div className='data-node target-node'>
          <span className='node-icon'>
            <Icon name='Database' size={20} />
          </span>
          <span>
            Target<small>Ready to load</small>
          </span>
        </div>
        <div className='preview-note'>
          <Icon name='ScanEye' size={18} />
          <span>
            Preview the changes.
            <br />
            <strong>Then make the call.</strong>
          </span>
        </div>
      </div>
      <div className='visual-bottom'>
        <span>Connect</span>
        <Icon name='ChevronRight' size={14} />
        <span>Understand</span>
        <Icon name='ChevronRight' size={14} />
        <span>Deliver</span>
      </div>
    </div>
  );
}

function DiagramVisual() {
  return (
    <div className='diagram-visual'>
      <div className='diagram-header'>
        <Icon name='Network' size={17} />
        <span>A shared canvas</span>
        <span className='visual-caption'>Concept illustration</span>
      </div>
      <svg
        viewBox='0 0 540 250'
        className='diagram-lines'
        preserveAspectRatio='none'
        aria-hidden='true'
      >
        <path d='M150 125H220Q235 125 235 110V74Q235 60 250 60H320' />
        <path d='M235 125V190Q235 205 250 205H320' />
      </svg>
      <div className='canvas-node idea-node'>
        <Icon name='Sparkles' size={19} />
        <span>An idea</span>
      </div>
      <div className='canvas-node design-node'>
        <span className='small-dot' />
        <span>Explore it</span>
      </div>
      <div className='canvas-node build-node'>
        <Icon name='Code2' size={17} />
        <span>Build it</span>
      </div>
      <div className='collab-cursor cursor-one'>
        <Icon name='MousePointer2' size={20} />
        <span>You</span>
      </div>
      <div className='collab-cursor cursor-two'>
        <Icon name='MousePointer2' size={20} />
        <span>Teammate</span>
      </div>
      <div className='canvas-footer'>
        <span className='avatar avatar-blue'>Y</span>
        <span className='avatar avatar-lilac'>T</span>
        <span>Better, together.</span>
      </div>
    </div>
  );
}

function HealthcareVisual() {
  return (
    <div className='healthcare-visual'>
      <div className='diagram-header'>
        <Icon name='HeartPulse' size={17} />
        <span>Obatin</span>
        <span className='visual-caption'>Concept illustration</span>
      </div>
      <div className='healthcare-orbit' aria-hidden='true'>
        <div className='orbit-ring ring-one' />
        <div className='orbit-ring ring-two' />
        <div className='healthcare-center'>
          <Icon name='Plus' size={44} />
        </div>
        <span className='care-point consultation-point'>
          <Icon name='HeartPulse' size={19} /> Consultation
        </span>
        <span className='care-point pharmacy-point'>
          <Icon name='ShieldCheck' size={19} /> Pharmacy
        </span>
        <span className='care-point platform-point'>
          <Icon name='Code2' size={19} /> Platform
        </span>
      </div>
      <div className='healthcare-caption'>
        Different journeys.
        <br />
        <strong>One connected product.</strong>
      </div>
    </div>
  );
}

export default function ProjectVisual({ project }: { project: ProjectId }) {
  return (
    <div className={`project-visual project-visual--${project}`}>
      {project === 'integration' ? (
        <IntegrationVisual />
      ) : project === 'diagrams' ? (
        <DiagramVisual />
      ) : (
        <HealthcareVisual />
      )}
    </div>
  );
}
