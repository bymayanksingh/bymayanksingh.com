import type { Hero, Project, Testimonial, TimelineItem, About, Contact, Stats, Book, Photo } from '../services/firebaseService';

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

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: string;
    location?: string;
    date?: string;
  };
}

export const fallbackPhotos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    caption: "Mountain Sunrise",
    metadata: {
      camera: "Sony A7III",
      lens: "24-70mm f/2.8",
      settings: "f/8, 1/250s, ISO 100",
      location: "Himalayas, India",
      date: "2023-06-15"
    }
  },
  {
    id: "2", 
    url: "https://images.unsplash.com/photo-1682687982501-1e58ab814714",
    caption: "Urban Architecture",
    metadata: {
      camera: "Sony A7III",
      lens: "16-35mm f/2.8",
      settings: "f/11, 1/160s, ISO 200",
      location: "Bangalore, India",
      date: "2023-07-22"
    }
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1682687218147-9806132dc697", 
    caption: "Portrait in Natural Light",
    metadata: {
      camera: "Sony A7III",
      lens: "85mm f/1.4",
      settings: "f/2.0, 1/1000s, ISO 400",
      location: "Studio, Bangalore",
      date: "2023-08-30"
    }
  }
];

export const fallbackSkills = [
  "Full-stack Development",
  "Cloud Architecture",
  "Python",
  "JavaScript",
  "TypeScript",
  "React Development",
  "Node.js Development",
  "Django Development",
  "DevOps",
  "System Design"
];

export const fallbackCertificates = [
  {
    title: "AWS Solutions Architect",
    organization: "Amazon Web Services",
    year: "2023",
    description: "Professional certification for AWS cloud architecture",
    image: "https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png",
    verified: true
  },
  {
    title: "Professional Cloud Architect",
    organization: "Google Cloud",
    year: "2023",
    description: "Expert-level certification for Google Cloud Platform",
    image: "https://images.credly.com/size/340x340/images/516f07b3-5fe7-4d69-902c-7f30e3f246f5/image.png",
    verified: true
  }
];

export const fallbackAffiliations = [
  {
    id: "1",
    name: "Tech Company A",
    role: "Senior Software Engineer",
    logo: "/images/affiliations/company-a.png",
    order: 1,
    current: true
  },
  {
    id: "2",
    name: "Tech Company B",
    role: "Software Engineer",
    logo: "/images/affiliations/company-b.png",
    order: 2,
    current: false
  }
];

export const fallbackPublications = [
  {
    id: "1",
    title: "Modern Web Architecture",
    description: "A comprehensive guide to building scalable web applications",
    link: "https://example.com/publication1",
    date: "2023",
    publisher: "Tech Journal"
  },
  {
    id: "2",
    title: "Cloud-Native Development",
    description: "Best practices for cloud-native application development",
    link: "https://example.com/publication2",
    date: "2023",
    publisher: "Cloud Computing Magazine"
  }
];

export const fallbackAwards = [
  {
    id: "1",
    title: "Innovation Award",
    organization: "Tech Conference 2023",
    date: "2023",
    description: "Recognized for innovative contributions to open-source"
  },
  {
    id: "2",
    title: "Outstanding Engineer",
    organization: "Tech Company",
    date: "2023",
    description: "Awarded for exceptional technical leadership"
  }
];

export const fallbackSpotifyData = {
  isPlaying: false,
  title: "",
  artist: "",
  album: "",
  albumImageUrl: "",
  songUrl: ""
};

export const fallbackPlaylists = [
  {
    id: "1",
    name: "Coding Focus",
    description: "Perfect playlist for deep work and coding sessions",
    imageUrl: "https://i.scdn.co/image/ab67616d0000aa54897cd4eeff3174110aa6230b",
    url: "https://open.spotify.com/playlist/0VFEzXYjNkzCMbBe6FAwyD",
    totalTracks: 42
  },
  {
    id: "2",
    name: "Soft Rock",
    description: "Relaxing tunes for unwinding",
    imageUrl: "https://mosaic.scdn.co/300/ab67616d00001e021e0fdc2906851e29d09320c3ab67616d00001e0225a4df452a3c42ccc2e9288bab67616d00001e02e319baafd16e84f0408af2a0ab67616d00001e02f73748d9d869ff756993cfde",
    url: "https://open.spotify.com/playlist/4bphvJcPJIe0DQY0fx19Md",
    totalTracks: 35
  },
  {
    id: "3",
    name: "Workout Mix",
    description: "High-energy tracks for workouts",
    imageUrl: "https://mosaic.scdn.co/300/ab67616d00001e022a6b364528b128a4a17d100dab67616d00001e02879eaf9c524b15c2534a0944ab67616d00001e02c6338d684995af10c2bf0533ab67616d00001e02dd0ade6f471dc4108ed71fa9",
    url: "https://open.spotify.com/playlist/7JjUrSzO06kZQl3hvZljvE",
    totalTracks: 50
  }
];
