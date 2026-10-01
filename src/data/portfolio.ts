export const profile = {
  name: 'Naufal Yassar',
  email: 'yassarnaufal@gmail.com',
  github: 'https://github.com/YMaximum',
  linkedin: 'https://www.linkedin.com/in/nyassar/',
  source: 'https://github.com/YMaximum/my-site',
};

export type ProjectId = 'integration' | 'analytics' | 'modeler';

export interface Project {
  id: ProjectId;
  title: string;
  category: string;
  association: string;
  summary: string;
  technologies: string[];
  architecture: string;
}

export const projects: Project[] = [
  {
    id: 'integration',
    title: 'Data integration platform',
    category: 'Connect & prepare',
    association: 'Biaenergi',
    summary:
      'Brings data from different sources into a usable destination, helping teams prepare reliable data for their work.',
    technologies: ['React', 'Python', 'PostgreSQL', 'Docker'],
    architecture:
      'A web interface configures backend processing that reads source data, transforms it, and loads a target database.',
  },
  {
    id: 'analytics',
    title: 'Industrial analytics platform',
    category: 'Analyze & understand',
    association: 'Biaenergi',
    summary:
      'Turns operational data into statistical insights so teams can understand performance and make informed decisions.',
    technologies: ['Next.js', 'Python', 'pandas', 'NumPy', 'Docker'],
    architecture:
      'An authenticated web app routes requests to analytical services. Source data is prepared as a graph for analysis; separate storage holds data, cached results, and reports.',
  },
  {
    id: 'modeler',
    title: 'Collaborative asset editor',
    category: 'Model & collaborate',
    association: 'Biaenergi',
    summary:
      'A shared diagram workspace for teams to model industrial assets and their relationships together in real time.',
    technologies: ['React', 'TypeScript', 'Socket.IO', 'NestJS'],
    architecture:
      'Browser canvases exchange updates with a WebSocket backend. Yjs shared documents synchronize changes across collaborators, while a database persists the asset model.',
  },
];

export const workflow = [
  {
    id: 'brainstorm',
    title: 'Brainstorm',
    heading: 'Start with the right problem.',
    description:
      'Before asking AI to build anything, I work through the user’s problem, constraints, and what a useful result would look like.',
    human: 'Set the direction and challenge the assumptions.',
    ai: 'Explore alternatives and surface questions I may have missed.',
  },
  {
    id: 'plan',
    title: 'Plan',
    heading: 'Turn the idea into clear work.',
    description:
      'I break the direction into focused tickets, settle the important decisions, and make the expected behavior clear before implementation.',
    human: 'Choose the scope, priorities, and acceptance criteria.',
    ai: 'Help organize tickets, dependencies, and implementation plans.',
  },
  {
    id: 'build',
    title: 'Build',
    heading: 'Make something that works.',
    description:
      'With Claude Code, I use an implementer role to work through the plan while I stay involved in product choices and integration.',
    human: 'Own the product behavior and resolve tradeoffs.',
    ai: 'Implement scoped changes with the relevant project context.',
  },
  {
    id: 'review',
    title: 'Review',
    heading: 'Give the work a second look.',
    description:
      'A separate reviewer role challenges the implementation. I also work on integrating AI-assisted reviews into the team’s development workflow.',
    human: 'Assess the feedback and decide what needs to change.',
    ai: 'Look for defects, missed requirements, and maintainability issues.',
  },
  {
    id: 'test',
    title: 'Test',
    heading: 'Check the result, not just the code.',
    description:
      'I treat testing as part of product ownership: examine the expected behavior, important edge cases, and the experience a user will have.',
    human: 'Check that the result solves the original problem.',
    ai: 'Help investigate failures and exercise the behavior.',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    heading: 'Follow through to delivery.',
    description:
      'The workflow continues through deployment. I take responsibility for the environment, the release, and what needs attention afterward.',
    human: 'Own the release decisions and follow-up.',
    ai: 'Support deployment preparation and troubleshooting.',
  },
] as const;

export const experiences = [
  {
    company: 'Biaenergi',
    role: 'Full-stack Software Engineer',
    type: 'Full-time',
    start: 'Jul 2025',
    end: 'Present',
    description:
      'Build data integration and analytics products, spanning UX, full-stack development, and testing. Initiated the system design and early development of a collaborative asset editor. Bring practical AI workflows into the product team.',
    responsibilities: [
      'Handle client on-premise deployments and company server management, including Windows/Linux VMs and Proxmox high availability.',
      'Improve product performance and maintain delivery pipelines with GitHub Actions and Jenkins.',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Python',
      'Docker',
      'Proxmox',
      'RHEL',
    ],
  },
  {
    company: 'Biaenergi',
    role: 'Backend Engineer',
    type: 'Contract',
    start: 'Aug 2024',
    end: 'Jul 2025',
    description:
      'Developed backend solutions around user needs, investigated reliability issues, and monitored on-premise servers before moving into a full-time role.',
  },
  {
    company: 'Sea Labs Indonesia',
    role: 'Software Engineer Trainee',
    type: 'Internship',
    start: 'Jan 2024',
    end: 'May 2024',
    description:
      'Hands-on engineering with Go, PostgreSQL, React, and Docker. Led the final project team, coordinating milestones and requirements while working with clean architecture and testing.',
  },
  {
    company: 'GoTo Impact Foundation',
    role: 'Full Stack Engineer',
    type: 'Apprenticeship',
    start: 'Jun 2023',
    end: 'Dec 2023',
    description:
      'Full-stack training with the MERN stack, followed by project collaboration with Jabar Digital Service. Built practical experience turning requirements into working software.',
  },
];
