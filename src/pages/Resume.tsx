import { Terminal, ExternalLink, Download } from 'lucide-react';

export function Resume() {
  // Original URL: https://drive.google.com/file/d/1KFrWBTHO5dlHXcP-TZhlsuUhV4SvIqBo/view
  // Convert to embed URL format
  const fileId = "1KFrWBTHO5dlHXcP-TZhlsuUhV4SvIqBo";
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;

  return (
    <div className="bg-gray-950 min-h-screen font-mono flex flex-col h-screen">
      {/* Terminal Header */}
      <div className="flex-1 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex flex-col mt-20">
        <div className="flex-1 bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>cat resume.pdf</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-green-400/10 hover:bg-green-400/20 text-green-400 rounded transition-all duration-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 rounded transition-all duration-300"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open</span>
              </a>
            </div>
          </div>
          <div className="flex-1 bg-white">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-xs sm:text-sm">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
