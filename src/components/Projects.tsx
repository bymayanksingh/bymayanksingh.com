import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Folder, Code, GitBranch } from 'lucide-react';
import { getProjects, type Project } from '../services/firebaseService';
import { ImageFallback } from '../components/ImageFallback';

interface ProjectsProps {
  showAll?: boolean;
}

export function Projects({ showAll = false }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        console.log('Fetching projects...');
        setLoading(true);
        setError(null);
        const allProjects = await getProjects();
        console.log('Fetched projects:', allProjects);
        
        // Filter projects based on showAll flag
        const filteredProjects = showAll 
          ? allProjects.filter(project => project.coverImage && project.coverImage.trim() !== '')
          : allProjects.filter(project => 
              project.featured && project.coverImage && project.coverImage.trim() !== ''
            );
        
        // Sort projects by year in descending order
        const sortedProjects = filteredProjects.sort((a, b) => b.year - a.year);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(sortedProjects.map(project => project.category))
        ).filter(Boolean); // Remove any undefined/null categories
        
        console.log('Available categories:', uniqueCategories);
        setProjects(sortedProjects);
        setCategories(['all', ...uniqueCategories.sort()]);
        setFilteredProjects(sortedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [showAll]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      const filtered = showAll ? projects : projects.filter(project => project.featured);
      console.log('Filtered projects (All category):', filtered);
      setFilteredProjects(filtered);
    } else {
      const filtered = projects.filter(project => 
        project.category === selectedCategory && (showAll || project.featured)
      );
      console.log('Filtered projects (category specific):', filtered);
      setFilteredProjects(filtered);
    }
  }, [selectedCategory, projects, showAll]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No projects found</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`bg-gray-900 ${!showAll ? 'py-16' : 'pb-16'} font-mono`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showAll && (
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
        )}

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
              to={`/projects/${project.slug}`}
              className="group"
              onClick={() => {
                console.log('Navigating to project:', {
                  id: project.id,
                  slug: project.slug,
                  title: project.title,
                  category: project.category
                });
              }}
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
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{project.year}</span>
                    <span>•</span>
                    <span>{project.category}</span>
                  </div>
                </div>

                {/* Project Image */}
                <div className="relative aspect-video bg-gray-800">
                  <ImageFallback
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-2 py-1 bg-gray-900/50 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}