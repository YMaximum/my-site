import { Code2 } from 'lucide-react';
import { technologies, techStyle } from '../data/technologies';

export function TechnologyMark({ name }: { name: string }) {
  const tech = technologies[name];
  return (
    <>
      {tech.icon ? (
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <path d={tech.icon.path} />
        </svg>
      ) : (
        <Code2 size={16} aria-hidden='true' />
      )}
      <span>{name}</span>
    </>
  );
}

export default function TechTags({
  technologies: names,
  label = 'Technologies',
}: {
  technologies: string[];
  label?: string;
}) {
  return (
    <ul className='tech-tags' aria-label={label}>
      {names.map((name) => (
        <li key={name} style={techStyle(name)}>
          <TechnologyMark name={name} />
        </li>
      ))}
    </ul>
  );
}
