import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { personalInfo, projects, services } from './data';
import { TypewriterEffect } from './components/ui/typewriter-effect';
import { GlowingEffect } from './components/ui/glowing-effect';
import { CtaCard } from './components/cta-card';
import { ChevronRight } from 'lucide-react';
import './styles.css';

function FadeIn({ children, delay = 0, className = "", id, style }: { children: React.ReactNode, delay?: number, className?: string, id?: string, style?: React.CSSProperties }) {
  return (
    <motion.section
      id={id}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] flex items-center justify-center overflow-hidden pointer-events-none" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5 }}
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(215,255,63,0.05) 0%, rgba(0,0,0,0) 70%)',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  );
};

// ─── Stack icon definitions ────────────────────────────────────────────────
const STACK_ICONS = [
  { key: 'react', slug: 'react', label: 'React' },
  { key: 'ts', slug: 'typescript', label: 'TypeScript' },
  { key: 'js', slug: 'javascript', label: 'JavaScript' },
  { key: 'html', slug: 'html5', label: 'HTML5' },
  { key: 'css', slug: 'css', label: 'CSS3' },
  { key: 'mysql', slug: 'mysql', label: 'MySQL' },
  { key: 'docker', slug: 'docker', label: 'Docker' },
  { key: 'csharp', slug: 'dotnet', label: 'C#' },
  { key: 'git', slug: 'git', label: 'Git' },
  { key: 'github', slug: 'github', label: 'GitHub' },
  { key: 'vite', slug: 'vite', label: 'Vite' },
  { key: 'tailwind', slug: 'tailwindcss', label: 'Tailwind' },
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
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
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
const ITEM_W = 64 + 40;
const SET_W = STACK_ICONS.length * ITEM_W;
const SPEED = 0.038;

function StackMarquee() {
  const [hoveredUid, setHoveredUid] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
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
      <rect x="2" y="4" width="20" height="16" rx="2.4" />
      <polyline points="2,7 12,14 22,7" />
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
  { key: 'email', href: `mailto:${personalInfo.email}`, icon: <MailIcon />, label: personalInfo.email, display: personalInfo.email, external: false },
  { key: 'github', href: personalInfo.github, icon: <GithubIcon />, label: 'GitHub', display: 'GitHub', external: true },
  { key: 'linkedin', href: personalInfo.linkedin, icon: <LinkedinIcon />, label: 'LinkedIn', display: 'LinkedIn', external: true },
];

// ─── Project card ─────────────────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  type: string;
  desc: string;
  tech: string[];
  link: string;
  image?: string;
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
      className="group block border-t border-line py-[1.5rem] md:py-[2.5rem] last:border-b transition-all duration-[400ms] hover:bg-surface-2/20 md:hover:px-0 relative"
    >
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[64px_minmax(0,1fr)_56px] gap-[0.8rem] md:gap-4 items-start">
        <div className="text-accent text-[0.72rem] md:text-[0.82rem] font-extrabold tracking-[0.14em] md:pt-[0.9rem]">
          {project.id}
        </div>

        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start xl:gap-[3rem]">
          <div className="flex-1">
            <h2 className="text-[1.4rem] sm:text-[1.8rem] md:text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.05] md:leading-[1] tracking-[-0.03em] font-black group-hover:text-amber-50 group-hover:drop-shadow-sm transition-all duration-300">
              {project.title}
            </h2>
            <p className="mt-[0.45rem] md:mt-[0.65rem] text-muted text-[0.72rem] md:text-[0.82rem] tracking-[0.16em] uppercase">
              {project.type}
            </p>
            <div className="mt-[1.4rem] md:mt-[2rem] xl:max-w-[90%]">
              <p className="text-muted text-[0.92rem] md:text-[0.98rem] leading-[1.7] md:leading-[1.8]">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-[0.45rem] md:gap-[0.7rem] mt-[1.2rem] md:mt-[1.5rem]">
                {project.tech.map((item) => (
                  <span
                    key={item}
                    className="border border-line bg-surface-2 py-[0.5rem] md:py-[0.62rem] px-[0.75rem] md:px-[1rem] rounded-full text-[0.64rem] md:text-[0.74rem] font-bold tracking-[0.08em] md:tracking-[0.12em] text-fg"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {project.image && (
            <div className="mt-8 xl:mt-0 w-[100%] xl:w-[400px] aspect-[16/9] flex-shrink-0 rounded-[14px] overflow-hidden border border-line/40 shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(215,255,63,0.08)] relative xl:-mt-[1rem]">
              <div className="absolute inset-0 bg-accent/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
              <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale-[0.8] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.03]" />
            </div>
          )}
        </div>

        {/* Arrow circle */}
        <motion.div
          animate={{
            y: hovered ? -6 : 0,
            x: hovered ? 6 : 0,
            backgroundColor: hovered ? 'rgba(215,255,63,0.08)' : 'transparent',
            borderColor: hovered ? 'rgba(215,255,63,0.22)' : 'rgba(255,255,255,0.1)',
          }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="w-[42px] h-[42px] md:w-[52px] md:h-[52px] border rounded-full hidden md:grid place-items-center text-[1.1rem] md:text-[1.45rem] shadow-sm"
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
    <>
      <Background />
      <div className="px-[4vw] md:px-[4vw] max-w-[1280px] mx-auto relative z-10">

        {/* Header */}
        <header className="sticky top-0 z-50 h-[72px] md:h-[88px] flex justify-between items-center gap-2 md:gap-4 bg-[rgba(10,10,10,0.85)] backdrop-blur-[16px] border-b border-transparent transition-colors duration-300" style={{ borderBottomColor: hasScrolled ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
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
            <a href="#contact" className="text-[0.66rem] md:text-[0.76rem] font-extrabold tracking-[0.1em] md:tracking-[0.16em] transition-opacity duration-200 hover:opacity-70 border border-line px-4 py-2 rounded-full hover:bg-surface">
              GET IN TOUCH
            </a>
          </div>
        </header>

        {/* Hero */}
        <motion.main
          layout
          transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
          className={`flex flex-col justify-center py-2 pb-[2.2rem] md:py-8 md:pb-16 ${hasScrolled ? 'min-h-[72vh] md:min-h-[72vh]' : 'min-h-[100svh]'
            }`}
          id="home"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            layout
            className="flex flex-col md:flex-row md:justify-between gap-[0.35rem] md:gap-4 mb-4 md:mb-8 text-[0.62rem] md:text-[0.74rem] tracking-[0.12em] md:tracking-[0.18em] text-muted uppercase"
          >
            <span className="text-accent flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              AVAILABLE FOR WORK
            </span>
            <span>{personalInfo.location}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            layout
            className="text-[3.7rem] sm:text-[4.4rem] md:text-[clamp(4.6rem,14vw,11rem)] leading-[0.88] md:leading-[0.82] tracking-[-0.07em] md:tracking-[-0.06em] font-black drop-shadow-sm"
          >
            <TypewriterEffect
              cursorClassName="bg-accent"
              words={[
                { text: firstName },
                { text: '\n' },
                { text: lastName, className: 'md:ml-[10vw]' },
              ]}
            />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            layout
            className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-8 mt-4 md:mt-8"
          >
            <div className="md:max-w-[640px]">
              <p className="text-accent text-[0.68rem] md:text-[0.78rem] font-extrabold tracking-[0.12em] md:tracking-[0.18em] mb-[0.7rem] md:mb-4 uppercase">
                {personalInfo.role}
              </p>
              <p className="text-[0.92rem] md:text-base leading-[1.65] md:leading-[1.7] text-muted md:max-w-[520px]">
                {personalInfo.statement}
              </p>
            </div>

            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 text-sm font-bold tracking-widest uppercase border border-line rounded-full px-6 py-4 hover:bg-surface transition-colors duration-300"
            >
              See Work <ChevronRight size={16} className="text-accent" />
            </motion.a>
          </motion.div>
        </motion.main>

        {/* About */}
        <FadeIn id="about" className="py-[1.5rem] md:py-[4rem] pb-12 md:pb-[5rem] border-t border-line">
          <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-6 md:mb-10">ABOUT</div>
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
            onButtonClick={() => { document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            secondaryButtonText="Contact"
            onSecondaryButtonClick={() => { document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="border-line bg-surface backdrop-blur-sm text-fg [&_img]:grayscale [&_img]:opacity-90 [&_img]:hover:grayscale-0 [&_img]:hover:opacity-100 [&_img]:transition-all [&_img]:duration-700 [&_p.text-sm]:text-accent [&_p.text-sm]:tracking-[0.12em] [&_p.text-sm]:uppercase [&_p.text-sm]:text-[0.7rem] [&_p.text-sm]:font-bold [&_.text-muted-foreground]:text-muted [&_button]:bg-accent [&_button]:text-[#0a0a0a] [&_button]:font-bold [&_button]:tracking-[0.1em] [&_button]:uppercase [&_button]:hover:opacity-90 [&_button]:hover:-translate-y-0.5 [&_button]:transition-all [&_button]:rounded-full [&_.cta-secondary-btn]:!bg-transparent [&_.cta-secondary-btn]:!text-fg [&_.cta-secondary-btn]:!border-line [&_.cta-secondary-btn]:border [&_.cta-secondary-btn]:hover:!bg-surface-2"
          />
        </FadeIn>

        {/* Services */}
        <FadeIn id="services" className="py-[1.5rem] md:py-[4rem] pb-12 md:pb-[5rem] border-t border-line">
          <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-4 md:mb-6">SERVICES</div>
          <div className="max-w-[760px] mb-[3rem]">
            <p className="text-[1.1rem] md:text-[1.4rem] leading-[1.5] text-fg font-medium">
              I help small businesses, service-based brands and personal projects present themselves
              professionally online through clean, responsive and modern websites.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {services.map((service) => (
              <article key={service.title} className="group relative border border-line bg-surface rounded-[18px] p-6 lg:p-8 transition-colors duration-200 hover:bg-surface-2">
                <GlowingEffect disabled={false} spread={30} glow={true} proximity={80} inactiveZone={0.05} borderWidth={2} />
                <div className="relative z-10 transition-transform duration-300">
                  <h3 className="text-[0.98rem] md:text-[1.1rem] font-extrabold tracking-[0.05em] mb-[1rem] leading-tight text-fg">{service.title}</h3>
                  <p className="text-[0.92rem] md:text-[0.95rem] leading-[1.7] text-muted">{service.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </FadeIn>

        {/* Selected Work */}
        <FadeIn id="projects" className="py-[1.5rem] md:py-[4rem] pb-12 md:pb-[5rem] border-t border-line">
          <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-4 md:mb-6">SELECTED WORK</div>
          <div className="flex flex-col">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </FadeIn>

        {/* Stack */}
        <FadeIn className="py-[1.5rem] md:py-[4rem] pb-12 md:pb-[5rem] border-t border-line" style={{ overflow: 'hidden' }}>
          <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-6 md:mb-12">
            STACK
          </div>
          <StackMarquee />
        </FadeIn>

        {/* Contact */}
        <FadeIn id="contact" className="py-[1.5rem] md:py-[4rem] pb-24 md:pb-[6rem] border-t border-line">
          <div className="text-[0.68rem] md:text-[0.76rem] font-extrabold tracking-[0.14em] md:tracking-[0.18em] text-accent mb-4 md:mb-6">CONTACT</div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-10 items-center bg-surface border border-line p-8 md:p-12 rounded-[24px]">
            {/* Left — heading */}
            <div>
              <h3 className="text-[1.8rem] md:text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.03em] mb-[1rem] md:mb-[1.5rem] font-black">
                Let&apos;s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-green-400">useful.</span>
              </h3>
              <p className="text-[1rem] md:text-[1.1rem] text-muted leading-[1.65] md:leading-[1.8] max-w-[480px]">
                Open to collaborations, freelance projects, and junior opportunities.
              </p>
            </div>

            {/* Right — expanded on mobile, slide out buttons stacked vertically on desktop */}
            <div className="flex flex-col sm:flex-row flex-wrap lg:flex-col lg:items-end gap-3 lg:gap-4 flex-1 w-full lg:w-auto mt-8 lg:mt-0">
              {CONTACT_LINKS.map(({ key, href, icon, display, external }) => (
                <a
                  key={key}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  aria-label={display}
                  title={display}
                  className="group flex items-center justify-center lg:justify-start gap-2 lg:gap-0 border border-line bg-surface hover:bg-surface-2 text-fg rounded-full h-[54px] overflow-hidden transition-all duration-[400ms] shadow-sm cursor-pointer w-full sm:w-auto lg:w-auto px-6 lg:px-0"
                >
                  <span className="flex items-center justify-center flex-shrink-0 w-6 h-6 lg:w-[52px] lg:h-[52px]" style={{ opacity: 0.9 }}>
                    {icon}
                  </span>

                  {/* Expanding text: always visible on mobile, zero width expanding on hover for desktop */}
                  <span className="flex items-center overflow-hidden text-[0.8rem] md:text-[0.85rem] font-bold tracking-[0.04em] whitespace-nowrap transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] max-w-full lg:max-w-0 opacity-100 lg:opacity-0 lg:group-hover:max-w-[280px] lg:group-hover:opacity-100 lg:group-hover:pr-6 lg:group-hover:pl-2">
                    {display}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Footer */}
        <footer className="py-[1.5rem] md:py-8 pb-[3rem] md:pb-[4rem] text-[0.62rem] md:text-[0.7rem] text-muted/70 text-center tracking-[0.18em] leading-[1.5] border-t border-line">
          <p>DESIGNED &amp; CODED BY KRISTIJAN GEGA / 2026</p>
        </footer>

      </div>
    </>
  );
}

export default App;