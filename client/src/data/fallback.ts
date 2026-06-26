import type { ExperienceEntry, Profile, Project, RecommendationEntry } from '../types'

export const fallbackProfile: Profile = {
  name: 'Branden Immerzeel',
  title: 'Senior Software Engineer',
  summary:
    'Full-Stack Software Engineer with over eight years across enterprise web development and game development. Proficient in Vue.js, TypeScript, C#, and .NET. Skilled in software architecture and delivering full-stack features end-to-end, from responsive front-end interfaces to robust back-end APIs, across large, multi-repository codebases.',
  contact: {
    email: 'branden.immerzeel@gmail.com',
    phone: '0423 889 259',
    location: 'Adelaide, SA 5163',
    linkedIn: 'https://www.linkedin.com/in/branden-immerzeel/',
  },
  skills: [
    'AI Tooling',
    'C#',
    '.NET',
    'Vue.js',
    'TypeScript',
    'REST APIs',
    'Software Architecture',
    'Unit & E2E Testing',
    'CI/CD',
    'Unity',
    'Git',
  ],
  strengths: [
    {
      title: 'Problem Solving',
      description:
        'A confident, methodical approach to breaking down complex, ambiguous problems into clean, reliable solutions.',
    },
    {
      title: 'Leadership and Team Dynamics',
      description: 'Proven ability to lead, manage, and coach team members towards project success.',
    },
    {
      title: 'End-to-End Ownership',
      description:
        'Proven ownership of features from initial technical design through to production rollout, delivering reliably under tight deadlines.',
    },
  ],
  education: [
    {
      degree: 'Bachelor of Interactive Digital Media (Computer Science Major)',
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
      'Designed and implemented a standalone, metadata-driven security configuration for CRUD operations spanning multiple repositories, enabling teams to configure access roles directly. Recognised by leadership for end-to-end ownership under tight deadlines.',
      'Built reusable, slot-based UI components for a shared design system, including a configurable, branding-aware login layout rolled out across numerous web portals.',
      'Created and evolved an internal multi-framework test runner adopted across the organisation, extending it from a single framework to several by decoupling the runner architecture from any one testing framework. Adapted this test runner for agent usage to provide a more token-efficient way to discover, run, and fix related tests.',
    ],
    image: '/wisetech.jpg',
    imageAlt: 'WiseTech Global',
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
    image: '/mightykingdom.jpg',
    imageAlt: 'Mighty Kingdom',
  },
  {
    id: 'wymac',
    company: 'Wymac Gaming Solutions',
    role: 'Senior Software Engineer',
    period: '06/2018 - 08/2021',
    highlights: [
      'Played a pivotal role as a core game development team member, collaborating closely with designers, artists, sound engineers, and testers to deliver high-quality games for casinos, pubs, and clubs.',
      "Led the end-to-end development process, from conceptualisation to release, ensuring the successful delivery of Wymac's core games.",
      'Applied a diverse skill set encompassing problem-solving, mathematical analysis, and effective stakeholder engagement to drive project success.',
    ],
    image: '/wymac.jpg',
    imageAlt: 'Wymac Gaming Solutions',
  },
  {
    id: 'lazy-rhino',
    company: 'Lazy Rhino Studios',
    role: 'Co-Founder / Project Leader / Lead Programmer',
    period: '2017 - 2018',
    highlights: [
      "Orchestrated the collaboration of a talented team of game developers from QUT, guiding them through the development and successful release of the strategy game 'Monsters of Mayhem'.",
      "Spearheaded the development and deployment of 'Endless Miner,' a charming game released on Google Play, showcasing the company's creativity and technical prowess.",
      'Organised and executed press events and presentations targeting various game companies, promoting our products and fostering valuable industry connections.',
    ],
    image: '/lazyrhinostudios.jpg',
    imageAlt: 'Lazy Rhino Studios',
  },
  {
    id: 'code-camp',
    company: 'Code Camp & Junior Engineers',
    role: 'Programming Teacher',
    period: '2016 - 2017',
    highlights: [
      'Engaged as a full-time educator and extracurricular instructor, imparting foundational programming concepts to classrooms of approximately thirty eager young learners.',
      'Enhanced leadership, presentation, teamwork, and public speaking skills during tenure at both Code Camp and Junior Engineers.',
    ],
    image: '/codecamp.jpg',
    imageAlt: 'Code Camp & Junior Engineers',
  },
]

export const fallbackRecommendations: RecommendationEntry[] = [
  {
    id: 'juan-diego-merino-roldan',
    name: 'Juan Diego Merino Roldán',
    title: 'Software Architect at WiseTech Global',
    relationship: 'Senior to Branden, did not manage him directly',
    quote:
      "I had the pleasure of working closely with Branden at WiseTech, where he consistently stood out as an exceptional Senior Software Engineer. Branden doesn't just write clean, high-quality code; he possesses a rare ability to look at complex, ambiguous problems and architect and deliver elegant, scalable solutions that align perfectly with business goals. Not only a great developer but also a great person to work with. I can't recommend him enough.",
    linkedIn: 'https://www.linkedin.com/in/jdmerinor/en/',
  },
  {
    id: 'guan-du',
    name: 'Guan Du',
    title: 'Software Engineering Team Lead',
    relationship: 'Managed Branden directly',
    quote:
      'Branden is a very passionate and hard working engineer. He volunteered for many challenging projects in WiseTech and displayed great teamwork during these, onboarding and mentoring new colleagues. Branden also has great communication skills, reaching out and following up with people when necessary. I definitely saw leadership potential in Branden. I enjoyed working with Branden greatly and I think he would be a great addition to any company.',
    linkedIn: 'https://www.linkedin.com/in/guan-d-222746157/',
  },
  {
    id: 'ben-calder',
    name: 'Ben Calder',
    title: 'Leader of Software Engineers in pursuit of excellence',
    relationship: 'Managed Branden directly',
    quote:
      'Branden is a talented software engineer with a keen eye for detail and a solution-oriented mindset. His passion for delivering quality at speed with consistency is exemplary, and he sets himself apart with his willingness to assist those around him and share his learnings with teammates. He has an ability to think outside the box to find innovative solutions to complex problems. I believe any team would be lucky to land Branden\'s services, and can see him being successful in a solutions engineer or architect role moving forward.',
    linkedIn: 'https://www.linkedin.com/in/bencalder/',
  },
  {
    id: 'alexander-eagles',
    name: 'Alexander Eagles',
    title: 'Product Manager, PAVE and Productivity Tools at WiseTech Global',
    relationship: 'Senior to Branden, did not manage him directly',
    quote:
      "As a product manager you want teams that can execute and do so effectively. Branden always came to work with the attitude to help me solve the team's problems. Branden would come with multiple solutions and help explore trade-offs in a way few engineers do effectively. Any team would benefit from having Branden, not just because of his technical ability - but because of his ability to take the problems and pragmatically explore solutions. If I was to assemble my dream team, Branden would be on it.",
    linkedIn: 'https://www.linkedin.com/in/alexander-eaglessydney/',
  },
  {
    id: 'simon-vogler',
    name: 'Simon Vogler',
    title: 'Senior Developer at Mighty Kingdom',
    relationship: 'Managed Branden directly',
    quote:
      'I have worked with Branden at Mighty Kingdom for just over a year and he has implemented and maintained major features that are useful for a wide range of projects. He has great programming skills and attention to detail which has improved code quality and tools required for design and QA. He shows great problem solving skills, a desire to learn and grow, and promotes knowledge sharing with other programmers. Branden has great leadership skills, managing a squad to focus on critical build updates. He always looks for opportunities to support and encourage team members, improve project strategies, and focus on build stability.',
    linkedIn: 'https://www.linkedin.com/in/simon-vogler-81874411/',
  },
  {
    id: 'scott-cabot',
    name: 'Scott Cabot',
    title: 'Senior Software Engineer at Discovery Parks',
    relationship: 'Worked with Branden on the same team',
    quote:
      "It was excellent being able to work alongside Branden on our product together. He has a strong focus on systems design and consistently plans pragmatic and well-designed solutions for given problems. His care for our code base, consistently looking for room for improvement made him a staple in our team. He was great at communicating feedback amongst engineers as well as to wider stakeholders. He's definitely missed!",
    linkedIn: 'https://www.linkedin.com/in/scott-cabot/',
  },
  {
    id: 'chen-ling',
    name: 'Chen Ling',
    title: 'Software Engineer at WiseTech Global',
    relationship: 'Worked with Branden on the same team',
    quote:
      'I had the pleasure of working closely with Branden during his time at WiseTech. He is a highly responsible, reliable, and intelligent professional who consistently delivers thorough, high-quality work. Branden also brings great energy to the team with his sense of humor and positive attitude. He is approachable, friendly, and always enjoyable to work with, which makes collaboration smooth and enjoyable for everyone around him. I truly enjoyed working with Branden and am confident that he will be a valuable asset and succeed in any team he joins.',
    linkedIn: 'https://www.linkedin.com/in/chen-ling-rrr/',
  },
  {
    id: 'ryan-smallwood-simpson',
    name: 'Ryan Smallwood-Simpson',
    title: 'Software Engineer',
    relationship: 'Reported to Branden directly',
    quote:
      'Branden was my mentor when I first joined WiseTech Global. He always went the extra mile to help me find my feet at the company. He is the ideal combination of very easy to get on with and highly competent at all aspects of the software development life cycle. Finally, he was always striving to improve even further and would be a great fit to any team.',
    linkedIn: 'https://www.linkedin.com/in/ryan-smallwood-simpson-b4a076138/',
  },
  {
    id: 'benjamin-wang',
    name: 'Benjamin Wang',
    title: 'Software Engineer at WiseTech Global',
    relationship: 'Worked with Branden on different teams',
    quote:
      'I have worked with Branden in the same office for over 1 year and a half. Branden consistently brings a great attitude to work. Whether facing a tough deadline or a tricky technical problem, he approaches challenges with genuine enthusiasm to make solid contributions and deliver the results. Branden always tries to kick up a notch and stretch himself. As a software engineer, Branden has always been seeking challenges beyond the scope, including proactively taking the lead in a squad, mentoring people and providing support for his team. It was a pleasure for me to have been working with Branden and with his skills I genuinely believe any team would be lucky to have Branden. I wish Branden all the best with his career.',
    linkedIn: 'https://www.linkedin.com/in/benjamin-wang-579676259/',
  },
]

export const fallbackProjects: Project[] = [
  {
    id: 'ai-tool',
    title: 'AI tool for test discovery and execution',
    description:
      'An AI tool used to optimise context window and token consumption for test discovery and execution. It reliably enables deterministic discovery of related tests, which is something an agent struggles to do in isolation. When integrated with skills, it can recursively fix failing tests.',
    tags: ['AI Tooling', 'Token Optimization', 'Tests'],
    media: {
      type: 'youtube',
      videoId: 'k4xWFiC0NFo',
    },
    actions: [
      {
        label: 'Watch on YouTube',
        url: 'https://www.youtube.com/watch?v=k4xWFiC0NFo',
        variant: 'primary',
      },
    ],
  },
  {
    id: 'slime-slayer',
    title: 'Slime Slayer',
    description:
      'A colourful top-down survival shooter for mobile, built in a team of two as a TDD case study from concept to release on Google Play. I also wrote my own dependency injection system from scratch to better understand the patterns.',
    tags: ['Unity', 'C#', 'TDD', 'Dependency Injection', 'Mobile'],
    media: {
      type: 'image',
      src: '/slimeSlayer.png',
      alt: 'Slime Slayer gameplay screenshot',
      url: 'https://play.google.com/store/apps/details?id=com.BimzyDezDev.SlimeSlayer&hl=en',
    },
    actions: [
      {
        label: 'Get it on Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.BimzyDezDev.SlimeSlayer&hl=en',
        variant: 'primary',
      },
    ],
  },
  {
    id: 'bimzydev',
    title: 'BimzyDev YouTube Channel',
    description:
      'My YouTube channel sharing game development tutorials and devlogs. Breaking down techniques, tooling, and progress for a community of learners and enthusiasts.',
    tags: ['Content Creation', 'Game Dev', 'YouTube'],
    media: {
      type: 'youtube-channel',
      url: 'https://www.youtube.com/c/BimzyDev',
      handle: '@BimzyDev',
    },
    actions: [
      {
        label: 'Visit the channel',
        url: 'https://www.youtube.com/c/BimzyDev',
        variant: 'primary',
      },
    ],
  },
  {
    id: 'runes-of-time',
    title: 'Runes of Time',
    description:
      'A 3rd-person action roguelike wizard game built in Unity with a team of two. Developed transparently through a YouTube devlog series and playable builds on itch.io.',
    tags: ['Unity', 'C#', 'Roguelike', 'Multiplayer'],
    media: {
      type: 'youtube',
      videoId: 'uP53F83c0tU',
    },
    actions: [
      {
        label: 'Play on itch.io',
        url: 'https://bimzydev.itch.io/runesoftime',
        variant: 'primary',
      },
      {
        label: 'Watch the devlog',
        url: 'https://www.youtube.com/watch?v=uP53F83c0tU',
        variant: 'secondary',
      },
    ],
  },
]
