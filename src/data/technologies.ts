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
  siClaude,
  siGo,
  siNodedotjs,
  siMongodb,
  siGit,
  siGithubactions,
  siJenkins,
  type SimpleIcon,
} from 'simple-icons';

export const technologies: Record<string, { icon?: SimpleIcon; tint: string }> =
  {
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
    Go: { icon: siGo, tint: '#85cadb' },
    'Node.js': { icon: siNodedotjs, tint: '#a2d4ad' },
    MongoDB: { icon: siMongodb, tint: '#a2d4ad' },
    Git: { icon: siGit, tint: '#e8b28e' },
    'GitHub Actions': { icon: siGithubactions, tint: '#9bbdf5' },
    Jenkins: { icon: siJenkins, tint: '#d5b8af' },
    'Claude Code': { icon: siClaude, tint: '#e7b49e' },
    Codex: { tint: '#a4d8cc' },
  };

export function techStyle(name: string): CSSProperties {
  return { '--tech-tint': technologies[name].tint } as CSSProperties;
}
