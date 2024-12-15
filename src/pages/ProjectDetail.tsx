import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Terminal, ArrowLeft, Calendar, MapPin, Layout, Code, Building2, GitBranch, CheckCircle2, ImageIcon } from 'lucide-react';
import { getProject, type Project } from '../services/firebaseService';
import { ImageFallback } from '../components/ImageFallback';
import { ImageModal } from '../components/ImageModal';
import { SkillIcon } from '../components/SkillIcon';

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        console.error('Project slug is missing from URL params');
        setError('Project not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        //console.log('Attempting to fetch project with slug:', slug);
        const data = await getProject(slug);

        if (!data) {
          console.error('Project not found in database:', slug);
          setError('Project not found');
          setLoading(false);
          return;
        }

        //console.log('Successfully fetched project:', data);
        setProject(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details. Please try again later.');
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="h-96 bg-gray-800 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
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
          <Link to="/projects" className="inline-flex items-center text-green-400 hover:text-green-300 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <Terminal className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-medium mb-2">{error}</h1>
              <p className="text-gray-400 mb-8">The project you're looking for could not be found.</p>
              <Link
                to="/projects"
                className="inline-flex items-center px-4 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Code className="w-4 h-4 mr-2" />
                View All Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
    setIsImageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link to="/projects" className="inline-flex items-center text-green-400 hover:text-green-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-5 h-5 text-green-400" />
            <h1 className="text-2xl">{project.title}</h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {project.year && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{project.year}</span>
              </div>
            )}
            {project.category && (
              <div className="flex items-center">
                <GitBranch className="w-4 h-4 mr-2" />
                <span>{project.category}</span>
              </div>
            )}
            {project.status && (
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                <span>{project.status}</span>
              </div>
            )}
            {project.github_url && (
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-green-400 transition-colors"
              >
                <Code className="w-4 h-4 mr-2" />
                <span>View on GitHub</span>
              </a>
            )}
          </div>
        </div>

        {/* Main Image */}
        <div className="mb-8">
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <ImageFallback
              src={typeof project.coverImage === 'string' ? project.coverImage : project.coverImage.url}
              alt={project.title}
              className="w-full h-full object-cover"
              fallbackClassName="w-full h-full flex items-center justify-center bg-gray-800"
            />
            {typeof project.coverImage !== 'string' && project.coverImage.credit && (
              <div className="text-xs text-gray-500 mt-2">
                Photo by <a href={project.coverImage.credit.link} target="_blank" rel="noopener noreferrer" className="hover:text-green-400">{project.coverImage.credit.name}</a>
              </div>
            )}
          </div>
        </div>

        {/* Project Description */}
        <div className="mb-12">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
        </div>

        {/* Technologies */}
        {project.technologies && (
          <div className="mb-12">
            <h2 className="text-xl mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2 text-green-400" />
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',').map(t => t.trim()))
                .map((tech, index) => (
                  <div 
                    key={index} 
                    className="px-3 py-2 bg-gray-800 rounded-lg text-sm text-green-400 flex items-center gap-2 hover:bg-gray-700 transition-colors"
                  >
                    <SkillIcon skill={tech} />
                    <span>{tech}</span>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* Role */}
        {project.role && (
          <div className="mb-12">
            <h2 className="text-xl mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-green-400" />
              My Role
            </h2>
            <p className="text-gray-300 leading-relaxed">{project.role}</p>
          </div>
        )}

        {/* Project Details */}
        {project.details && (
          <div className="mb-12">
            <h2 className="text-xl mb-4 flex items-center">
              <Layout className="w-5 h-5 mr-2 text-green-400" />
              Project Details
            </h2>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {project.details}
            </div>
          </div>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div>
            <h2 className="text-xl mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-green-400" />
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.gallery.map((image, index) => (
                <div
                  key={index}
                  className="aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(index)}
                >
                  <ImageFallback
                    src={typeof image === 'string' ? image : image.url}
                    alt={`${project.title} gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                    fallbackClassName="w-full h-full flex items-center justify-center bg-gray-800"
                  />
                  {typeof image !== 'string' && image.credit && (
                    <div className="text-xs text-gray-500 mt-2">
                      Photo by <a href={image.credit.link} target="_blank" rel="noopener noreferrer" className="hover:text-green-400">{image.credit.name}</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {project.gallery && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          images={project.gallery}
          activeIndex={activeImageIndex}
          onPrevious={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : project.gallery!.length - 1))}
          onNext={() => setActiveImageIndex((prev) => (prev < project.gallery!.length - 1 ? prev + 1 : 0))}
          showNavigation={true}
          currentIndex={activeImageIndex}
          totalItems={project.gallery.length}
          title={project.title}
        />
      )}
    </div>
  );
}