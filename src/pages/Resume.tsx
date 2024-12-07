import React from 'react';
import { Terminal, ExternalLink, Download, FileText } from 'lucide-react';

export function Resume() {
  // Original URL: https://drive.google.com/file/d/1KFrWBTHO5dlHXcP-TZhlsuUhV4SvIqBo/view
  // Convert to embed URL format
  const fileId = "1KFrWBTHO5dlHXcP-TZhlsuUhV4SvIqBo";
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Terminal className="w-6 h-6 text-green-400" />
              <h1 className="text-2xl sm:text-3xl font-bold">~/resume.pdf</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-green-600/20 text-green-400 border border-green-400/30 hover:bg-green-400/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Open</span>
              </a>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
            <FileText className="w-4 h-4" />
            <span>cat resume.pdf | less</span>
          </div>
        </div>

        {/* Resume Container */}
        <div className="border border-gray-700/50 rounded-lg bg-gray-800/30 backdrop-blur-sm overflow-hidden shadow-xl">
          {/* Window Controls */}
          <div className="px-4 py-2 bg-gray-800/80 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span className="hidden sm:inline">PDF</span>
              <span>•</span>
              <span>100%</span>
            </div>
          </div>

          {/* Resume Embed */}
          <div className="aspect-[8.5/11] w-full bg-white">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <Terminal className="w-4 h-4 text-green-400" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
