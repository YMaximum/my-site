import type { ProjectId } from '../data/portfolio';
import Icon, { type IconName } from './Icons';

function Node({
  name,
  detail,
  icon,
  className = '',
}: {
  name: string;
  detail: string;
  icon: IconName;
  className?: string;
}) {
  return (
    <div className={`flow-node ${className}`}>
      <Icon name={icon} size={20} />
      {className.includes('bidirectional') && (
        <i className='flow-return' aria-hidden='true' />
      )}
      {className.includes('arrow-') && (
        <i className='flow-pulse' aria-hidden='true' />
      )}
      <strong>{name}</strong>
      <span>{detail}</span>
    </div>
  );
}

export default function SystemDiagram({ project }: { project: ProjectId }) {
  return (
    <figure className={`system-diagram system-${project}`}>
      <figcaption>
        <Icon name='GitBranch' size={16} /> System flow{' '}
        <span>Simplified view</span>
      </figcaption>
      {project === 'integration' && (
        <div className='flow-grid integration-flow'>
          <Node
            name='Browser'
            detail='Configure the flow'
            icon='SlidersHorizontal'
            className='flow-workspace arrow-down'
          />
          <Node
            name='Source data'
            detail='Connected databases'
            icon='Database'
            className='flow-source arrow-right'
          />
          <Node
            name='ETL'
            detail='Extract · transform · load'
            icon='Code2'
            className='flow-processing arrow-right'
          />
          <Node
            name='Target'
            detail='Prepared data'
            icon='Database'
            className='flow-target'
          />
        </div>
      )}
      {project === 'analytics' && (
        <div className='flow-grid analytics-flow'>
          <Node
            name='Browser'
            detail='Explore results'
            icon='ScanEye'
            className='flow-browser arrow-right'
          />
          <Node
            name='Access'
            detail='Identity & API routing'
            icon='ShieldCheck'
            className='flow-access arrow-right'
          />
          <Node
            name='Analysis'
            detail='Python & statistics'
            icon='BrainCircuit'
            className='flow-analysis arrow-down'
          />
          <Node
            name='Source data'
            detail='Plant data'
            icon='Database'
            className='flow-source arrow-right'
          />
          <Node
            name='Prepare'
            detail='ETL → graph data'
            icon='GitBranch'
            className='flow-preparation arrow-right'
          />
          <Node
            name='Storage'
            detail='Data · cache · reports'
            icon='Server'
            className='flow-storage'
          />
          <span className='flow-boundary'>
            Application & storage run in separate layers
          </span>
        </div>
      )}
      {project === 'modeler' && (
        <div className='flow-grid modeler-flow'>
          <Node
            name='Collaborator A'
            detail='Browser canvas'
            icon='Network'
            className='flow-client-a arrow-down bidirectional'
          />
          <Node
            name='Collaborator B'
            detail='Browser canvas'
            icon='Network'
            className='flow-client-b arrow-down bidirectional'
          />
          <Node
            name='Live collaboration'
            detail='WebSocket · Yjs shared state'
            icon='GitBranch'
            className='flow-live arrow-down'
          />
          <Node
            name='Asset database'
            detail='Persisted model'
            icon='Database'
            className='flow-persisted'
          />
        </div>
      )}
    </figure>
  );
}
