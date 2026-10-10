import {
  MarkerType,
  Position,
  type BuiltInEdge,
  type Node,
  type NodeHandle,
} from '@xyflow/react';
import type { IconName } from '../components/Icons';
import type { ProjectId } from './portfolio';

export type DiagramNode = Node<
  {
    name: string;
    detail: string;
    icon: IconName;
    emphasized?: boolean;
    ports: NodeHandle[];
  },
  'portfolio'
>;

export function diagramGraph(project: ProjectId, width = 430) {
  const gap = width < 340 ? 16 : 26;
  const height = width < 340 ? 120 : 110;
  const column = (width - gap * 2) / 3;
  const nodes: DiagramNode[] = [];
  const edges: BuiltInEdge[] = [];
  function node(
    id: string,
    name: string,
    detail: string,
    icon: IconName,
    x: number,
    y: number,
    w = column,
    emphasized = false,
  ) {
    const positions = [
      Position.Top,
      Position.Right,
      Position.Bottom,
      Position.Left,
    ];
    const ports = positions.map((position) => ({
      id: position,
      type: 'source' as const,
      position,
      width: 1,
      height: 1,
      x:
        position === Position.Left
          ? -0.5
          : position === Position.Right
            ? w - 0.5
            : w / 2 - 0.5,
      y:
        position === Position.Top
          ? -0.5
          : position === Position.Bottom
            ? height - 0.5
            : height / 2 - 0.5,
    }));
    nodes.push({
      id,
      type: 'portfolio',
      position: { x, y },
      width: w,
      height,
      data: { name, detail, icon, emphasized, ports },
      handles: ports,
    });
  }
  function edge(
    source: string,
    target: string,
    sourceHandle = Position.Right,
    targetHandle = Position.Left,
    bidirectional = false,
  ) {
    const marker = {
      type: MarkerType.Arrow,
      color: '#809bc4',
      width: 16,
      height: 16,
    };
    edges.push({
      id: `${source}-${target}`,
      source,
      target,
      sourceHandle,
      targetHandle,
      type: 'smoothstep',
      pathOptions: { borderRadius: 10, offset: 12 },
      markerEnd: marker,
      markerStart: bidirectional ? marker : undefined,
      style: { stroke: '#809bc4', strokeWidth: 1.2 },
    });
  }
  if (project === 'integration') {
    node(
      'browser',
      'Browser',
      'Configure the flow',
      'SlidersHorizontal',
      column + gap,
      0,
    );
    node(
      'source',
      'Source data',
      'Connected databases',
      'Database',
      0,
      height + gap,
    );
    node(
      'etl',
      'ETL',
      'Extract · transform · load',
      'Code2',
      column + gap,
      height + gap,
    );
    node(
      'target',
      'Target',
      'Prepared data',
      'Database',
      2 * (column + gap),
      height + gap,
    );
    edge('browser', 'etl', Position.Bottom, Position.Top);
    edge('source', 'etl');
    edge('etl', 'target');
  } else if (project === 'analytics') {
    node('browser', 'Browser', 'Explore results', 'ScanEye', 0, 0);
    node(
      'access',
      'Access',
      'Identity & API routing',
      'ShieldCheck',
      column + gap,
      0,
    );
    node(
      'analysis',
      'Analysis',
      'Python & statistics',
      'BrainCircuit',
      2 * (column + gap),
      0,
    );
    node('source', 'Source data', 'Plant data', 'Database', 0, height + gap);
    node(
      'prepare',
      'Prepare',
      'ETL → graph data',
      'GitBranch',
      column + gap,
      height + gap,
    );
    node(
      'storage',
      'Storage',
      'Data · cache · reports',
      'Server',
      2 * (column + gap),
      height + gap,
    );
    const analysis = nodes.find((n) => n.id === 'analysis')!;
    // Keep incoming prepared data separate from the outgoing storage connection.
    analysis.handles!.push({
      id: 'prepared',
      type: 'source',
      position: Position.Bottom,
      width: 1,
      height: 1,
      x: column / 4 - 0.5,
      y: height - 0.5,
    });
    edge('browser', 'access');
    edge('access', 'analysis');
    edge('analysis', 'storage', Position.Bottom, Position.Top);
    edge('source', 'prepare');
    // Route prepared data through the row gap into analysis, clear of both cards.
    edge('prepare', 'analysis', Position.Top, Position.Bottom);
    edges[edges.length - 1].targetHandle = 'prepared';
  } else {
    const clientWidth = (width - gap) / 2;
    node(
      'client-a',
      'Collaborator A',
      'Browser canvas',
      'Network',
      0,
      0,
      clientWidth,
    );
    node(
      'client-b',
      'Collaborator B',
      'Browser canvas',
      'Network',
      clientWidth + gap,
      0,
      clientWidth,
    );
    node(
      'live',
      'Live collaboration',
      'WebSocket · Yjs shared state',
      'GitBranch',
      0,
      height + gap,
      width,
      true,
    );
    node(
      'database',
      'Asset database',
      'Persisted model',
      'Database',
      width / 8,
      2 * (height + gap),
      width * 0.75,
    );
    // Separate incoming handles keep the two collaborator paths distinct.
    const live = nodes.find((n) => n.id === 'live')!;
    live.handles = live.handles!.filter((h) => h.position !== Position.Top);
    live.handles.push(
      ...['a', 'b'].map((id, i) => ({
        id,
        type: 'source' as const,
        position: Position.Top,
        width: 1,
        height: 1,
        x: (i === 0 ? clientWidth / 2 : width - clientWidth / 2) - 0.5,
        y: -0.5,
      })),
    );
    live.data.ports = live.handles;
    for (const id of ['a', 'b']) {
      edge(`client-${id}`, 'live', Position.Bottom, Position.Top, true);
      edges[edges.length - 1].targetHandle = id;
    }
    edge('live', 'database', Position.Bottom, Position.Top);
  }
  return {
    nodes,
    edges,
    width,
    height:
      (project === 'modeler' ? 3 : 2) * height +
      (project === 'modeler' ? 2 : 1) * gap,
  };
}
