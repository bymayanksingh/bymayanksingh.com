import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Search, GitBranch, Code, Folder, ArrowRight, Command } from 'lucide-react';
import { getProjects } from '../services/firebaseService';
import type { Project } from '../services/firebaseService';
import { ImageFallback } from '../components/ImageFallback';

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
        console.log('Fetching all projects...');
        const data = await getProjects();
        
        // Filter out projects without images and sort by year
        const validProjects = data
          .filter(project => project.coverImage && project.coverImage.trim() !== '')
          .sort((a, b) => {
            const yearA = typeof a.year === 'string' ? parseInt(a.year) : a.year || 0;
            const yearB = typeof b.year === 'string' ? parseInt(b.year) : b.year || 0;
            return yearB - yearA;
          });
        
        setProjects(validProjects);
        
        // Extract unique categories
        const uniqueCategories = new Set(
          validProjects
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
        setFilteredProjects(validProjects);
        console.log('Projects loaded successfully:', validProjects.length);
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
        projectLocation.includes(searchTerm);
      
      const matchesCategory = activeCategory === 'all' || projectCategory === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredProjects(filtered);
  }, [searchQuery, activeCategory, projects]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <Terminal className="w-12 h-12 mb-4" />
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">~/projects</h1>
        <p className="text-gray-400 flex items-center space-x-2">
          <Code className="w-4 h-4" />
          <span>Explore my latest projects and experiments</span>
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="block w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
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
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Folder className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No projects found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug || project.id}`}
              className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative aspect-video">
                <ImageFallback
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-green-400 flex items-center space-x-2">
                    <span>View Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2">
                  <Folder className="w-4 h-4 text-green-400" />
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  {project.location && (
                    <span className="flex items-center mr-4">
                      <Terminal className="w-4 h-4 mr-1" />
                      {project.location}
                    </span>
                  )}
                  {project.year && (
                    <span className="flex items-center">
                      <GitBranch className="w-4 h-4 mr-1" />
                      {project.year}
                    </span>
                  )}
                  {project.status && (
                    <span className="flex items-center">
                      <Code className="w-4 h-4 mr-1" />
                      {project.status}
                    </span>
                  )}
                </div>
                {project.category && (
                  <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600">
                    {project.category}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}