import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowRight, Award, Building2, Users } from 'lucide-react';
import { About, getAbout, Stats } from '../services/firebaseService';
import { getStats } from '../services/dataService';
import { ImageFallback } from './ImageFallback';

const iconMap = {
  Building2,
  Award,
  Users
};

export function HomeAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const aboutData = await getAbout();
        setAbout(aboutData);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Terminal-like About Section */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-2 text-gray-400 text-sm font-mono">about.ts</div>
            </div>
            <div className="p-6 font-mono">
              <div className="text-green-400 mb-4">// About Me</div>
              <div className="space-y-4 text-gray-300">
                <div>
                  <span className="text-purple-400">const</span>{' '}
                  <span className="text-yellow-400">developer</span>{' '}
                  <span className="text-blue-400">=</span> {'{'}
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">background:</span>{' '}
                  <span className="text-green-300">
                    "Full-stack developer with a passion for creating elegant solutions"
                  </span>,
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">experience:</span> [
                  <div className="pl-4 text-green-300">
                    "5+ years of software development",<br />
                    "Cloud architecture and DevOps",<br />
                    "UI/UX design and implementation"
                  </div>
                  ],
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">skills:</span> {'{'}
                  <div className="pl-4">
                    <span className="text-blue-400">frontend:</span> [
                    <span className="text-green-300">"React", "TypeScript", "Next.js"</span>],<br />
                    <span className="text-blue-400">backend:</span> [
                    <span className="text-green-300">"Node.js", "Python", "Go"</span>],<br />
                    <span className="text-blue-400">cloud:</span> [
                    <span className="text-green-300">"AWS", "Docker", "Kubernetes"</span>]
                  </div>
                  {'}'}
                </div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: 'Frontend', icon: 'Code', items: ['React', 'TypeScript', 'Next.js'] },
              { name: 'Backend', icon: 'Terminal', items: ['Node.js', 'Python', 'Go'] },
              { name: 'Cloud', icon: 'Database', items: ['AWS', 'Docker', 'K8s'] },
              { name: 'Tools', icon: 'Github', items: ['Git', 'VS Code', 'Figma'] },
              { name: 'Testing', icon: 'Code', items: ['Jest', 'Cypress', 'RTL'] },
              { name: 'Other', icon: 'Terminal', items: ['Agile', 'CI/CD', 'TDD'] }
            ].map((skill, index) => (
              <div
                key={index}
                className="glass-card p-4 rounded-lg"
              >
                <h3 className="text-green-400 font-mono text-sm mb-2">{skill.name}</h3>
                <ul className="space-y-1">
                  {skill.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-300 text-sm font-mono">
                      <span className="text-green-400">$</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}