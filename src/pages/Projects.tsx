import React from 'react';
import { Projects as ProjectsComponent } from '../components/Projects';
import { Terminal, Code, Folder, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export function Projects() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <PageHeader 
          path="projects" 
          description="A collection of software projects and technical solutions I've worked on"
        />

        {/* Projects Grid */}
        <ProjectsComponent showAll={true} />
      </div>
    </div>
  );
}
