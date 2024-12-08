import { Hero } from '../components/Hero';
import { Timeline } from '../components/Timeline';
import { Projects } from '../components/Projects';
import { Testimonials } from '../components/Testimonials';
import { PageHeader } from '../components/PageHeader';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          path="home"
          description="Welcome to my digital workspace"
        />
        <div className="mt-8">
          <Hero />
        </div>
        <Timeline />
        <Projects />
        <Testimonials />
      </div>
    </div>
  );
}