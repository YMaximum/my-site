import { Handle, type NodeProps } from '@xyflow/react';
import type { DiagramNode } from '../data/diagrams';
import Icon from './Icons';

export default function SystemFlowNode({ data }: NodeProps<DiagramNode>) {
  return (
    <>
      <div className={`flow-node${data.emphasized ? ' flow-live' : ''}`}>
        <Icon name={data.icon} size={20} />
        <strong>{data.name}</strong>
        <span>{data.detail}</span>
      </div>
      {data.ports.map((port) => (
        <Handle
          key={port.id}
          type='source'
          position={port.position}
          id={port.id ?? undefined}
          isConnectable={false}
          style={{
            left: port.x + 0.5,
            top: port.y + 0.5,
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </>
  );
}
