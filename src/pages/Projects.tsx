import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ExternalLink, Code, Search, Filter, X } from 'lucide-react';
import { getAllProjects, type Project } from '../services/firebaseService';
import { ImageFallback } from '../components/ImageFallback';
import { SkillIcon } from '../components/SkillIcon';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedTech, setSelectedTech] = useState<string | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableTechs, setAvailableTechs] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProjects();
        setProjects(data);

        // Extract unique years, technologies, and categories
        const years = [...new Set(data.map(p => p.year))].sort((a, b) => b - a);
        const techs = [...new Set(data.flatMap(p => p.technologies))].sort();
        const categories = [...new Set(data.map(p => p.category))].sort();
        
        setAvailableYears(years);
        setAvailableTechs(techs);
        setAvailableCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const yearMatch = selectedYear === 'all' || project.year === selectedYear;
    const techMatch = selectedTech === 'all' || (Array.isArray(project.technologies) && project.technologies.includes(selectedTech));
    const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(project.technologies) && project.technologies.some(tech => 
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    return yearMatch && techMatch && categoryMatch && searchMatch;
  });

  const FilterBadge = ({ label, value, onClear }: { label: string; value: string | number; onClear: () => void }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full text-xs text-green-400 border border-green-400/30">
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
      <button onClick={onClear} className="hover:text-green-300">
        <X className="w-3 h-3" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-gray-800 rounded-lg aspect-video"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <Terminal className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-medium mb-2">{error}</h1>
              <p className="text-gray-400">Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl flex items-center">
            <Terminal className="w-6 h-6 mr-2 text-green-400" />
            Projects
          </h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-gray-900 text-green-400 px-4 py-2 pl-10 rounded-lg border border-gray-800 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 text-green-400"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="w-full bg-gray-800 text-green-400 px-4 py-2 rounded-lg border border-gray-700 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  <option value="all">All Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Technology Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Technology</label>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full bg-gray-800 text-green-400 px-4 py-2 rounded-lg border border-gray-700 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  <option value="all">All Technologies</option>
                  {availableTechs.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-800 text-green-400 px-4 py-2 rounded-lg border border-gray-700 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedYear !== 'all' || selectedTech !== 'all' || selectedCategory !== 'all' || searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedYear !== 'all' && (
              <FilterBadge
                label="Year"
                value={selectedYear}
                onClear={() => setSelectedYear('all')}
              />
            )}
            {selectedTech !== 'all' && (
              <FilterBadge
                label="Tech"
                value={selectedTech}
                onClear={() => setSelectedTech('all')}
              />
            )}
            {selectedCategory !== 'all' && (
              <FilterBadge
                label="Category"
                value={selectedCategory}
                onClear={() => setSelectedCategory('all')}
              />
            )}
            {searchQuery && (
              <FilterBadge
                label="Search"
                value={searchQuery}
                onClear={() => setSearchQuery('')}
              />
            )}
            <button
              onClick={() => {
                setSelectedYear('all');
                setSelectedTech('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-gray-400 hover:text-green-400"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project.slug}
              className="group bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-green-400/50 transition-colors"
            >
              <Link 
                to={project.slug ? `/projects/${project.slug}` : '#'} 
                className={`block ${!project.slug ? 'cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  if (!project.slug) {
                    e.preventDefault();
                    console.error('Project slug is missing:', project);
                  }
                }}
              >
                <div className="aspect-video bg-gray-800">
                  <ImageFallback
                    src={typeof project.coverImage === 'string' ? project.coverImage : project.coverImage.url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    fallbackClassName="w-full h-full flex items-center justify-center bg-gray-800"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg flex items-center">
                      <Code className="w-4 h-4 mr-2 text-green-400" />
                      {project.title}
                    </h2>
                    {project.website_url && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(project.website_url, '_blank', 'noopener,noreferrer');
                        }}
                        className="text-gray-400 hover:text-green-400"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(project.technologies) && project.technologies.slice(0, 4).map((tech) => (
                      <div 
                        key={`${project.id}-${tech}`}
                        className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded text-xs text-green-400"
                      >
                        <SkillIcon skill={tech} />
                        <span>{tech}</span>
                      </div>
                    ))}
                    {Array.isArray(project.technologies) && project.technologies.length > 4 && (
                      <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">No projects found</h2>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
