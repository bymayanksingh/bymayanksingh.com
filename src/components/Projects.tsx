import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { getProjects, type Project } from '../services/firebaseService';
import { ImageFallback } from '../components/ImageFallback';
import { TerminalLoader } from './TerminalLoader';

const { Terminal, Code, GitBranch, ArrowRight, Command } = LucideIcons;

// Memoized category button component
const CategoryButton = memo(({ 
  category, 
  isSelected, 
  onClick 
}: { 
  category: string; 
  isSelected: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-all duration-200 ${
      isSelected
        ? 'bg-green-400/10 text-green-400 border border-green-400/30'
        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-gray-800/50'
    }`}
  >
    <GitBranch className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
    <span>{category}</span>
  </button>
));

// Memoized project card component
const ProjectCard = memo(({ project }: { project: Project }) => (
  <Link
    to={`/projects/${project.slug}`}
    className="group bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 backdrop-blur-sm"
  >
    <div className="aspect-video overflow-hidden relative">
      <ImageFallback
        src={project.coverImage}
        alt={project.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="p-4 sm:p-5">
      <h3 className="text-lg sm:text-xl font-semibold text-green-400 group-hover:text-green-300 transition-colors mb-2">
        {project.title}
      </h3>
      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors mb-4 line-clamp-2">
        {project.description}
      </p>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-gray-500">{project.year}</span>
        <span className="text-gray-400 group-hover:text-green-400 transition-colors flex items-center space-x-1">
          <span>View Project</span>
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  </Link>
));

interface ProjectsProps {
  showAll?: boolean;
}

export function Projects({ showAll = false }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Memoize categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(projects.map(project => project.category))
    ).filter(Boolean);
    return ['all', ...uniqueCategories.sort()];
  }, [projects]);

  // Memoize filtered projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') {
      return showAll ? projects : projects.filter(project => project.featured);
    }
    return projects.filter(project =>
      project.category === selectedCategory && (showAll || project.featured)
    );
  }, [selectedCategory, projects, showAll]);

  // Memoize category selection handler
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const allProjects = await getProjects();

        if (!controller.signal.aborted) {
          // Sort projects by year in descending order
          const sortedProjects = allProjects.sort((a, b) => b.year - a.year);
          setProjects(sortedProjects);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error fetching projects:', error);
          setError('Failed to load projects. Please try again later.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    
    fetchProjects();
    
    return () => controller.abort();
  }, [showAll]);

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
                  <CategoryButton
                    key={category}
                    category={category}
                    isSelected={selectedCategory === category}
                    onClick={() => handleCategorySelect(category)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}