import { useState, useEffect, lazy, Suspense } from 'react';
import { Terminal, ExternalLink, Download } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { TerminalLoader } from '../components/TerminalLoader';

// Lazy loaded iframe component
const ResumeViewer = lazy(() => Promise.resolve({
  default: ({ src }: { src: string }) => (
    <iframe
      src={src}
      className="w-full h-[calc(100vh-350px)] sm:h-[calc(100vh-300px)]"
      frameBorder="0"
      allowFullScreen
      loading="lazy"
    />
  )
}));

// Loading skeleton for the resume viewer
const ResumeViewerSkeleton = () => (
  <div className="animate-pulse bg-gray-800/50 w-full h-[calc(100vh-350px)] sm:h-[calc(100vh-300px)] flex items-center justify-center">
    <div className="text-gray-500 flex flex-col items-center gap-4">
      <Terminal className="w-8 h-8 animate-spin" />
      <span>Loading resume viewer...</span>
    </div>
  </div>
);

// Memoized header component
const ResumeHeader = ({ downloadUrl, viewUrl }: { downloadUrl: string; viewUrl: string }) => (
  <div className="px-2 sm:px-4 py-2 sm:py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
    {/* Left side - Terminal dots and filename */}
    <div className="flex items-center space-x-2 w-full sm:w-auto">
      <div className="flex space-x-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
      </div>
      <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
        <Terminal className="w-3.5 h-3.5" />
        <span>resume.pdf</span>
      </div>
    </div>

    {/* Right side - Action buttons */}
    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-green-400/10 hover:bg-green-400/20 text-green-400 rounded transition-all duration-300 flex-1 sm:flex-none justify-center sm:justify-start"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Download</span>
      </a>
      <a
        href={viewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 rounded transition-all duration-300 flex-1 sm:flex-none justify-center sm:justify-start"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span>Open</span>
      </a>
    </div>
  </div>
);

export function Resume() {
  // Original URL: https://drive.google.com/file/d/1KFrWBTHO5dlHXcP-TZhlsuUhV4SvIqBo/view
  // Convert to embed URL format
  const fileId = "1KFrWBTHO5dlHXcP-TZhlsuUhV4SvIqBo";
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Reduced loading time

    // Preload the iframe source
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'document';
    preloadLink.href = embedUrl;
    document.head.appendChild(preloadLink);

    return () => {
      clearTimeout(timer);
      document.head.removeChild(preloadLink);
    };
  }, [embedUrl]);

  useEffect(() => {
    // Add event listener for the iframe load
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'iframe-loaded') {
        setIframeLoaded(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (loading) {
    return (
      <TerminalLoader
        title="resume_loader.sh"
        steps={[
          { text: "Initializing resume viewer", status: "completed" },
          { text: "Loading document", status: "loading" },
        ]}
      />
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen font-mono pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <PageHeader
          path="resume"
          description="My professional experience and qualifications"
        />

        <div className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
          <ResumeHeader downloadUrl={downloadUrl} viewUrl={viewUrl} />

          {/* Resume Viewer */}
          <div className="flex-1 bg-white">
            <Suspense fallback={<ResumeViewerSkeleton />}>
              <ResumeViewer src={embedUrl} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}