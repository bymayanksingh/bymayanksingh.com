import { useState, useRef, useEffect } from 'react';
import { 
  Download, Mail, Phone, Linkedin, Award as AwardIcon, 
  Building2Icon, BuildingIcon, Users, CheckCircle2, Command,
  Terminal, Code, GitBranch, BookOpen, Trophy, GraduationCap
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
  const [aboutData, setAboutData] = useState<AboutType | null>(null);
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
        
        if (aboutResult) setAboutData(aboutResult);
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
    <div className="min-h-screen bg-gray-900 font-mono py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-5 h-5 text-green-400" />
            <h1 className="text-2xl text-white">~/about</h1>
          </div>
          <p className="text-gray-400 flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>Software Engineer & Former Architect</span>
          </p>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <div className="px-4 py-2 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-400">profile.jpg</span>
              </div>
              <div className="p-4">
                <img
                  src={aboutData?.image}
                  alt="Profile"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Bio & Contact */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <Terminal className="w-4 h-4 text-green-400" />
                <h2 className="text-lg text-white">Bio</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{aboutData?.bio}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="w-4 h-4 text-green-400" />
                <h2 className="text-lg text-white">Contact</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData?.email && (
                  <a
                    href={`mailto:${aboutData.email}`}
                    className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{aboutData.email}</span>
                  </a>
                )}
                {aboutData?.phone && (
                  <a
                    href={`tel:${aboutData.phone}`}
                    className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{aboutData.phone}</span>
                  </a>
                )}
                {aboutData?.linkedin && (
                  <a
                    href={aboutData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

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