import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Search, GitBranch, Code, Folder, ArrowRight, Command } from 'lucide-react';
import { getProjects } from '../services/firebaseService';
import type { Project } from '../services/firebaseService';

interface Category {
  id: string;
  name: string;
}

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All Projects' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
        
        const uniqueCategories = new Set(
          data
            .filter(project => project.category)
            .map(project => (project.category || '').toLowerCase().trim())
        );
        
        const formattedCategories: Category[] = [
          { id: 'all', name: 'All Projects' },
          ...Array.from(uniqueCategories).map(category => ({
            id: category,
            name: category.charAt(0).toUpperCase() + category.slice(1)
          }))
        ];
        setCategories(formattedCategories);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project => {
      const projectCategory = (project.category || '').toLowerCase().trim();
      const projectTitle = (project.title || '').toLowerCase().trim();
      const projectLocation = (project.location || '').toLowerCase().trim();
      const searchTerm = searchQuery.toLowerCase().trim();
      
      const matchesSearch = searchQuery === '' || 
        projectTitle.includes(searchTerm) ||
        projectCategory.includes(searchTerm) ||
        projectLocation.includes(searchTerm);
      
      const matchesCategory = activeCategory === 'all' || projectCategory === activeCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredProjects(filtered);
  }, [searchQuery, activeCategory, projects]);

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
      <div className="min-h-screen bg-gray-900 font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 font-mono py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-5 h-5 text-green-400" />
            <h1 className="text-2xl text-white">~/projects</h1>
          </div>
          <p className="text-gray-400 flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>Explore my latest projects and experiments</span>
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-12">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="block w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-2 space-x-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-green-600/20 text-green-400 border border-green-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group"
            >
              {/* Project Card */}
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
                <div className="relative aspect-video">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-green-400 flex items-center space-x-2">
                      <span>View Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
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
                    <span>{project.year}</span>
                    <span>{project.location}</span>
                    <span>{project.status}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400">No projects found matching your criteria</div>
          </div>
        )}
      </div>
    </div>
  );
}