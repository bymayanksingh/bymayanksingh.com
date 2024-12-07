import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code, GitBranch, ArrowRight, Command } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-900 font-mono flex items-center justify-center">
        <div className="flex items-center space-x-3 text-green-400">
          <Command className="w-5 h-5 animate-spin" />
          <span>Loading projects...</span>
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
    <section className={`bg-gray-950 ${!showAll ? 'py-16' : ''} font-mono`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showAll && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="w-5 h-5 text-green-400" />
              <h2 className="text-2xl text-green-400">~/featured-projects</h2>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm pl-7">
              <Code className="w-4 h-4" />
              <span>git checkout featured</span>
            </div>
          </div>
        )}

        {/* Category Filter - Git Branch Style */}
        {showAll && (
          <div className="mb-8 bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            {/* Terminal Header */}
            <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>git checkout projects</span>
                </div>
              </div>
            </div>

            {/* Categories Content */}
            <div className="p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                <span className="text-green-400/90">❯</span>
                <span>categories.sh</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-green-400/10 text-green-400 border border-green-400/30'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-gray-800/50'
                    }`}
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="group block"
              onClick={() => {
                console.log('Navigating to project:', {
                  id: project.id,
                  slug: project.slug,
                  title: project.title,
                  category: project.category
                });
              }}
            >
              {/* Project Card - Terminal Style */}
              <div className="group bg-gray-950 rounded-lg overflow-hidden border border-gray-800/50 hover:border-green-400/30 transition-all duration-300 relative">
                {/* Terminal Header */}
                <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 group-hover:bg-red-400/90 transition-colors"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 group-hover:bg-yellow-400/90 transition-colors"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 group-hover:bg-green-400/90 transition-colors"></div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>project.sh</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                    <span>{project.year}</span>
                    <span>•</span>
                    <span>{project.category}</span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="relative aspect-video bg-gray-950">
                  {/* Subtle Tech Pattern Background */}
                  <div className="absolute inset-0 bg-gray-950 overflow-hidden">
                    {/* Fine Grid */}
                    <div className="absolute inset-0"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgba(4, 120, 87, 0.02) 1px, transparent 1px)`,
                        backgroundSize: '80px 100%',
                        opacity: '0.2'
                      }}
                    />

                    {/* Soft Gradient */}
                    <div className="absolute inset-0 opacity-10"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(4, 120, 87, 0.1), transparent 70%)'
                      }}
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-950/98 via-gray-950/95 to-gray-950/98" />

                    {/* Hover Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(4, 120, 87, 0.03), transparent 60%)'
                      }}
                    />
                  </div>
                  
                  {/* Terminal-style Content */}
                  <div className="absolute inset-0 p-5">
                    <div className="h-full flex flex-col justify-between">
                      {/* Project Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-400/80">
                          <span className="text-green-400/90">❯</span>
                          <span className="text-sm group-hover:text-green-400/90 transition-colors">cat README.md</span>
                        </div>
                        <h3 className="text-lg font-medium text-white/90 group-hover:text-green-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-400/90 line-clamp-2">
                          {project.description}
                        </p>
                      </div>

                      {/* Technologies */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-400/80">
                          <span className="text-green-400/90">❯</span>
                          <span className="text-sm group-hover:text-green-400/90 transition-colors">ls tech/</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-900/80 text-gray-400 rounded border border-gray-800/50 backdrop-blur-sm"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies && project.technologies.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-900/80 text-gray-400 rounded border border-gray-800/50 backdrop-blur-sm">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-2 text-green-400/90 text-sm">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
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