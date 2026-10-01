import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BrainCircuit,
  Check,
  CheckCheck,
  ChevronRight,
  Code2,
  Copy,
  Database,
  GitBranch,
  Github,
  HeartPulse,
  Linkedin,
  Mail,
  Menu,
  MousePointer2,
  Network,
  Plus,
  ScanEye,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
} from 'lucide-react';

const icons = {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BrainCircuit,
  Check,
  CheckCheck,
  ChevronRight,
  Code2,
  Copy,
  Database,
  GitBranch,
  Github,
  HeartPulse,
  Linkedin,
  Mail,
  Menu,
  MousePointer2,
  Network,
  Plus,
  ScanEye,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
};

export type IconName = keyof typeof icons;

export default function Icon({
  name,
  size = 20,
  className = '',
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      strokeWidth={1.6}
      aria-hidden='true'
      className={className}
    />
  );
}
