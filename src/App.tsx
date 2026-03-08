import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { personalInfo, projects, services } from './data';
import { TypewriterEffect } from './components/ui/typewriter-effect';
import { GlowingEffect } from './components/ui/glowing-effect';
import { CtaCard } from './components/cta-card';
import './styles.css';

// ─── Stack icon definitions ────────────────────────────────────────────────
const STACK_ICONS = [
  { key: 'react',      slug: 'react',       label: 'React' },
  { key: 'ts',         slug: 'typescript',  label: 'TypeScript' },
  { key: 'js',         slug: 'javascript',  label: 'JavaScript' },
  { key: 'html',       slug: 'html5',       label: 'HTML5' },
  { key: 'css',        slug: 'css3',        label: 'CSS3' },
  { key: 'mysql',      slug: 'mysql',       label: 'MySQL' },
  { key: 'oracle',     slug: 'oracle',      label: 'Oracle' },
  { key: 'csharp',     slug: 'csharp',      label: 'C#' },
  { key: 'git',        slug: 'git',         label: 'Git' },
  { key: 'github',     slug: 'github',      label: 'GitHub' },
  { key: 'vite',       slug: 'vite',        label: 'Vite' },
  { key: 'tailwind',   slug: 'tailwindcss', label: 'Tailwind' },
];

// Two full copies
const FULL_TRACK = [
  ...STACK_ICONS.map((s) => ({ ...s, uid: `a-${s.key}` })),
  ...STACK_ICONS.map((s) => ({ ...s, uid: `b-${s.key}` })),
];

// ─── Icon tile ─────────────────────────────────────────────────────────────
interface IconTileProps {
  slug: string;
  label: string;
  uid: string;
  hoveredUid: string | null;
  onEnter: (uid: string) => void;
  onLeave: () => void;
}

function IconTile({ slug, label, uid, hoveredUid, onEnter, onLeave }: IconTileProps) {
  const active = hoveredUid === uid;
  return (
    <div
      onMouseEnter={() => onEnter(uid)}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 64,
        flexShrink: 0,
        margin: '0 20px',
        cursor: 'default',
        zIndex: active ? 10 : 1,
      }}
    >
      <motion.img
        src={`https://cdn.simpleicons.org/${slug}/ffffff`}
        alt={label}
        draggable={false}
        animate={{ scale: active ? 1.2 : 1, opacity: active ? 1 : 0.7 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        style={{ width: 36, height: 36, objectFit: 'contain', display: 'block' }}
        loading="lazy"
      />

      <AnimatePresence>
        {active && (
          <motion.span
            key="lbl"
            initial={{ opacity: 0, y: -5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: -4,  scale: 0.9 }}
            transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute',
              top: '105%',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              background: 'rgba(14,14,14,0.96)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 6,
              padding: '3px 9px',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.09em',
              color: '#ffffff',
              backdropFilter: 'blur(10px)',
            }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Marquee ───────────────────────────────────────────────────────────────
// Pure RAF scroll. Two identical sets side-by-side.
// Once offset reaches -SET_WIDTH we snap back by SET_WIDTH — completely invisible seam.
const ITEM_W   = 64 + 40;              // icon width + total horizontal margin
const SET_W    = STACK_ICONS.length * ITEM_W;
const SPEED    = 0.038;                // px per ms

function StackMarquee() {
  const [hoveredUid, setHoveredUid] = useState<string | null>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const xRef      = useRef(0);
  const lastRef   = useRef<number | null>(null);
  const rafRef    = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => { pausedRef.current = hoveredUid !== null; }, [hoveredUid]);

  useEffect(() => {
    const tick = (now: number) => {
      if (lastRef.current === null) lastRef.current = now;
      const dt = now - lastRef.current;
      lastRef.current = now;

      if (!pausedRef.current) {
        xRef.current -= SPEED * dt;
        if (xRef.current <= -SET_W) xRef.current += SET_W;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${xRef.current}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const onEnter = useCallback((uid: string) => setHoveredUid(uid), []);
  const onLeave = useCallback(() => setHoveredUid(null), []);

  return (
    <div style={{ overflow: 'hidden', paddingBottom: 44 }}>
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: SET_W * 2,
          willChange: 'transform',
        }}
      >
        {FULL_TRACK.map((item) => (
          <IconTile
            key={item.uid}
            uid={item.uid}
            slug={item.slug}
            label={item.label}
            hoveredUid={hoveredUid}
            onEnter={onEnter}
            onLeave={onLeave}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Contact icons (inline SVG, no deps) ──────────────────────────────────
function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2.4"/>
      <polyline points="2,7 12,14 22,7"/>
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
        0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
        -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
        .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
        -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844
        c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
        .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855
        0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017
        C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136
        2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37
        4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065z
        m1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542
        C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0
        22.222 0h.003z"/>
    </svg>
  );
}

const CONTACT_LINKS = [
  { key: 'email',    href: `mailto:${personalInfo.email}`, icon: <MailIcon />,     label: personalInfo.email, display: 'Email',    external: false },
  { key: 'github',   href: personalInfo.github,            icon: <GithubIcon />,   label: 'GitHub',           display: 'GitHub',   external: true  },
  { key: 'linkedin', href: personalInfo.linkedin,          icon: <LinkedinIcon />, label: 'LinkedIn',         display: 'LinkedIn', external: true  },
];

// ─── Project card ─────────────────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  type: string;
  desc: string;
  tech: string[];
  link: string;
}

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${project.title}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block border-t border-line py-[1.2rem] md:py-8 md:pb-[2.4rem] last:border-b transition-all duration-[250ms] md:hover:bg-surface md:hover:pl-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-[64px_minmax(0,1fr)_56px] gap-[0.6rem] md:gap-4 items-start">
        <div className="text-accent text-[0.72rem] md:text-[0.82rem] font-extrabold tracking-[0.14em] md:pt-[0.7rem]">
          {project.id}
        </div>

        <div>
          <h2 className="text-[1.28rem] sm:text-[1.45rem] md:text-[clamp(1.8rem,4vw,3.4rem)] leading-[1] md:leading-[0.95] tracking-[-0.05em] font-black">
            {project.title}
          </h2>
          <p className="mt-[0.45rem] md:mt-[0.65rem] text-muted text-[0.72rem] md:text-[0.82rem] tracking-[0.16em] uppercase">
            {project.type}
          </p>
        </div>

        {/* Arrow circle — rotates 45° and lifts on hover */}
        <motion.div
          animate={{
            y: hovered ? -4 : 0,
            backgroundColor: hovered ? 'rgba(215,255,63,0.08)' : 'transparent',
            borderColor: hovered ? 'rgba(215,255,63,0.22)' : 'rgba(255,255,255,0.1)',
          }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="w-[42px] h-[42px] md:w-[52px] md:h-[52px] border rounded-full grid place-items-center text-[1.1rem] md:text-[1.45rem] mt-[0.2rem] md:mt-0 overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <motion.span
            animate={{ rotate: hovered ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{ display: 'inline-block', lineHeight: 1 }}
          >
            ↗
          </motion.span>
        </motion.div>
      </div>

      <div className="md:ml-[80px] mt-[0.8rem] md:mt-[1.4rem] md:max-w-[860px]">
        <p className="text-muted text-[0.92rem] md:text-base leading-[1.65] md:leading-[1.8]">
          {project.desc}
        </p>
        <div className="flex flex-wrap gap-[0.45rem] md:gap-[0.7rem] mt-[0.9rem] md:mt-[1.2rem]">
          {project.tech.map((item) => (
            <span
              key={item}
              className="border border-line bg-surface-2 py-[0.5rem] md:py-[0.62rem] px-[0.65rem] md:px-[0.9rem] rounded-full text-[0.64rem] md:text-[0.74rem] font-bold tracking-[0.08em] md:tracking-[0.12em] text-fg"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-[0.9rem] md:mt-[1.2rem]">
          <span className="text-[0.74rem] md:text-[0.86rem] font-bold tracking-[0.08em] uppercase text-accent border-b border-transparent transition-all duration-200 group-hover:border-accent group-hover:opacity-85">
            View Project
          </span>
        </div>
      </div>
    </a>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
function App() {
  const [firstName, lastName] = personalInfo.name.split(' ');
  const [hasScrolled, setHasScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 50 && !hasScrolled) setHasScrolled(true);
  });

  return (
    <div className="px-[4vw] md:px-[4vw] max-w-[1280px] mx-auto">

      {/* Header */}
      <header className="sticky top-0 z-20 h-[72px] md:h-[88px] flex justify-between items-center gap-2 md:gap-4 bg-[rgba(10,10,10,0.86)] backdrop-blur-[12px]">
        <a href="#home" className="text-[0.76rem] md:text-[0.9rem] font-black tracking-[0.14em] md:tracking-[0.18em]">
          KG©
        </a>
        <nav className="hidden md:flex gap-[1.2rem] items-center">
          {['about', 'services', 'projects', 'contact'].map((s) => (
            <a key={s} href={`#${s}`}
              className="text-[0.76rem] font-bold tracking-[0.12em] uppercase text-muted transition-colors duration-200 hover:text-fg">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </nav>
        <div>
          <a href="#contact" className="text-[0.66rem] md:text-[0.76rem] font-extrabold tracking-[0.1em] md:tracking-[0.16em] transition-opacity duration-200 hover:opacity-70">
            GET IN TOUCH —
          </a>
        </div>
      </header>

      {/* Hero */}
      <motion.main
        layout
        transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
        className={`flex flex-col justify-center py-2 pb-[2.2rem] md:py-8 md:pb-16 ${
          hasScrolled ? 'min-h-[72vh] md:min-h-[72vh]' : 'min-h-[100svh]'
        }`}
        id="home"
      >
        <motion.div layout className="flex flex-col md:flex-row md:justify-between gap-[0.35rem] md:gap-4 mb-4 md:mb-8 text-[0.62rem] md:text-[0.74rem] tracking-[0.12em] md:tracking-[0.18em] text-muted uppercase">
          <span className="text-accent">● AVAILABLE FOR WORK</span>
          <span>{personalInfo.location}</span>
        </motion.div>

        <motion.h1 layout className="text-[3.7rem] sm:text-[4.4rem] md:text-[clamp(4.6rem,14vw,11rem)] leading-[0.88] md:leading-[0.82] tracking-[-0.07em] md:tracking-[-0.06em] font-black">
          <TypewriterEffect
            cursorClassName="bg-accent"
            words={[
              { text: firstName },
              { text: '\n' },
              { text: lastName, className: 'md:ml-[10vw]' },
            ]}
          />
        </motion.h1>

        <motion.div layout className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-8 mt-4 md:mt-8">
          <div className="md:max-w-[640px]">
            <p className="text-accent text-[0.68rem] md:text-[0.78rem] font-extrabold tracking-[0.12em] md:tracking-[0.18em] mb-[0.7rem] md:mb-4 uppercase">
              {personalInfo.role}
            </p>
            <p className="text-[0.92rem] md:text-base leading-[1.55] md:leading-[1.7] text-muted md:max-w-[520px]">
              {personalInfo.statement}
            </p>
          </div>
        </motion.div>
      </motion.main>

      {/* About */}
      <section className="py-[0.8rem] md:py-16 pb-12 md:pb-24 border-t border-line" id="about">
        <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-4 md:mb-6">ABOUT</div>
        <CtaCard
          imageSrc={personalInfo.image}
          imageAlt="Kristijan Gega"
          title={personalInfo.role}
          subtitle={
            <>
              I am a Computer Science student at VUB focused on building{' '}
              <span className="text-accent">modern, responsive</span> and practical web solutions.
            </>
          }
          description="Specialised in frontend development with React/TypeScript. Strong foundation in backend systems (SQL, C#). Building real-world projects and growing toward freelance opportunities."
          buttonText="View Projects"
          onButtonClick={() => { window.location.href = '#projects'; }}
          secondaryButtonText="Contact"
          onSecondaryButtonClick={() => { window.location.href = '#contact'; }}
          className="border-line bg-surface text-fg [&_img]:grayscale [&_img]:hover:grayscale-0 [&_img]:transition-all [&_img]:duration-700 [&_p.text-sm]:text-accent [&_p.text-sm]:tracking-[0.12em] [&_p.text-sm]:uppercase [&_p.text-sm]:text-[0.7rem] [&_p.text-sm]:font-bold [&_.text-muted-foreground]:text-muted [&_button]:bg-accent [&_button]:text-[#0a0a0a] [&_button]:font-bold [&_button]:tracking-[0.1em] [&_button]:uppercase [&_button]:hover:opacity-90 [&_button]:hover:-translate-y-0.5 [&_button]:transition-all [&_button]:rounded-full [&_.cta-secondary-btn]:!bg-black [&_.cta-secondary-btn]:!text-white [&_.cta-secondary-btn]:!border-white [&_.cta-secondary-btn]:border"
        />
      </section>

      {/* Services */}
      <section className="py-4 pb-16 border-t border-line" id="services">
        <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-4 md:mb-6">SERVICES</div>
        <div className="max-w-[760px] mb-[1.4rem]">
          <p className="text-[0.92rem] md:text-base leading-[1.65] md:leading-[1.8] text-muted">
            I help small businesses, service-based brands and personal projects present themselves
            professionally online through clean, responsive and modern websites.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {services.map((service) => (
            <article key={service.title} className="group relative border border-line bg-surface rounded-[18px] p-5 transition-colors duration-200 hover:bg-surface-2">
              <GlowingEffect disabled={false} spread={30} glow={true} proximity={80} inactiveZone={0.05} borderWidth={2} />
              <div className="relative z-10 transition-transform duration-300">
                <h3 className="text-[0.92rem] md:text-base font-extrabold tracking-[0.08em] mb-[0.8rem]">{service.title}</h3>
                <p className="text-[0.92rem] md:text-[0.95rem] leading-[1.65] md:leading-[1.7] text-muted">{service.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Selected Work */}
      <section className="py-[0.8rem] md:py-4 pb-12 md:pb-24 border-t border-line" id="projects">
        <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-4 md:mb-6">SELECTED WORK</div>
        <div className="flex flex-col">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Stack */}
      <section
        className="py-[0.8rem] md:py-4 pb-12 md:pb-24 border-t border-line"
        style={{ overflow: 'hidden' }}
      >
        <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-4 md:mb-8">
          STACK
        </div>
        <StackMarquee />
      </section>

      {/* Contact */}
      <section className="py-[0.8rem] md:py-4 pb-12 md:pb-24 border-t border-line" id="contact">
        <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-4 md:mb-6">CONTACT</div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-10 items-start">
          {/* Left — heading */}
          <div>
            <h3 className="text-[1.4rem] md:text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.15] tracking-[-0.04em] mb-[0.7rem] md:mb-[0.9rem]">
              Let&apos;s build something useful.
            </h3>
            <p className="text-[0.92rem] md:text-base text-muted leading-[1.65] md:leading-[1.8] max-w-[480px]">
              Open to collaborations and junior opportunities.
            </p>
          </div>

          {/* Right — pill buttons in a row */}
          <div className="flex flex-row flex-wrap items-center gap-3">
            {CONTACT_LINKS.map(({ key, href, icon, label, display, external }) => (
              <motion.a
                key={key}
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                aria-label={label}
                title={label}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 340, damping: 20 }}
                className="inline-flex items-center gap-[0.45rem] border border-line bg-surface hover:bg-surface-2 hover:border-fg/40 text-fg rounded-full pl-[0.75rem] pr-[1rem] py-[0.55rem] text-[0.75rem] md:text-[0.8rem] font-semibold tracking-[0.04em] transition-colors duration-200 select-none"
              >
                <span style={{ opacity: 0.8, display: 'flex', alignItems: 'center' }}>{icon}</span>
                <span>{display}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-[1.3rem] md:py-8 pb-[2.3rem] md:pb-16 text-[0.62rem] md:text-[0.7rem] text-[#5f5f5f] text-center tracking-[0.18em] leading-[1.5] border-t border-line">
        <p>DESIGNED &amp; CODED BY KRISTIJAN GEGA / 2026</p>
      </footer>

    </div>
  );
}

export default App;