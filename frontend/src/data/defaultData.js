// Default portfolio data used as offline fallback and initial seed
import defaultProfilePic from '../assets/profile.jpg';

export const defaultProfile = {
  full_name: 'Diro Uchure',
  title: 'Software Engineering Student & Full Stack Developer',
  bio: 'Software Engineering student at Haramaya University with a passion for building modern, scalable web applications. Experienced in full-stack development with React, Node.js, and MySQL. Committed to writing clean code and creating impactful digital solutions.',
  objective: 'Seeking internship and professional opportunities to apply my software engineering skills in building innovative web applications and growing as a Full Stack Developer.',
  email: 'dirouchure@gmail.com',
  phone: '+251940672637',
  location: 'Haramaya University, Ethiopia',
  years_of_experience: '3+',
  github_url: 'https://github.com/Dirouchure',
  linkedin_url: 'https://linkedin.com/in/dirouchure',
  twitter_url: 'https://twitter.com/dirouchure',
  telegram_url: 'https://t.me/forall4037',
  profile_image: defaultProfilePic,
  resume_file: '',
};

export const defaultProjects = [
  {
    id: 1,
    title: 'Online Examination System',
    category: 'Web Application',
    status: 'completed',
    description: 'A comprehensive, web-based online examination and assessment platform featuring automated grading, timed tests, role-based student and instructor portals, secure submissions, and comprehensive analytics.',
    technologies: 'React.js, Node.js, Express.js, MySQL Database, REST API',
    highlights: 'Automated evaluation and grading, Timed examination session management, Role-based student and instructor portals, Real-time scorecards and performance analytics',
    tags: 'react, nodejs, express, mysql, database, examination, online-exam, education',
    duration: '1 month',
    team_size: 1,
    client_name: 'Academic Project',
    github_url: 'https://github.com/Dirouchure/online-examination-system',
    live_url: 'https://github.com/Dirouchure/online-examination-system',
    project_url: 'https://github.com/Dirouchure/online-examination-system',
    is_featured: true,
    views: 185,
  },
];

export const defaultSkills = [
  { id: 1, skill_name: 'React.js', category: 'Frontend', proficiency: 90 },
  { id: 2, skill_name: 'JavaScript', category: 'Frontend', proficiency: 92 },
  { id: 3, skill_name: 'HTML5', category: 'Frontend', proficiency: 95 },
  { id: 4, skill_name: 'CSS3', category: 'Frontend', proficiency: 90 },
  { id: 5, skill_name: 'Node.js', category: 'Backend', proficiency: 85 },
  { id: 6, skill_name: 'Express.js', category: 'Backend', proficiency: 88 },
  { id: 7, skill_name: 'MySQL', category: 'Database', proficiency: 82 },
  { id: 8, skill_name: 'Git', category: 'Tools & DevOps', proficiency: 88 },
  { id: 9, skill_name: 'GitHub', category: 'Tools & DevOps', proficiency: 90 },
  { id: 10, skill_name: 'TailwindCSS', category: 'Frontend', proficiency: 85 },
  { id: 11, skill_name: 'Docker', category: 'Tools & DevOps', proficiency: 70 },
  { id: 12, skill_name: 'Python', category: 'Backend', proficiency: 75 },
];

export const defaultServices = [
  {
    id: 1,
    service_name: 'Full Stack Web Applications',
    description: 'End-to-end custom web applications built from scratch with clean component architecture, scalable backend APIs, and reliable database designs.',
    icon: 'code',
    price: 'Contact for Quote',
    duration: '2-4 weeks',
    features: 'React.js / Next.js UI, Node & Express Server, MySQL / PostgreSQL, JWT & Role Auth, Real-time APIs, Production Deployment',
    is_active: true,
    display_order: 1,
  },
  {
    id: 2,
    service_name: 'Frontend Engineering & UI/UX',
    description: 'Modern, high-performance, responsive web interfaces with smooth micro-interactions, mobile-first layouts, and cross-browser reliability.',
    icon: 'palette',
    price: 'Contact for Quote',
    duration: '1-2 weeks',
    features: 'Responsive CSS3 & Tailwind, State Management, Pixel-Perfect Implementation, Accessibility (a11y), Dark/Light Mode',
    is_active: true,
    display_order: 2,
  },
  {
    id: 3,
    service_name: 'RESTful API & Backend Architecture',
    description: 'Secure, fast, and maintainable REST APIs engineered with input validation, rate limiting, error handling, and robust database models.',
    icon: 'server',
    price: 'Contact for Quote',
    duration: '1-2 weeks',
    features: 'RESTful API Design, MySQL & ORM Integration, JWT Authentication, Multer Media Pipelines, Rate Limiting & Helmet Security',
    is_active: true,
    display_order: 3,
  },
  {
    id: 4,
    service_name: 'Database Modeling & Optimization',
    description: 'Relational schema design, normalization, query performance tuning, indexing strategies, and automated backups.',
    icon: 'database',
    price: 'Contact for Quote',
    duration: '3-7 days',
    features: 'Relational Schema Design, Query Optimization, Foreign Key Constraints, Indexing Strategies, Data Migration',
    is_active: true,
    display_order: 4,
  },
  {
    id: 5,
    service_name: 'Performance & SEO Optimization',
    description: 'Accelerate web page loading speed, optimize bundle sizes, implement SEO meta tags, and improve Core Web Vitals to achieve top Lighthouse scores.',
    icon: 'rocket',
    price: 'Contact for Quote',
    duration: '3-5 days',
    features: 'Asset Optimization, Code Splitting & Lazy Loading, SEO Meta & Open Graph, Caching Strategies, 90+ Lighthouse Score',
    is_active: true,
    display_order: 5,
  },
  {
    id: 6,
    service_name: 'Code Review & Technical Consulting',
    description: 'Architectural evaluation of existing codebases, identifying bottlenecks, security vulnerabilities, and creating step-by-step refactoring roadmaps.',
    icon: 'shield',
    price: 'Contact for Quote',
    duration: 'Flexible',
    features: 'Architecture Audits, Security Vulnerability Scanning, Best Practice Guidance, CI/CD Workflow Setup',
    is_active: true,
    display_order: 6,
  },
];

export const defaultExperience = [
  {
    id: 1,
    company_name: 'Freelance & Independent Projects',
    position: 'Full Stack Web Developer',
    start_date: '2023-01-01',
    end_date: null,
    is_current: true,
    responsibilities: 'Architecting and developing full-stack web applications, landing pages, and content management systems for clients. Implementing secure authentication, responsive interfaces, and RESTful APIs.',
    technologies: 'React, Node.js, Express, MySQL, Git, CSS3',
  },
  {
    id: 2,
    company_name: 'Digital Solutions Lab',
    position: 'Frontend Developer',
    start_date: '2022-01-01',
    end_date: '2022-12-31',
    is_current: false,
    responsibilities: 'Collaborated on user interface design and web development for diverse client projects. Optimized site speed, mobile responsiveness, and interactive user journeys.',
    technologies: 'JavaScript, React, HTML5, CSS3, Bootstrap, REST APIs',
  },
];

export const defaultEducation = [
  {
    id: 1,
    school_name: 'Haramaya University',
    degree: 'Bachelor of Science (B.Sc.)',
    department: 'Software Engineering',
    start_year: 2019,
    end_year: 2024,
    description: 'Pursuing Software Engineering with focus on web technologies, algorithms, data structures, database systems, and software development methodologies. Building practical projects and gaining hands-on experience in full-stack development.',
  },
];

export const defaultCertificates = [
  {
    id: 1,
    title: 'Full Stack Web Development Professional Certificate',
    organization: 'Web Development Certification Institute',
    issue_date: '2023-06-15',
    certificate_image: '',
  },
  {
    id: 2,
    title: 'Modern JavaScript & React Specialist',
    organization: 'Frontend Masters Academy',
    issue_date: '2023-01-20',
    certificate_image: '',
  },
];

export const defaultTestimonials = [
  {
    id: 1,
    name: 'Michael Chen',
    role: 'Tech Lead & Product Manager',
    company: 'Apex Digital Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Diro delivered our full-stack web application ahead of schedule. His attention to architecture, component reusability, and backend API performance was top-notch. Truly a dependable engineer.'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    role: 'Creative Director',
    company: 'Nexus Studio',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Diro transformed our complex Figma mockups into pixel-perfect, responsive React interfaces. His eye for subtle animations and user experience made a massive difference to our launch.'
  },
  {
    id: 3,
    name: 'Alex Rivera',
    role: 'Founder & CTO',
    company: 'PeakFlow Systems',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Exceptional full-stack capabilities. From designing normalized MySQL database schemas to implementing robust JWT authentication, Diro exceeded our technical expectations.'
  }
];

export const defaultFAQs = [
  {
    question: 'What is your typical project timeline and development process?',
    answer: 'Most standard web applications take between 1 to 4 weeks depending on scope. I work in agile sprints: Discovery & Architecture, Interactive Prototyping, Full-Stack Development, Rigorous Testing, and Deployment with documentation.'
  },
  {
    question: 'Which technologies do you specialize in?',
    answer: 'I specialize in the modern JavaScript & TypeScript ecosystem: React.js, Next.js, Node.js, Express.js, MySQL, PostgreSQL, RESTful APIs, Git, Docker, and CSS3 / TailwindCSS.'
  },
  {
    question: 'Are you available for freelance projects or full-time roles?',
    answer: 'Yes! I am actively available for remote full-time software engineering roles as well as select contract / freelance projects. Feel free to contact me via the contact page.'
  },
  {
    question: 'Do you provide maintenance and ongoing support after project launch?',
    answer: 'Absolutely. Every client project includes complimentary post-launch support and debugging, with flexible ongoing maintenance packages available for updates and feature additions.'
  }
];

