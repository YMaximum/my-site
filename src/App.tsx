import { useEffect, useRef, useState } from 'react';
import Icon from './components/Icons';
import MotionEffects from './components/MotionEffects';
import { useMotionPreference } from './hooks/useMotionPreference';
import ProjectDialog from './components/ProjectDialog';
import ProjectVisual from './components/ProjectVisual';
import Workflow from './components/Workflow';
import { experiences, profile, projects, workflow } from './data/portfolio';
import type { ProjectId } from './data/portfolio';

const navigation = [
  { id: 'work', label: 'Work' },
  { id: 'approach', label: 'Approach' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

function readPageState() {
  const parameters = new URLSearchParams(window.location.search);
  const stage = workflow.findIndex(
    (step) => step.id === parameters.get('stage'),
  );
  const project = projects.find(
    (item) => item.id === parameters.get('project'),
  );
  return { stage: Math.max(stage, 0), project: project?.id ?? null };
}

export default function App() {
  const { motionEnabled, reducedMotion, toggleMotion } = useMotionPreference();
  const [pageState, setPageState] = useState(readPageState);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const menuButton = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedProject =
    projects.find((project) => project.id === pageState.project) ?? null;
  const flagship = projects[0];

  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    const frame = requestAnimationFrame(() =>
      target.scrollIntoView({ behavior: 'instant' }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onPopState = () => setPageState(readPageState());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 },
    );
    navigation.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  function updatePageState(
    patch: Partial<typeof pageState>,
    mode: 'push' | 'replace' = 'replace',
  ) {
    const next = { ...pageState, ...patch };
    const url = new URL(window.location.href);
    if (next.project) url.searchParams.set('project', next.project);
    else url.searchParams.delete('project');
    if (next.stage > 0) url.searchParams.set('stage', workflow[next.stage].id);
    else url.searchParams.delete('stage');
    if (mode === 'push') window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
    setPageState(next);
  }

  function openProject(id: ProjectId) {
    updatePageState({ project: id }, 'push');
  }

  function closeProject() {
    if (pageState.project) updatePageState({ project: null });
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus('Email address copied.');
    } catch {
      setCopyStatus('Copy is unavailable. You can use the email link instead.');
    }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyStatus(''), 5000);
  }

  return (
    <div
      id='top'
      className='portfolio'
      data-motion={motionEnabled ? 'on' : 'off'}
    >
      <MotionEffects enabled={motionEnabled} />
      <a href='#main' className='skip-link'>
        Skip to content
      </a>
      <header
        className='site-header'
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false);
            menuButton.current?.focus();
          }
        }}
      >
        <div className='container header-inner'>
          <a
            className='identity'
            href='#top'
            aria-label='Naufal Yassar, back to top'
          >
            <span className='monogram' aria-hidden='true'>
              ny
              <span />
            </span>
            <span>
              Naufal Yassar<small>Full-stack engineer</small>
            </span>
          </a>
          <button
            ref={menuButton}
            className='icon-button menu-toggle'
            aria-expanded={menuOpen}
            aria-controls='main-navigation'
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={23} />
          </button>
          <nav
            id='main-navigation'
            className={`main-navigation ${menuOpen ? 'is-open' : ''}`}
            aria-label='Main navigation'
          >
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={
                  activeSection === item.id ? 'location' : undefined
                }
                onClick={() => {
                  setMenuOpen(false);
                  setActiveSection(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            className='icon-button motion-toggle'
            onClick={toggleMotion}
            disabled={reducedMotion}
            aria-label={
              reducedMotion
                ? 'Motion reduced by your system preference'
                : motionEnabled
                  ? 'Pause motion'
                  : 'Enable motion'
            }
            aria-pressed={motionEnabled}
            title={
              reducedMotion
                ? 'Your reduced-motion preference is active'
                : motionEnabled
                  ? 'Pause motion'
                  : 'Enable motion'
            }
          >
            <Icon name={motionEnabled ? 'Pause' : 'Play'} size={18} />
          </button>
          <a
            className='header-github'
            href={profile.github}
            target='_blank'
            rel='noreferrer'
            aria-label='Naufal Yassar on GitHub'
          >
            <Icon name='Github' size={20} />
          </a>
        </div>
      </header>

      <main id='main'>
        <section className='hero container' aria-labelledby='hero-title'>
          <div className='hero-main'>
            <p className='hero-context'>
              <span className='context-dot' /> Engineering with a product
              mindset
            </p>
            <h1 id='hero-title'>
              I build products.
              <br />
              And better ways
              <br />
              to build them.
            </h1>
            <a className='hero-link' href='#work'>
              Explore my work{' '}
              <span>
                <Icon name='ArrowDown' size={20} />
              </span>
            </a>
          </div>
          <div className='hero-aside'>
            <div className='ownership-mark' aria-hidden='true'>
              <Icon name='GitBranch' size={38} />
              <span className='mark-dot dot-a' />
              <span className='mark-dot dot-b' />
            </div>
            <p>
              Hi, I'm Naufal. I take ideas from the first question to a working
              product, with care for everything in between.
            </p>
            <p className='secondary-text'>
              From UX and code to testing and deployment. Now bringing practical
              AI workflows into how my team builds.
            </p>
            <a className='text-link' href='#approach'>
              A little more about how I work{' '}
              <Icon name='ArrowUpRight' size={17} />
            </a>
          </div>
          <div className='hero-footer'>
            <span>
              <Icon name='Target' size={17} /> Think like a product owner
            </span>
            <span>
              <Icon name='Code2' size={17} /> Follow through to delivery
            </span>
            <span>
              <Icon name='BrainCircuit' size={17} /> Find better ways with AI
            </span>
          </div>
        </section>

        <section
          id='work'
          className='work-section section container'
          aria-labelledby='work-title'
        >
          <div className='section-heading' data-reveal>
            <div>
              <h2 id='work-title'>Selected work</h2>
              <p>Different problems. The same sense of ownership.</p>
            </div>
            <a
              className='text-link section-side-link'
              href={profile.github}
              target='_blank'
              rel='noreferrer'
            >
              More on GitHub <Icon name='ArrowUpRight' size={17} />
            </a>
          </div>
          <article className='flagship-project' data-reveal>
            <div className='flagship-copy'>
              <span className='project-category'>{flagship.category}</span>
              <h3>{flagship.title}</h3>
              <p>{flagship.summary}</p>
              <div className='project-role'>
                <span>My focus</span>
                <p>
                  Product thinking, operator UX,
                  <br />
                  full-stack development & delivery.
                </p>
              </div>
              <ul className='tech-list' aria-label='Technologies'>
                {flagship.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <button
                className='button button-primary'
                onClick={() => openProject(flagship.id)}
              >
                Read the case study <Icon name='ArrowUpRight' size={18} />
              </button>
            </div>
            <ProjectVisual project='integration' />
          </article>
          <div className='operations-note' data-reveal>
            <span className='operations-icon'>
              <Icon name='Server' size={24} />
            </span>
            <div>
              <h3>Ownership beyond the code</h3>
              <p>
                I also handle client on-premise deployments and manage our
                company’s on-premise servers. Delivery includes the environment
                where the product actually runs.
              </p>
            </div>
          </div>
          <div className='project-grid'>
            {projects.slice(1).map((project) => (
              <article
                className='secondary-project'
                key={project.id}
                data-reveal
              >
                <ProjectVisual project={project.id} />
                <div className='secondary-project-copy'>
                  <span className='project-category'>{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <ul className='tech-list' aria-label='Technologies'>
                    {project.technologies.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  <div className='project-actions'>
                    <button
                      className='text-button'
                      onClick={() => openProject(project.id)}
                      aria-label={`Read the ${project.category.toLowerCase()} case study`}
                    >
                      Explore the project <Icon name='ArrowUpRight' size={17} />
                    </button>
                    {project.repository && (
                      <a
                        className='icon-button'
                        href={project.repository}
                        target='_blank'
                        rel='noreferrer'
                        aria-label={`View the ${project.category.toLowerCase()} source on GitHub`}
                      >
                        <Icon name='Github' size={19} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id='approach'
          className='approach-section section'
          aria-labelledby='approach-title'
        >
          <div className='container'>
            <div className='approach-intro' data-reveal>
              <div>
                <span className='section-note'>
                  <Icon name='BrainCircuit' size={18} /> A better way to build
                </span>
                <h2 id='approach-title'>
                  AI on the team.
                  <br />
                  Ownership stays with me.
                </h2>
              </div>
              <div>
                <p>
                  I've put together a personal team in Claude Code: different
                  roles for brainstorming, planning, building, reviewing, and
                  testing, all the way through deployment.
                </p>
                <p className='secondary-text'>
                  That experiment led to a bigger question at work: how can our
                  product team use AI well? I'm learning by building, testing,
                  and sharing what works.
                </p>
              </div>
            </div>
            <Workflow
              stage={pageState.stage}
              onStageChange={(stage) => updatePageState({ stage })}
            />
            <p className='approach-footnote'>
              <Icon name='GitBranch' size={16} /> A workflow I use and keep
              improving, with human decisions at every stage.
            </p>
          </div>
        </section>

        <section
          id='experience'
          className='experience-section section container'
          aria-labelledby='experience-title'
        >
          <div className='experience-intro' data-reveal>
            <h2 id='experience-title'>
              Built on experience.
              <br />
              Driven by curiosity.
            </h2>
            <p className='secondary-text'>
              Each role has widened my view of what it takes to build a useful
              product.
            </p>
            <a
              className='text-link'
              href={profile.linkedin}
              target='_blank'
              rel='noreferrer'
            >
              Connect on LinkedIn <Icon name='ArrowUpRight' size={17} />
            </a>
          </div>
          <div className='experience-list'>
            {experiences.map((experience, index) => (
              <article
                className='experience-item'
                key={`${experience.company}-${experience.start}`}
                data-reveal
              >
                <div
                  className={`experience-marker ${index === 0 ? 'is-current' : ''}`}
                  aria-hidden='true'
                />
                <div className='experience-period'>
                  {experience.start} — {experience.end}
                </div>
                <h3>{experience.company}</h3>
                <p className='experience-role'>
                  {experience.role}
                  <span>{experience.type}</span>
                </p>
                <p className='experience-description'>
                  {experience.description}
                </p>
                {experience.technologies && (
                  <ul
                    className='tech-list experience-stack'
                    aria-label='Tools I work with'
                  >
                    {experience.technologies.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        <section
          className='exploring-section container'
          aria-labelledby='exploring-title'
        >
          <div className='exploring-heading' data-reveal>
            <span className='exploring-icon'>
              <Icon name='Sparkles' size={21} />
            </span>
            <div>
              <h2 id='exploring-title'>On my workbench</h2>
              <p>Things I'm learning and exploring next.</p>
            </div>
          </div>
          <div className='exploring-grid' data-reveal>
            <article>
              <Icon name='Network' size={22} />
              <div>
                <h3>AI that connects to real work</h3>
                <p>
                  Exploring OpenClaw and scoped access to company resources, so
                  information is easier for the team to reach.
                </p>
                <span className='exploration-status'>Exploring</span>
              </div>
            </article>
            <article>
              <Icon name='Server' size={22} />
              <div>
                <h3>A small home for automation</h3>
                <p>
                  Setting up a VPS as a place to learn and experiment with
                  useful daily automations.
                </p>
                <span className='exploration-status'>Learning & planning</span>
              </div>
            </article>
          </div>
        </section>

        <section
          id='contact'
          className='contact-section section container'
          aria-labelledby='contact-title'
        >
          <div className='contact-heading' data-reveal>
            <span className='section-note'>Keep the conversation going</span>
            <h2 id='contact-title'>
              Let's build
              <br />
              something useful.
            </h2>
            <p>
              Have a product problem, an idea, or a good question about working
              with AI? I'd enjoy hearing it.
            </p>
          </div>
          <div className='contact-links'>
            <div className='email-row'>
              <a href={`mailto:${profile.email}`} className='email-link'>
                {profile.email}
                <Icon name='ArrowUpRight' size={21} />
              </a>
              <button
                className='icon-button copy-button'
                aria-label='Copy email address'
                onClick={() => void copyEmail()}
              >
                <Icon
                  name={
                    copyStatus === 'Email address copied.' ? 'Check' : 'Copy'
                  }
                  size={18}
                />
              </button>
            </div>
            <p className='copy-status' role='status'>
              {copyStatus}
            </p>
            <div className='social-links'>
              <a href={profile.github} target='_blank' rel='noreferrer'>
                <Icon name='Github' size={19} /> GitHub{' '}
                <Icon name='ArrowUpRight' size={15} />
              </a>
              <a href={profile.linkedin} target='_blank' rel='noreferrer'>
                <Icon name='Linkedin' size={19} /> LinkedIn{' '}
                <Icon name='ArrowUpRight' size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className='site-footer container'>
        <p>© {new Date().getFullYear()} Naufal Yassar</p>
        <a href={profile.source} target='_blank' rel='noreferrer'>
          Built with care. View source <Icon name='ArrowUpRight' size={14} />
        </a>
        <a className='back-to-top' href='#top'>
          Back to top <Icon name='ArrowUp' size={16} />
        </a>
      </footer>
      <ProjectDialog
        project={selectedProject}
        onClose={closeProject}
        motionEnabled={motionEnabled}
      />
    </div>
  );
}
