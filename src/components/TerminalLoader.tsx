import { Terminal } from 'lucide-react';
import styles from './TerminalLoader.module.css';

interface TerminalLoaderProps {
  title?: string;
  steps?: Array<{
    text: string;
    status: 'completed' | 'loading' | 'pending';
  }>;
}

export function TerminalLoader({ 
  title = "system_init.sh",
  steps = [
    { text: "Establishing connection to server", status: "completed" },
    { text: "Loading configuration files", status: "completed" },
    { text: "Fetching data", status: "completed" },
    { text: "Initializing components", status: "loading" },
  ]
}: TerminalLoaderProps) {
  return (
    <div className="min-h-[80vh] bg-gray-950 font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 shadow-2xl shadow-purple-500/5">
          <div className="px-4 py-2 bg-gray-900/90 border-b border-gray-700 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs text-gray-400">{title}</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-2 text-green-400">
              <Terminal className="w-4 h-4" />
              <span className="text-gray-400">$</span>
              <span className="text-green-300">./initialize_system.sh</span>
            </div>

            <div className="space-y-2 text-sm">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-400">
                  <span className="text-green-400">&gt;</span>
                  <span>{step.text}...</span>
                  {step.status === 'completed' && (
                    <span className="text-green-400">✓</span>
                  )}
                  {step.status === 'loading' && (
                    <span className={styles.loadingDots}>...</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div className={`h-full bg-green-500/50 rounded-full ${styles.loadingBar}`}></div>
            </div>

            <div className="text-xs text-gray-500 flex items-center justify-between">
              <span>System Status: Initializing</span>
              <span className="text-green-400">75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
