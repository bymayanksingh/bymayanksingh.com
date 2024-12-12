import type { Hero, Project, Testimonial, TimelineItem, About, Contact, Stats, Book } from '../services/firebaseService';

export const fallbackHero: Hero = {
  name: "Mayank Singh",
  title: "Software Engineer",
  subtitle: "Building innovative solutions with code",
  backgroundImage: "/images/hero-bg.jpg",
  stats: {
    projects: 50,
    awards: 10,
    experience: 8
  }
};

export const fallbackProjects: Project[] = [
  {
    title: "Cloud-Native Analytics Platform",
    category: "Enterprise Software",
    location: "Remote",
    date: "2023",
    year: 2023,
    coverImage: "/images/projects/project1.jpg",
    description: "A scalable analytics platform built with modern cloud technologies",
    client: "Tech Solutions Inc",
    area: "Backend Infrastructure",
    status: "Completed",
    details: [
      "Microservices architecture",
      "Kubernetes deployment",
      "Real-time data processing"
    ],
    gallery: [
      {
        url: "/images/projects/project1-1.jpg",
        caption: "System Architecture"
      },
      {
        url: "/images/projects/project1-2.jpg",
        caption: "Dashboard Interface"
      }
    ]
  }
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jane Smith",
    role: "CTO, Tech Solutions Inc",
    content: "Mayank's expertise in cloud architecture and system design helped us build a highly scalable and maintainable platform. His attention to code quality and performance was exceptional.",
    image: "/images/testimonials/john.jpg"
  }
];

export const fallbackTimeline: TimelineItem[] = [
  {
    id: "1",
    year: 2023,
    event: "Lead Software Engineer, Cloud Platform",
    description: "Leading cloud-native development projects",
    icon: "Code",
    color: "text-emerald-600",
    details: "Architected and implemented scalable cloud solutions using modern technologies"
  },
  {
    id: "2",
    year: 2021,
    event: "Innovation in Tech Award",
    description: "Recognized for technical excellence",
    icon: "Award",
    color: "text-blue-600",
    details: "Received award for innovative contributions to open-source projects"
  },
  {
    id: "3",
    year: 2019,
    event: "Senior Software Engineer",
    description: "Full-stack development and system design",
    icon: "Briefcase",
    color: "text-purple-600",
    details: "Led development of enterprise-scale applications and mentored junior developers"
  }
];

export const fallbackAbout: About = {
  id: "1",
  name: "Mayank Singh",
  title: "Software Engineer",
  description: "Passionate software engineer with 8+ years of experience in full-stack development, cloud architecture, and system design.",
  image: "/images/about/pmayank.jpg",
  email: "contact@bymayanksingh.com",
  phone: "+91 98765 43210",
  linkedin: "https://linkedin.com/in/bymayanksingh",
  resume: "/files/mayank-resume.pdf",
  city: "Bangalore",
  country: "India",
  shortDescription: "Software Engineer specializing in cloud-native solutions",
  services: ["Full-stack Development", "Cloud Architecture", "System Design", "DevOps"],
};

export const fallbackContact: Contact = {
  title: "Get in Touch",
  description: "Let's discuss your next software project",
  email: "contact@bymayanksingh.com",
  phone: "+91 98765 43210",
  address: "Bangalore, India",
  socials: {
    github: "https://github.com/bymayanksingh",
    linkedin: "https://linkedin.com/in/bymayanksingh",
    twitter: "https://twitter.com/bymayanksingh"
  }
};

export const fallbackStats: Stats = {
  projects: 50,
  experience: 8,
  awards: 10,
  clients: 20
};

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  review: string;
  rating: number;
  coverImage: string;
  genre: string;
  readDate: string;
}

export const fallbackBooks: Book[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship that revolutionizes the way we think about programming.",
    review: "This book fundamentally changed how I approach software development. The principles of clean code have become an integral part of my daily coding practices.",
    rating: 5,
    coverImage: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg",
    genre: "Software Engineering",
    readDate: "2023-06"
  },
  {
    id: "2",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    description: "A deep dive into the principles and practices of modern data system architecture.",
    review: "An exceptional resource for understanding distributed systems. The author's clear explanations of complex concepts make this a must-read for any software engineer working with data systems.",
    rating: 5,
    coverImage: "https://m.media-amazon.com/images/I/51ZSpMl1-LL._SX379_BO1,204,203,200_.jpg",
    genre: "System Design",
    readDate: "2023-08"
  },
  {
    id: "3",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    description: "A collection of practical approaches to software development that will make you a better programmer.",
    review: "This book offers timeless advice for software development. The concepts of DRY, orthogonality, and tracer bullets have greatly influenced my approach to problem-solving.",
    rating: 4,
    coverImage: "https://m.media-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg",
    genre: "Software Engineering",
    readDate: "2023-10"
  }
];
