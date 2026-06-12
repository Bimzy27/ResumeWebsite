import type { ExperienceEntry, Profile, Project } from '../types'

export const fallbackProfile: Profile = {
  name: 'Branden Immerzeel',
  title: 'Senior Software Engineer',
  summary:
    'Experienced Full-Stack Software Engineer with over 7 years of experience across enterprise web development and game development. Proficient in Vue.js, TypeScript, C#, and .NET. Skilled in software architecture and delivering full-stack features end-to-end, from responsive front-end interfaces to robust back-end APIs, across large, multi-repository codebases.',
  contact: {
    email: 'branden.immerzeel@gmail.com',
    phone: '0423 889 259',
    location: 'Huntfield Heights, SA 5163',
    linkedIn: 'https://linkedin.com',
  },
  skills: [
    'C#',
    '.NET',
    'Vue.js',
    'TypeScript',
    'REST APIs',
    'Software Architecture',
    'Unit & E2E Testing',
    'CI/CD',
    'AI Tooling',
    'Unity',
    'Git',
  ],
  strengths: [
    {
      title: 'Full-Stack Development',
      description:
        'Comfortable across the stack, pairing responsive Vue.js and TypeScript interfaces with robust C# and .NET back-end services and APIs.',
    },
    {
      title: 'Leadership and Team Dynamics',
      description: 'Proven ability to lead, manage and coach team members towards project success.',
    },
    {
      title: 'End-to-End Ownership',
      description:
        'Drives features from initial technical design through to production rollout, delivering reliably under tight deadlines.',
    },
  ],
  education: [
    {
      degree: 'Bachelor of Interactive Digital Media (CS Major)',
      institution: 'Queensland University of Technology',
      period: '2017 Cohort',
    },
  ],
}

export const fallbackExperience: ExperienceEntry[] = [
  {
    id: 'wisetech',
    company: 'WiseTech Global',
    role: 'Full-Stack Software Engineer',
    period: '08/2024 - 06/2026',
    highlights: [
      'Architected and delivered full-stack features for a large-scale enterprise web platform, owning a complex workflow management module end-to-end across feature flags, back-end API endpoints, and multi-tab dialog interfaces, from initial technical design through to production rollout.',
      'Designed and implemented a standalone, metadata-driven security configuration for CRUD operations spanning multiple repositories, enabling teams to configure access roles directly. Recognized by leadership for end-to-end ownership under tight deadlines.',
      'Built reusable, slot-based UI components for a shared design system, including a configurable, branding-aware login layout rolled out across numerous web portals.',
      'Created and evolved an internal multi-framework test runner adopted across the organization, extending it from a single framework to several by decoupling the runner architecture from any one testing framework. Adapted this test runner for agent usage to provide a more token-efficient way to discover/run/fix related tests.',
    ],
  },
  {
    id: 'mighty-kingdom',
    company: 'Mighty Kingdom',
    role: 'Senior Software Engineer',
    period: '09/2021 - 05/2024',
    highlights: [
      'Integral member of a dynamic development team renowned for crafting award-winning narrative games tailored for mobile devices.',
      'Spearheaded the creation of robust game features, elevating the overall user experience through innovative programming solutions.',
      'Took the lead in implementing comprehensive testing strategies, including rigorous device testing, unit and end-to-end tests, and integration of data validation.',
      'Employed CI/CD methodologies to streamline game production processes, ensuring efficiency and stability in releases.',
    ],
  },
  {
    id: 'wymac',
    company: 'Wymac Gaming Solutions',
    role: 'Senior Software Engineer',
    period: '06/2018 - 08/2021',
    highlights: [
      'Played a pivotal role as a core game development team member, collaborating closely with designers, artists, sound engineers, and testers to deliver high-quality games for casinos, pubs, and clubs.',
      "Led the end-to-end development process, from conceptualization to release, ensuring the successful delivery of Wymac's core games.",
      'Applied a diverse skill set encompassing problem-solving, mathematical analysis, and effective stakeholder engagement to drive project success.',
    ],
  },
  {
    id: 'lazy-rhino',
    company: 'Lazy Rhino Studios',
    role: 'Co-Founder / Project Leader / Lead Programmer',
    period: '2017 - 2018',
    highlights: [
      "Orchestrated the collaboration of a talented team of game developers from QUT, guiding them through the development and successful release of the strategy game 'Monsters of Mayhem'.",
      "Spearheaded the development and deployment of 'Endless Miner,' a charming game released on the Android marketplace, showcasing the company's creativity and technical prowess.",
      'Organized and executed press events and presentations targeting various game companies, promoting our products and fostering valuable industry connections.',
    ],
  },
  {
    id: 'code-camp',
    company: 'Code Camp & Junior Engineers',
    role: 'Programming Teacher',
    period: '2016 - 2017',
    highlights: [
      'Engaged as a full-time educator and extracurricular instructor, imparting foundational programming concepts to classroom environments comprising approximately thirty eager young learners.',
      'Enhanced leadership, presentation, teamwork, and public speaking skills during tenure at both Code Camp and Junior Engineers.',
    ],
  },
]

export const fallbackProjects: Project[] = [
  {
    id: 'portfolio-site',
    title: 'This Portfolio Website',
    description:
      'A full-stack portfolio built with a Vue 3 + TypeScript front end and an ASP.NET Core minimal API back end, demonstrating the exact stack used day-to-day.',
    tags: ['Vue', 'TypeScript', 'C#', '.NET', 'REST API'],
    links: {},
  },
  {
    id: 'slime-slayer',
    title: 'Slime Slayer',
    description:
      'A top-down shooter for mobile, built as a Test-Driven Development case study covering the full game development lifecycle from concept through to release on Google Play and the App Store.',
    tags: ['Unity', 'C#', 'TDD', 'Mobile'],
    links: {},
  },
  {
    id: 'bimzydev',
    title: 'BimzyDev YouTube Channel',
    description:
      'A YouTube channel sharing game development tutorials and devlogs, showcasing techniques and progress to a community of learners and enthusiasts.',
    tags: ['Content Creation', 'Game Development', 'YouTube'],
    links: {},
  },
]
