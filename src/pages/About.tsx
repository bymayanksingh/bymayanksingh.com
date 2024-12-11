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
import { PageHeader } from '../components/PageHeader';
import { Affiliations } from '../components/Affiliations';
import { motion } from 'framer-motion';

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
          <span>Loading Profile Data...</span>
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
    <div className="bg-gray-950 min-h-screen font-mono pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          path="about"
          description="A brief introduction about my journey and expertise"
        />

        {/* About Section */}
        <section className="mt-8">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> cat ./about.md
            </h2>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm p-6">
            <div className="prose prose-invert max-w-none">
              {about?.description}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mt-16">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> ls ./skills/
            </h2>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>skills.json</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {about?.skills?.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <h3 className="text-green-400 font-medium mb-2">{skill.category}</h3>
                    <div className="text-sm text-gray-400 space-y-1">
                      {skill.items?.map((item, i) => (
                        <div key={i}>{item}</div>
                      ))}
                    </div>
                  </motion.div>
                )) || (
                  <div className="col-span-full text-gray-400 text-center py-4">
                    No skills data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

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

        {/* Affiliations Section */}
        <section className="mt-16">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> ls ./affiliations/
            </h2>
          </div>
          <Affiliations affiliations={affiliations} isLoading={loading} />
        </section>

        {/* Publications Section */}
        <section className="mt-16">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> ls ./publications/
            </h2>
          </div>
          <Publications publications={publications} isLoading={loading} />
        </section>

        {/* Awards Section */}
        <section className="mt-16 mb-16">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> ls ./awards/
            </h2>
          </div>
          <Awards awards={awards} isLoading={loading} />
        </section>

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