export const mockResumeAnalysis = {
  totalScore: 78,
  placementReadiness: 72,
  strength: 'Above Average',
  parsedInfo: {
    name: 'Alex Developer',
    email: 'alex.developer@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/alexdev',
    github: 'github.com/alexdev',
    portfolio: '',
    location: 'San Francisco, CA',
    experience: '4 Years'
  },
  missingDetails: ['Portfolio'],
  atsBreakdown: {
    compatibility: 85,
    keywordsMatch: 70,
    skillsCoverage: 75,
    formatting: 90,
    readability: 82,
    recruiterImpact: 68
  },
  radarData: [
    { subject: 'Skills', A: 85, fullMark: 100 },
    { subject: 'Keywords', A: 70, fullMark: 100 },
    { subject: 'Experience', A: 78, fullMark: 100 },
    { subject: 'Projects', A: 65, fullMark: 100 },
    { subject: 'Education', A: 90, fullMark: 100 },
    { subject: 'Formatting', A: 88, fullMark: 100 },
  ],
  skillsDistribution: [
    { name: 'Technical', value: 45, fill: '#7C3AED' },
    { name: 'Frameworks', value: 30, fill: '#8B5CF6' },
    { name: 'Tools', value: 15, fill: '#F59E0B' },
    { name: 'Soft Skills', value: 10, fill: '#22C55E' },
  ],
  strengths: [
    'Strong technical skills and framework knowledge',
    'Clear and ATS-friendly formatting',
    'Good action verbs used in recent experience',
    'Relevant education background'
  ],
  weaknesses: [
    'Missing measurable achievements (metrics/numbers)',
    'Missing portfolio link',
    'Some older projects lack technical depth',
    'No recent certifications listed'
  ],
  keywords: {
    matched: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Agile', 'API'],
    missing: ['AWS', 'Docker', 'GraphQL', 'CI/CD', 'Microservices'],
    recommended: ['Cloud Computing', 'System Design', 'Kubernetes'],
    priority: ['AWS', 'Docker', 'Microservices']
  },
  skillsGap: {
    found: ['JavaScript', 'React', 'Node.js', 'Express', 'Tailwind CSS', 'Git'],
    missing: ['Python', 'Docker', 'AWS', 'Redis', 'GraphQL'],
    recommended: ['PostgreSQL', 'Next.js', 'Prisma', 'Jest']
  },
  sectionAnalysis: {
    experience: {
      score: 75,
      feedback: 'Good use of action verbs. Needs more measurable achievements (e.g., "improved performance by 20%").'
    },
    projects: {
      score: 65,
      feedback: 'Projects are relevant but lack documentation of business impact or complex problem-solving.'
    },
    education: {
      score: 95,
      feedback: 'Well formatted. Relevant degree.'
    }
  },
  certifications: {
    recommended: ['AWS Certified Developer', 'Docker Certified Associate', 'CKAD: Certified Kubernetes Application Developer']
  },
  careerPath: {
    role: 'Full Stack Developer',
    confidence: 88
  },
  recruiterFeedback: 'This resume demonstrates strong foundational skills and relevant experience. However, the lack of quantified achievements makes it hard to measure the actual business impact. Adding specific metrics and missing cloud skills would significantly improve interview conversion rates.',
  aiImprovements: {
    summary: 'A proactive Full Stack Developer with 4 years of experience building scalable web applications using React and Node.js. Proven ability to deliver high-quality software, seeking to leverage expertise in modern JavaScript frameworks to drive innovation.',
    experienceBullets: [
      'Engineered a scalable microservices architecture using Node.js and Express, reducing API latency by 35%.',
      'Spearheaded the migration of a legacy dashboard to React/Next.js, resulting in a 50% improvement in load times.',
      'Mentored 3 junior developers, establishing code review practices that decreased bug rate by 20%.'
    ]
  },
  roadmap: [
    { week: 'Week 1', task: 'Fix ATS formatting issues & Add missing portfolio link', status: 'pending' },
    { week: 'Week 2', task: 'Quantify achievements with business metrics', status: 'pending' },
    { week: 'Week 3', task: 'Add recommended priority keywords (AWS, Docker)', status: 'pending' },
    { week: 'Week 4', task: 'Optimize LinkedIn profile to match resume', status: 'pending' },
    { week: 'Week 5', task: 'Obtain AWS Certified Developer certification', status: 'pending' }
  ]
};
