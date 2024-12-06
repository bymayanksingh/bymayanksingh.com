import React from 'react';
import { Projects as ProjectsComponent } from '../components/Projects';
import { Terminal, Code } from 'lucide-react';

export function Projects() {
  return (
    <div className="min-h-screen bg-gray-900 font-mono">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-5 h-5 text-green-400" />
            <h1 className="text-2xl text-white">~/projects</h1>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Code className="w-4 h-4" />
            <span>ls -la</span>
          </div>
        </div>
      </div>

      {/* Projects Component */}
      <ProjectsComponent showAll={true} />
    </div>
  );
}
