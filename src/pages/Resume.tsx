import React from 'react';
import { Terminal, ExternalLink } from 'lucide-react';

export function Resume() {
  const resumeUrl = "YOUR_GOOGLE_DRIVE_EMBED_LINK_HERE"; // Replace with your Google Drive embed link

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-green-400" />
            <h1 className="text-2xl">~/resume</h1>
          </div>
        </div>

        {/* Resume Container */}
        <div className="border border-gray-800 rounded-lg bg-gray-900 overflow-hidden">
          {/* Window Controls */}
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
            <div className="flex space-x-2">
              {[
                { color: 'red', key: 'close' },
                { color: 'yellow', key: 'minimize' },
                { color: 'green', key: 'maximize' }
              ].map(({ color, key }) => (
                <div key={key} className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
              ))}
            </div>
            <div className="text-xs text-gray-400">resume.pdf</div>
          </div>

          {/* Resume Embed */}
          <div className="aspect-[8.5/11] w-full">
            <iframe
              src={resumeUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-6 flex justify-center">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600/20 text-green-400 border border-green-400/30 hover:bg-green-400/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in New Tab</span>
          </a>
        </div>
      </div>
    </div>
  );
}
