import { useState, useRef, useEffect, Suspense } from 'react';
import {
  Mail, Phone, Linkedin,
  CheckCircle2, Command,
  Terminal, Code, GitBranch, BookOpen, Trophy, GraduationCap, MapPin, Link
} from 'lucide-react';
import { ImageModal } from '../components/ImageModal';
import { ImageFallback } from '../components/ImageFallback';
import { getAbout, getSkills, getCertificates, getStats, About as AboutType } from '../services/firebaseService';
import { getAffiliations, type Affiliation } from '../services/firebaseService';
import { getPublications, type Publication } from '../services/firebaseService';
import { getAwards, type Award as AwardData } from '../services/firebaseService';
import { Publications } from '../components/Publications';
import { Awards } from '../components/Awards';
import { PageHeader } from '../components/PageHeader';
import { Affiliations } from '../components/Affiliations';
import { motion } from 'framer-motion';
import { TerminalLoader } from '../components/TerminalLoader';
import { fallbackAbout, fallbackSkills, fallbackCertificates, fallbackStats, fallbackAffiliations, fallbackPublications, fallbackAwards } from '../config/fallbackData';

interface Certificate {
  title: string;
  organization: string;
  year: string;
  description: string;
  image: string;
  verified: boolean;
}

export function About() {
  const [about, setAbout] = useState<AboutType>(fallbackAbout);
  const [skills, setSkills] = useState<string[]>(fallbackSkills);
  const [certificates, setCertificates] = useState<Certificate[]>(fallbackCertificates);
  const [stats, setStats] = useState<any>(fallbackStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [currentCertificateIndex, setCurrentCertificateIndex] = useState(0);
  const certificatesRef = useRef<HTMLDivElement>(null);
  const [affiliations, setAffiliations] = useState<Affiliation[]>(fallbackAffiliations);
  const [publications, setPublications] = useState<Publication[]>(fallbackPublications);
  const [awards, setAwards] = useState<AwardData[]>(fallbackAwards);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

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

        if (!isMounted) return;

        if (aboutResult) setAbout(aboutResult);
        if (skillsResult?.length > 0) setSkills(skillsResult);
        if (certificatesResult?.length > 0) setCertificates(certificatesResult);
        if (statsResult) setStats(statsResult);
        if (affiliationsResult?.length > 0) {
          setAffiliations(affiliationsResult.sort((a, b) => b.order - a.order));
        }
        if (publicationsResult?.length > 0) setPublications(publicationsResult);
        if (awardsResult?.length > 0) setAwards(awardsResult);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching data:', err);
        // Keep using fallback data on error
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.includes('Development') ? 'Development' :
                    skill.includes('Python') || skill.includes('JavaScript') || skill.includes('Elixir') ? 'Languages' :
                    skill.includes('React') || skill.includes('Django') || skill.includes('Flask') || skill.includes('Node') || skill.includes('Phoenix') ? 'Frameworks' :
                    'Other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    // Remove the category name from the skill if it's in Development
    const skillName = category === 'Development' ? skill.replace(' Development', '') : skill;
    acc[category].push(skillName);
    return acc;
  }, {} as Record<string, string[]>);

  if (loading) {
    return (
      <TerminalLoader
        title="profile_loader.sh"
        steps={[
          { text: "Establishing database connection", status: "completed" },
          { text: "Loading profile information", status: "completed" },
          { text: "Fetching skills and certifications", status: "completed" },
          { text: "Processing achievements and publications", status: "completed" },
          { text: "Rendering profile content", status: "loading" },
        ]}
      />
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
          <div className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>about.json</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Image */}
                <div className="w-full md:w-1/3">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-800/50">
                    <img
                      src={about?.image}
                      alt={about?.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <h1 className="text-2xl text-green-400 font-medium mb-2">
                      {about?.name}
                    </h1>
                    <p className="text-gray-400">
                      {about?.title}
                    </p>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-400">{about?.description}</p>
                  </div>

                  {/* Services */}
                  <div className="space-y-3">
                    <h3 className="text-green-400 font-medium">Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {about?.services.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 bg-green-400/50 rounded-full"></span>
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h3 className="text-green-400 font-medium">Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${about?.email}`} className="hover:text-green-400">
                          {about?.email}
                        </a>
                      </div>
                      {about?.phone && (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${about?.phone}`} className="hover:text-green-400">
                            {about?.phone}
                          </a>
                        </div>
                      )}
                      {about?.linkedin && (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Linkedin className="w-4 h-4" />
                          <a
                            href={about.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-400"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mt-12">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> ls ./skills/
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div
                key={category}
                className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm p-4"
              >
                <h3 className="text-green-400 font-medium mb-3">{category}</h3>
                <div className="space-y-2">
                  {categorySkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-gray-400"
                    >
                      <span className="w-1.5 h-1.5 bg-green-400/50 rounded-full"></span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliations Section */}
        <section className="mt-12">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> ls ./affiliations/
            </h2>
          </div>
          <Suspense fallback={null}>
            <Affiliations affiliations={affiliations} />
          </Suspense>
        </section>

        {/* Publications Section */}
        <section className="mt-12">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> ls ./publications/
            </h2>
          </div>
          <Suspense fallback={null}>
            <Publications publications={publications} />
          </Suspense>
        </section>

        {/* Awards Section */}
        <section className="mt-12">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> ls ./awards/
            </h2>
          </div>
          <Suspense fallback={null}>
            <Awards awards={awards} />
          </Suspense>
        </section>

        {/* Certificates Section */}
        <section className="mt-12" ref={certificatesRef}>
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-xl text-green-400 font-medium">
              <span className="text-gray-400">$</span> ls ./certificates/
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden hover:border-green-400/30 transition-colors cursor-pointer group"
                onClick={() => {
                  setSelectedCertificate(certificate);
                  setCurrentCertificateIndex(index);
                }}
              >
                <div className="aspect-video relative">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {certificate.verified && (
                    <div className="absolute top-2 right-2 bg-green-400/20 backdrop-blur-sm rounded-full p-1">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-1 group-hover:text-green-400 transition-colors">
                    {certificate.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {certificate.organization}
                  </p>
                  <div className="flex items-center space-x-2 text-gray-500 text-xs">
                    <GraduationCap className="w-4 h-4" />
                    <span>{certificate.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certificate Modal */}
        {selectedCertificate && (
          <ImageModal
            isOpen={!!selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
            images={certificates.map(cert => ({
              url: cert.image,
              caption: cert.title
            }))}
            currentIndex={currentCertificateIndex}
            totalItems={certificates.length}
            onPrevious={() => {
              setCurrentCertificateIndex(
                (currentCertificateIndex - 1 + certificates.length) % certificates.length
              );
              setSelectedCertificate(certificates[
                (currentCertificateIndex - 1 + certificates.length) % certificates.length
              ]);
            }}
            onNext={() => {
              setCurrentCertificateIndex(
                (currentCertificateIndex + 1) % certificates.length
              );
              setSelectedCertificate(certificates[
                (currentCertificateIndex + 1) % certificates.length
              ]);
            }}
            showNavigation={true}
            title={selectedCertificate.title}
            renderImage={(image) => (
              <img
                src={image.url}
                alt={image.caption}
                className="max-h-[calc(80vh-8rem)] object-contain rounded-lg"
                loading="lazy"
              />
            )}
          />
        )}
      </div>
    </div>
  );
}