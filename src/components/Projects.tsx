import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Folder, Code, GitBranch, ArrowRight } from 'lucide-react';
import { getProjects, type Project } from '../services/firebaseService';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(data.map(project => project.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => 
    selectedCategory === 'all' || project.category === selectedCategory
  );

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="py-20 text-center">{error}</div>;
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
                    {[
                      { color: 'red', key: 'close' },
                      { color: 'yellow', key: 'minimize' },
                      { color: 'green', key: 'maximize' }
                    ].map(({ color, key }) => (
                      <div key={key} className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">{project.category}</div>
                </div>

                {/* Project Image */}
                <div className="relative aspect-video">
                  <img
                    src={project.image}
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