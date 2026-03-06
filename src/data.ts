import profileImage from './assets/profile.jpg';

export const personalInfo = {
  name: 'KRISTIJAN GEGA',
  role: 'WEB DEVELOPER',
  email: 'kgega.dev@gmail.com',
  location: 'Zagreb, Croatia',
  github: 'https://github.com/kgega-dev',
  linkedin: 'https://www.linkedin.com/in/kristijan-gega-93b8753b5/',
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
    title: 'BUSINESS WEBSITE',
    type: 'FRONTEND WEBSITE',
    desc:
      'Responsive business-focused website project with a clean landing page structure, strong visual hierarchy and practical contact sections.',
    tech: ['HTML', 'CSS', 'JAVASCRIPT'],
    link: '#'
  },
  {
    id: '03',
    title: 'PORTFOLIO WEBSITE',
    type: 'PERSONAL BRANDING',
    desc:
      'Personal developer portfolio built with React and TypeScript to showcase projects, skills and contact information in a modern format.',
    tech: ['REACT', 'TYPESCRIPT', 'CSS'],
    link: '#'
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