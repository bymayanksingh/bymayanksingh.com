import React from 'react';
import { Projects as ProjectsComponent } from '../components/Projects';
import { Terminal, Code, Folder, Search } from 'lucide-react';

export function Projects() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Projects Grid */}
        <ProjectsComponent showAll={true} />
      </div>
    </div>
  );
}
