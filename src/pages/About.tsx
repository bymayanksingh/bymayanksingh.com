import { useState, useRef, useEffect } from 'react';
import { 
  Mail, Phone, Linkedin, 
  CheckCircle2, Command,
  Terminal, Code, GitBranch, BookOpen, Trophy, GraduationCap, MapPin, Link
} from 'lucide-react';
import { ImageModal } from '../components/ImageModal';
import { ImageFallback } from '../components/ImageFallback';
import { getAbout, getSkills, getCertificates, getStats, About as AboutType, Certificate, Stats } from '../services/firebaseService';
import { getAffiliations, type Affiliation } from '../services/firebaseService';
import { getPublications, type Publication } from '../services/firebaseService';
import { getAwards, type Award as AwardData } from '../services/firebaseService';
import { Publications } from '../components/Publications';
import { Awards } from '../components/Awards';

interface Certificate {
  title: string;
  organization: string;
  year: string;
  description: string;
  image: string;
  verified: boolean;
}

export function About() {
  const [about, setAbout] = useState<AboutType | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [currentCertificateIndex, setCurrentCertificateIndex] = useState(0);
  const certificatesRef = useRef<HTMLDivElement>(null);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [awards, setAwards] = useState<AwardData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          aboutResult,
          skillsResult,
          certificatesResult,
          statsResult,
          affiliationsResult,
          publicationsResult,
          awardsResult
        ] = await Promise.all([
          getAbout(),
          getSkills(),
          getCertificates(),
          getStats(),
          getAffiliations(),
          getPublications(),
          getAwards()
        ]);
        
        if (aboutResult) setAbout(aboutResult);
        setSkills(skillsResult);
        setCertificates(certificatesResult);
        if (statsResult) setStats(statsResult);
        setAffiliations(affiliationsResult.sort((a, b) => b.order - a.order));
        setPublications(publicationsResult);
        setAwards(awardsResult);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 font-mono flex items-center justify-center">
        <div className="flex items-center space-x-3 text-green-400">
          <Command className="w-5 h-5 animate-spin" />
          <span>Loading profile data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen font-mono pt-10 sm:pt-10">
      {/* Terminal Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800/50">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>cat about.md</span>
                </div>
              </div>
            </div>
            
            {/* Bio and Contact Section */}
            <div className="text-xs space-y-2 pb-2">
              <div className="flex items-start space-x-2">
                <Code className="w-3.5 h-3.5 text-green-400 mt-0.5" />
                <span className="text-gray-400">{about?.title || 'Software Engineer'}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-3.5 h-3.5 text-green-400 mt-0.5" />
                <a 
                  href={`mailto:${about?.email}`} 
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                >
                  {about?.email}
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-green-400 mt-0.5" />
                <span className="text-gray-400">{about?.city},{about?.country}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Link className="w-3.5 h-3.5 text-green-400 mt-0.5" />
                <div className="flex items-center space-x-3">
                    <a
                      key={0}
                      href={about?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center space-x-1"
                    >
                      <span>{about?.linkedin}</span>
                    </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Skills Section */}
        <div className="mb-12">
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-4 bg-gray-900 border-b border-gray-700 flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-green-400" />
              <h2 className="text-lg text-white">Skills & Technologies</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-900 text-gray-400 rounded-full text-sm border border-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mb-12">
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-4 bg-gray-900 border-b border-gray-700 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-green-400" />
              <h2 className="text-lg text-white">Certificates</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedCertificate(cert);
                      setCurrentCertificateIndex(index);
                    }}
                    className="bg-gray-900 rounded-lg p-4 border border-gray-700 cursor-pointer hover:border-green-400/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">{cert.title}</h3>
                      {cert.verified && (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{cert.organization}</p>
                    <p className="text-xs text-gray-500">{cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Publications Section */}
        <div className="mb-12">
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-4 bg-gray-900 border-b border-gray-700 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-green-400" />
              <h2 className="text-lg text-white">Publications</h2>
            </div>
            <div className="p-6">
              <Publications publications={publications} />
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="mb-12">
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-4 bg-gray-900 border-b border-gray-700 flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-green-400" />
              <h2 className="text-lg text-white">Awards</h2>
            </div>
            <div className="p-6">
              <Awards awards={awards} />
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {selectedCertificate && (
          <ImageModal
            isOpen={!!selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
            image={selectedCertificate.image}
            title={selectedCertificate.title}
            caption={`${selectedCertificate.organization} - ${selectedCertificate.year}`}
            onPrevious={() => {
              const newIndex = currentCertificateIndex === 0 ? certificates.length - 1 : currentCertificateIndex - 1;
              setCurrentCertificateIndex(newIndex);
              setSelectedCertificate(certificates[newIndex]);
            }}
            onNext={() => {
              const newIndex = currentCertificateIndex === certificates.length - 1 ? 0 : currentCertificateIndex + 1;
              setCurrentCertificateIndex(newIndex);
              setSelectedCertificate(certificates[newIndex]);
            }}
            showNavigation={certificates.length > 1}
            currentIndex={currentCertificateIndex}
            totalItems={certificates.length}
          />
        )}
      </div>
    </div>
  );
}