import { Hero } from '../components/Hero';
import { HomeAbout } from '../components/HomeAbout';
import { Timeline } from '../components/Timeline';
import { Projects } from '../components/Projects';
import { Testimonials } from '../components/Testimonials';

export function Home() {
  return (
    <div className="bg-gray-950">
      {/* Hero Section */}
      <Hero />
      <HomeAbout />
      <Timeline />
      <Projects />
      <Testimonials />
    </div>
  );
}