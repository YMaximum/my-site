export const profile = {
  name: 'Naufal Yassar',
  email: 'yassarnaufal@gmail.com',
  github: 'https://github.com/YMaximum',
  linkedin: 'https://www.linkedin.com/in/nyassar/',
  source: 'https://github.com/YMaximum/my-site',
};

export type ProjectId = 'integration' | 'diagrams' | 'obatin';

export interface Project {
  id: ProjectId;
  title: string;
  category: string;
  summary: string;
  technologies: string[];
  repository?: string;
  context: string;
  contribution: string;
  decisions: { title: string; description: string }[];
  outcome: string;
}

export const projects: Project[] = [
  {
    id: 'integration',
    title: 'Making complex data usable.',
    category: 'Enterprise product',
    summary:
      'A data integration product that helps operators connect sources, shape data, and understand a load before running it.',
    technologies: ['React', 'Python', 'PostgreSQL', 'Docker'],
    context:
      'Data integration involves more than moving rows. Operators need to understand their sources, configure mappings, see what will change, and run the product in their own environment.',
    contribution:
      'My work spans product decisions, operator interfaces, backend behavior, testing, and deployment tooling. I use an AI-assisted development workflow while taking responsibility for the decisions and the result.',
    decisions: [
      {
        title: 'Make the next step clear.',
        description:
          'I worked on mapping, catalogs, pagination, and scheduling interfaces so the product follows the way an operator works.',
      },
      {
        title: 'Show what a load would do.',
        description:
          'I contributed to a preview that compares a proposed load with its target, making the effect of an operation easier to inspect before proceeding.',
      },
      {
        title: 'Own the path to installation.',
        description:
          'I worked on installation tooling and deployment configuration for on-premise environments, including operating constraints beyond a local development setup.',
      },
    ],
    outcome:
      'Operators can configure reusable data sources, inspect proposed changes, and use dedicated installation tooling. This summary describes my contributions without exposing company or client infrastructure.',
  },
  {
    id: 'diagrams',
    title: 'A shared space for ideas.',
    category: 'Collaboration experiment',
    summary:
      'An exploration of collaborative diagramming with shared nodes, live cursors, and session-based chat.',
    technologies: ['Next.js', 'React Flow', 'Yjs', 'NestJS'],
    repository: 'https://github.com/YMaximum/simple-diagrams-collaboration',
    context:
      'A diagram is useful when people can work on it together. This project explores a shared canvas alongside the conversations that give a diagram meaning.',
    contribution:
      'I explored connecting a React Flow canvas to shared Yjs state, with a NestJS and WebSocket backend for collaboration sessions.',
    decisions: [
      {
        title: 'Give the canvas one shared state.',
        description:
          'Node and edge changes are reflected in Yjs maps, with observers updating the rendered canvas.',
      },
      {
        title: 'Keep collaboration in context.',
        description:
          'The project includes session-based chat and cursor presence alongside the diagram rather than in a separate tool.',
      },
    ],
    outcome:
      'The repository brings together a shared canvas, collaboration sessions, and chat. It is an experiment in real-time product behavior, rather than a claim of a production service.',
  },
  {
    id: 'obatin',
    title: 'Connecting care and commerce.',
    category: 'Healthcare team project',
    summary:
      'A healthcare platform bringing consultation and pharmacy commerce into one product, with a Go backend and React frontend.',
    technologies: ['Go', 'Next.js', 'PostgreSQL', 'Docker'],
    repository: 'https://github.com/YMaximum/obatin-healthcare-platform',
    context:
      'Healthcare products connect several different journeys: finding care, managing consultation, ordering products, and supporting the people operating the platform.',
    contribution:
      'I contributed to this team project. The repository covers the frontend, Go backend, database, and deployment setup; it represents collaborative work rather than sole authorship.',
    decisions: [
      {
        title: 'Model different product journeys.',
        description:
          'The application separates user, doctor, partner, and administrator experiences, with consultation and pharmacy workflows.',
      },
      {
        title: 'Build across the product boundary.',
        description:
          'The project combines a React frontend, a Go/Gin API, PostgreSQL, and Docker/Nginx infrastructure.',
      },
    ],
    outcome:
      'A full-stack team project covering consultation and commerce workflows. The public repository provides the implementation for closer inspection.',
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
    role: 'Backend Engineer',
    type: 'Contract',
    start: 'Aug 2024',
    end: 'Present',
    description:
      'Building products around users’ needs, maintaining on-premise systems, and contributing across interfaces, backend services, testing, and deployment. Now exploring practical AI adoption for the product team.',
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
