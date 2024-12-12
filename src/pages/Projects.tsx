import React, { useState, useEffect } from 'react';
import { Projects as ProjectsComponent } from '../components/Projects';
import { Terminal, Code, Folder, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { TerminalLoader } from '../components/TerminalLoader'; // assuming TerminalLoader is in this location

export function Projects() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // assuming some logic to set loading to false when data is fetched
    // for demonstration purposes, setting loading to false after 2 seconds
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <TerminalLoader
        title="projects_loader.sh"
        steps={[
          { text: "Connecting to database", status: "completed" },
          { text: "Fetching project data", status: "completed" },
          { text: "Processing images", status: "completed" },
          { text: "Rendering projects", status: "loading" },
        ]}
      />
    );
  }

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
