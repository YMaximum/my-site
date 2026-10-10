import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { ConnectionMode, ReactFlow } from '@xyflow/react';
import type { ProjectId } from '../data/portfolio';
import { diagramGraph } from '../data/diagrams';
import { diagramNodeTypes } from './diagramNodeTypes';
import Icon from './Icons';

export default function SystemDiagram({ project }: { project: ProjectId }) {
  const stage = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(430);
  const graph = useMemo(() => diagramGraph(project, width), [project, width]);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width);
    });
    observer.observe(stage.current!);
    return () => observer.disconnect();
  }, []);
  return (
    <figure className={`system-diagram system-${project}`}>
      <figcaption>
        <Icon name='GitBranch' size={16} /> System flow{' '}
        <span>Simplified view</span>
      </figcaption>
      <div
        ref={stage}
        className='inline-system-flow'
        style={
          {
            aspectRatio: `${graph.width} / ${graph.height}`,
            '--graph-width': `${graph.width}px`,
          } as CSSProperties
        }
      >
        <ReactFlow
          id={`inline-${project}`}
          nodes={graph.nodes}
          edges={graph.edges}
          nodeTypes={diagramNodeTypes}
          connectionMode={ConnectionMode.Loose}
          width={graph.width}
          height={graph.height}
          style={{ width: '100%', height: '100%' }}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          disableKeyboardA11y
          proOptions={{ hideAttribution: true }}
        />
      </div>
      {project === 'analytics' && (
        <p className='flow-boundary'>
          Application &amp; storage run in separate layers
        </p>
      )}
    </figure>
  );
}
