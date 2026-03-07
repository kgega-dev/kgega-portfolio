import profileImage from './assets/profile.jpg';

export const personalInfo = {
  name: 'KRISTIJAN GEGA',
  role: 'WEB DEVELOPER',
  email: 'kgega.dev@gmail.com',
  location: 'Zagreb, Croatia',
  github: 'https://github.com/kgega-dev',
  linkedin: 'https://www.linkedin.com/in/kristijan-gega/',
  image: profileImage,
  statement:
    'Building modern, responsive and practical web solutions with React, TypeScript and modern frontend tooling.'
};

export const projects = [
  {
    id: '01',
    title: 'FATE DETECT',
    type: 'SECURITY DASHBOARD',
    desc:
      'Modern React SPA dashboard focused on modular structure, strict TypeScript usage, responsive UI and clean component architecture.',
    tech: ['REACT', 'TYPESCRIPT', 'TAILWIND', 'VITE'],
    link: 'https://fate-detect.vercel.app/'
  },
  {
    id: '02',
    title: 'OBSIDIAN DETAILING',
    type: 'BUSINESS LANDING PAGE',
    desc:
      'Premium business landing page for a luxury auto detailing studio, focused on responsive layout, polished UI, service presentation and strong visual branding.',
    tech: ['REACT', 'TYPESCRIPT', 'CSS', 'VITE'],
    link: 'https://obsidian-detailing.vercel.app/'
  },
  {
    id: '03',
    title: 'CHECKERTOOL',
    type: 'OOP CONSOLE APPLICATION',
    desc:
      'C++ console application for managing forensic and anti-cheat tools, built to demonstrate object-oriented design, inheritance, polymorphism and modular structure.',
    tech: ['C++', 'OOP', 'WINDOWS API'],
    link: 'https://github.com/kgega-dev/checker-tool'
  }
];

export const services = [
  {
    title: 'BUSINESS WEBSITES',
    desc: 'Modern websites for small businesses and service-based brands with clear structure, strong presentation and contact-focused layout.'
  },
  {
    title: 'LANDING PAGES',
    desc: 'Clean, focused pages designed for a single service, offer or campaign with strong call-to-action flow.'
  },
  {
    title: 'PORTFOLIO WEBSITES',
    desc: 'Professional websites for freelancers, creatives and personal brands who want a stronger online presence.'
  },
  {
    title: 'WEBSITE REDESIGNS',
    desc: 'Refreshing outdated websites with a more modern look, improved layout and better responsiveness.'
  },
  {
    title: 'FRONTEND UI IMPLEMENTATION',
    desc: 'Responsive user interfaces built with modern frontend technologies and practical section-based structure.'
  }
];

export const stack = [
  'REACT',
  'TYPESCRIPT',
  'JAVASCRIPT',
  'HTML',
  'CSS',
  'SQL',
  'MYSQL',
  'ORACLE',
  'C#',
  'GIT',
  'GITHUB'
];