import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code, GitBranch, ArrowRight, Command } from 'lucide-react';
import { getProjects, type Project } from '../services/firebaseService';
import { ImageFallback } from '../components/ImageFallback';
import { TerminalLoader } from './TerminalLoader';

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
          ? allProjects
          : allProjects.filter(project => project.featured);

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
      <TerminalLoader
        title="projects_loader.sh"
        steps={[
          { text: "Establishing database connection", status: "completed" },
          { text: "Fetching project data", status: "completed" },
          { text: "Processing project images", status: "completed" },
          { text: "Preparing project gallery", status: "loading" },
        ]}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 font-mono flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 shadow-2xl shadow-purple-500/5">
            <div className="px-4 py-2 bg-gray-900/90 border-b border-gray-700 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs text-gray-400">error.sh</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-2 text-red-400">
                <Terminal className="w-4 h-4" />
                <span className="text-gray-400">$</span>
                <span className="text-red-300">Error: {error}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="min-h-screen bg-gray-950 font-mono flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 shadow-2xl shadow-purple-500/5">
            <div className="px-4 py-2 bg-gray-900/90 border-b border-gray-700 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              </div>
              <span className="text-xs text-gray-400">empty.sh</span>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-2 text-yellow-400">
                <Terminal className="w-4 h-4" />
                <span className="text-gray-400">$</span>
                <span className="text-yellow-300">No projects found</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`bg-gray-950 ${!showAll ? 'py-8 sm:py-12 md:py-16' : ''} font-mono`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showAll && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <h2 className="text-xl sm:text-2xl text-green-400">~/featured-projects</h2>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm pl-6 sm:pl-7">
              <Code className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>git checkout featured</span>
            </div>
          </div>
        )}

        {/* Category Filter - Git Branch Style */}
        {showAll && (
          <div className="mb-6 sm:mb-8 bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            {/* Terminal Header */}
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1 sm:space-x-1.5">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
                  <GitBranch className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>git checkout projects</span>
                </div>
              </div>
            </div>

            {/* Categories Content */}
            <div className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-3">
                <span className="text-green-400/90">❯</span>
                <span>categories.sh</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-green-400/10 text-green-400 border border-green-400/30'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-gray-800/50'
                    }`}
                  >
                    <GitBranch className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
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
              <div className="group bg-gray-950 rounded-lg overflow-hidden border border-gray-800/50 hover:border-green-400/30 transition-all duration-300 relative hover:shadow-lg hover:shadow-green-400/5 transform hover:-translate-y-1">
                {/* Terminal Header */}
                <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1 sm:space-x-1.5">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80 group-hover:bg-red-400/90 group-hover:scale-110 transition-all"></div>
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80 group-hover:bg-yellow-400/90 group-hover:scale-110 transition-all delay-75"></div>
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80 group-hover:bg-green-400/90 group-hover:scale-110 transition-all delay-150"></div>
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-400 font-medium pl-2 flex items-center space-x-1.5 transition-colors">
                      <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden xs:inline">project.sh</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    <span>{project.year}</span>
                    <span>•</span>
                    <span className="hidden xs:inline">{project.category}</span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="relative aspect-video bg-gray-950">
                  {/* Enhanced Tech Pattern Background */}
                  <div className="absolute inset-0 bg-gray-950 overflow-hidden">
                    {/* Fine Grid */}
                    <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-30"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(4, 120, 87, 0.02) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(4, 120, 87, 0.02) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                      }}
                    />

                    {/* Soft Gradient */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(4, 120, 87, 0.15), transparent 70%)'
                      }}
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-950/98 via-gray-950/95 to-gray-950/98" />

                    {/* Hover Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(4, 120, 87, 0.05), transparent 60%)'
                      }}
                    />
                  </div>

                  {/* Terminal-style Content */}
                  <div className="absolute inset-0 p-3 sm:p-4 md:p-5">
                    <div className="h-full flex flex-col justify-between">
                      {/* Project Info */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center space-x-2 text-gray-400/80">
                          <span className="text-green-400/90 group-hover:animate-pulse">❯</span>
                          <span className="text-xs sm:text-sm group-hover:text-green-400/90 transition-colors">cat README.md</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-white/90 group-hover:text-green-400 transition-colors line-clamp-1 sm:line-clamp-none">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400/90 line-clamp-2 group-hover:text-gray-300/90 transition-colors">
                          {project.description}
                        </p>
                      </div>

                      {/* Technologies */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center space-x-2 text-gray-400/80">
                          <span className="text-green-400/90 group-hover:animate-pulse">❯</span>
                          <span className="text-xs sm:text-sm group-hover:text-green-400/90 transition-colors">ls tech/</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {project.technologies?.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-gray-900/80 text-gray-400 rounded border border-gray-800/50 backdrop-blur-sm group-hover:border-green-400/20 group-hover:text-gray-300 transition-all"
                              style={{
                                transitionDelay: `${index * 50}ms`
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies && project.technologies.length > 3 && (
                            <span 
                              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-gray-900/80 text-gray-400 rounded border border-gray-800/50 backdrop-blur-sm group-hover:border-green-400/20 group-hover:text-gray-300 transition-all"
                              style={{
                                transitionDelay: '150ms'
                              }}
                            >
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="absolute bottom-0 right-0 p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-green-400/90 text-xs sm:text-sm">
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
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