import type { CSSProperties } from 'react';
import {
  siReact,
  siPython,
  siPandas,
  siNumpy,
  siNextdotjs,
  siTypescript,
  siDocker,
  siPostgresql,
  siProxmox,
  siRedhat,
  siSocketdotio,
  siNestjs,
  type SimpleIcon,
} from 'simple-icons';

const technologies: Record<string, { icon: SimpleIcon; tint: string }> = {
  React: { icon: siReact, tint: '#80d5ec' },
  Python: { icon: siPython, tint: '#e6cc83' },
  pandas: { icon: siPandas, tint: '#b7a6ee' },
  NumPy: { icon: siNumpy, tint: '#89c5db' },
  'Next.js': { icon: siNextdotjs, tint: '#d8dfec' },
  TypeScript: { icon: siTypescript, tint: '#9bbdf5' },
  Docker: { icon: siDocker, tint: '#87bff2' },
  PostgreSQL: { icon: siPostgresql, tint: '#a7c5e4' },
  Proxmox: { icon: siProxmox, tint: '#e8b28e' },
  RHEL: { icon: siRedhat, tint: '#efa2a9' },
  'Socket.IO': { icon: siSocketdotio, tint: '#c5d6e8' },
  NestJS: { icon: siNestjs, tint: '#eea0ba' },
};

export default function TechTags({
  technologies: names,
  label = 'Technologies',
}: {
  technologies: string[];
  label?: string;
}) {
  return (
    <ul className='tech-tags' aria-label={label}>
      {names.map((name) => {
        const tech = technologies[name];
        return (
          <li key={name} style={{ '--tech-tint': tech.tint } as CSSProperties}>
            <svg viewBox='0 0 24 24' aria-hidden='true'>
              <path d={tech.icon.path} />
            </svg>
            {name}
          </li>
        );
      })}
    </ul>
  );
}
