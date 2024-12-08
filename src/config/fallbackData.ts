import type { Hero, Project, Testimonial, TimelineItem, About, Contact, Stats } from '../services/firebaseService';

export const fallbackHero: Hero = {
  name: "Mayank Singh",
  title: "Architect & Designer",
  subtitle: "Creating spaces that inspire",
  backgroundImage: "/images/hero-bg.jpg",
  stats: {
    projects: 50,
    awards: 10,
    experience: 8
  }
};

export const fallbackProjects: Project[] = [
  {
    title: "Urban Harmony Center",
    category: "Commercial",
    location: "Mumbai, India",
    date: "2023",
    year: 2023,
    coverImage: "/images/projects/project1.jpg",
    description: "A modern commercial complex focusing on sustainable design",
    client: "Urban Development Corp",
    area: "50,000 sq ft",
    status: "Completed",
    details: [
      "Sustainable design principles",
      "LEED Gold certification",
      "Innovative space utilization"
    ],
    gallery: [
      {
        url: "/images/projects/project1-1.jpg",
        caption: "Main entrance view"
      },
      {
        url: "/images/projects/project1-2.jpg",
        caption: "Interior atrium"
      }
    ]
  }
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jane Smith",
    role: "CEO, Urban Development Corp",
    content: "Working with Mayank was an incredible experience. Her attention to detail and innovative approach to sustainable design exceeded our expectations.",
    image: "/images/testimonials/john.jpg"
  }
];

export const fallbackTimeline: TimelineItem[] = [
  {
    id: "1",
    year: 2023,
    event: "Lead Architect, Urban Harmony Center",
    description: "Leading innovative sustainable architecture projects",
    icon: "Building2",
    color: "text-emerald-600",
    details: "Spearheaded multiple award-winning sustainable design projects"
  },
  {
    id: "2",
    year: 2021,
    event: "International Architecture Award",
    description: "Recognized for excellence in sustainable design",
    icon: "Award",
    color: "text-blue-600",
    details: "Received the prestigious International Architecture Award"
  },
  {
    id: "3",
    year: 2019,
    event: "Founded Studio Arc",
    description: "Established independent architectural practice",
    icon: "Briefcase",
    color: "text-purple-600",
    details: "Launched an independent practice focusing on sustainable solutions"
  }
];

export const fallbackAbout: About = {
  id: "1",
  name: "Mayank Singh",
  title: "Lead Architect & Designer",
  description: "Passionate architect with 8+ years of experience in sustainable design and urban development.",
  image: "/images/about/pmayank.jpg",
  email: "contact@pmayank.com",
  phone: "+91 98765 43210",
  linkedin: "https://linkedin.com/in/pmayank",
  resume: "/files/pmayank-resume.pdf"
};

export const fallbackContact: Contact = {
  title: "Get in Touch",
  description: "Let's discuss your architectural vision",
  email: "contact@pmayank.com",
  phone: "+91 98765 43210",
  address: "Mumbai, India",
  availability: "Monday - Friday, 9:00 AM - 6:00 PM"
};

export const fallbackStats: Stats = {
  id: 'stats',
  items: [
    { icon: 'Building2', label: 'Projects', value: '50+' },
    { icon: 'Award', label: 'Awards', value: '12' },
    { icon: 'Users', label: 'Clients', value: '100+' }
  ]
};
