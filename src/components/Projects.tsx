import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Folder, Code, GitBranch, ArrowRight } from 'lucide-react';
import { getProjects, type Project } from '../services/firebaseService';

const getGoogleDriveDirectUrl = (url: string): string => {
  if (!url) return '';
  // Check if it's already a Google Drive export URL
  if (url.includes('export=view')) {
    return url;
  }
  // Extract file ID from various Google Drive URL formats
  const fileId = url.match(/[-\w]{25,}/);
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
  }
  return url;
};

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const allProjects = await getProjects();
        
        // Filter only featured projects
        const featuredProjects = allProjects.filter(project => project.featured);
        
        // Extract unique categories from featured projects only
        const uniqueCategories = Array.from(
          new Set(featuredProjects.map(project => project.category))
        ).filter(Boolean); // Remove any undefined/null categories
        
        setProjects(featuredProjects);
        setCategories(['all', ...uniqueCategories]);
        
        console.log('Fetched featured projects:', featuredProjects.length);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-900 py-16 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* IDE-like Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-2xl text-white">~/projects</h2>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Code className="w-4 h-4" />
            <span>git branch --list</span>
          </div>
        </div>

        {/* Category Filter - Git Branch Style */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600/20 text-green-400 border border-green-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="group"
            >
              {/* Project Card - Code Editor Style */}
              <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-green-400/50 transition-colors">
                {/* Window Controls */}
                <div className="px-4 py-2 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-400">{project.category}</div>
                </div>

                {/* Project Image */}
                <div className="relative aspect-video bg-gray-800">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Error loading image for project: ${project.title}`, project.coverImage);
                      e.currentTarget.src = '/placeholder-project.jpg';
                      e.currentTarget.classList.add('opacity-50');
                    }}
                  />
                </div>

                {/* Project Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4 text-green-400" />
                    <h3 className="text-white font-medium">{project.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {project.technologies?.map((tech, techIndex) => (
                      <span key={techIndex}>{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}