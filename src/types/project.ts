export interface Project {
  title: string;
  slug: string;
  description: string;
  details: string;
  technologies: string[];
  category: string;
  status: 'Live' | 'In Progress' | 'Archived';
  featured: boolean;
  year: number;
  github_url?: string;
  website_url?: string;
  instagram_url?: string;
  icon_url?: string;
  users_count?: number;
  coverImage: string | {
    url: string;
    credit?: {
      name: string;
      link: string;
    };
  };
  gallery?: Array<{
    url: string;
    caption?: string;
  }>;
  created_at: string;
  updated_at: string;
}
