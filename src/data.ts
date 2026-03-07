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