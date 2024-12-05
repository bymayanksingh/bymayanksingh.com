import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Terminal, ArrowLeft, Calendar, MapPin, Layout, Code, Building2, GitBranch, CheckCircle2, ImageIcon } from 'lucide-react';
import { getProject, type Project } from '../services/firebaseService';
import { ImageFallback } from '../components/ImageFallback';
import { ImageModal } from '../components/ImageModal';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        const data = await getProject(id);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handlePreviousImage = () => {
    if (!project?.gallery) return;
    setActiveImageIndex((prev) => (prev === 0 ? project.gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!project?.gallery) return;
    setActiveImageIndex((prev) => (prev === project.gallery.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-mono flex items-center justify-center">
        <div className="animate-pulse text-green-400">Loading project data...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-mono flex items-center justify-center">
        <div className="text-red-400">{error || 'Project not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          to="/projects"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>cd ..</span>
        </Link>

        {/* Project Header */}
        <div className="border border-gray-800 rounded-lg bg-gray-900 mb-8">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Terminal className="w-5 h-5 text-green-400" />
              <h1 className="text-xl font-semibold">{project.title}</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <GitBranch className="w-4 h-4" />
              <span>{project.category}</span>
            </div>
          </div>

          {/* Project Meta */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{project.date}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Layout className="w-4 h-4" />
              <span>{project.area}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Building2 className="w-4 h-4" />
              <span>{project.client}</span>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover Image */}
            <div 
              className="border border-gray-800 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(-1)} // -1 indicates cover image
            >
              <ImageFallback
                src={project.coverImage}
                alt={project.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Description */}
            <div className="border border-gray-800 rounded-lg bg-gray-900">
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-green-400" />
                  <h2 className="text-lg">README.md</h2>
                </div>
              </div>
              <div className="p-6 prose prose-invert max-w-none">
                <p className="text-gray-400">{project.description}</p>
                <div className="mt-6 space-y-2">
                  {project.details.map((detail, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-400">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="border border-gray-800 rounded-lg bg-gray-900">
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-green-400" />
                  <h2 className="text-lg">gallery/</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((image, index) => (
                    <div 
                      key={index}
                      className="group relative border border-gray-800 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    >
                      <ImageFallback
                        src={image.url}
                        alt={image.caption}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-sm text-white">{image.caption}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Info */}
            <div className="border border-gray-800 rounded-lg bg-gray-900">
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <h2 className="text-lg">project.info</h2>
                </div>
              </div>
              <div className="p-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-400">{project.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Year</dt>
                    <dd className="mt-1 text-sm text-gray-400">{project.year}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Featured</dt>
                    <dd className="mt-1 text-sm text-gray-400">{project.featured ? 'Yes' : 'No'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={[{ url: project.coverImage, caption: project.title }, ...project.gallery]}
        currentIndex={activeImageIndex === -1 ? 0 : activeImageIndex + 1}
        totalItems={project.gallery.length + 1}
        showNavigation={true}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
        title={`${project.title} - Image ${activeImageIndex === -1 ? 1 : activeImageIndex + 2}/${project.gallery.length + 1}`}
      />
    </div>
  );
}