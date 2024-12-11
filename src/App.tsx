import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Resume } from './pages/Resume';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { SEO } from './components/SEO';
import { StructuredData, getEngineerSchema } from './components/StructuredData';
import { getAbout } from './services/firebaseService';
import type { About as AboutData } from './services/firebaseService';
import { BackToTop } from './components/BackToTop';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { NotFound } from './pages/NotFound';
import { Photography } from './pages/Photography';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const data = await getAbout();
        setAbout(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    }
    fetchAbout();
  }, []);

  return (
    <Router>
      <SEO />
      <StructuredData data={getEngineerSchema(about)} />
      <ScrollToTop />
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  );
}