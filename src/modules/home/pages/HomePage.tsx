import { HeroSection } from '../components/HeroSection';
import { LiveProgramsSection } from '../components/LiveProgramsSection';
import { PodcastsSection } from '../components/PodcastsSection';
import { NewsSection } from '../components/NewsSection';
import { ServicesSection } from '../components/ServicesSection'; // ✅ CORREGIDO
import { SponsorsSection } from '../components/SponsorsSection';

export const HomePage = () => {
  return (
    <div className="space-y-12 py-6">
      <HeroSection />
      <LiveProgramsSection />
      <PodcastsSection />
      <NewsSection />
      <ServicesSection /> {/* ✅ CORREGIDO */}
      <SponsorsSection />
    </div>
  );
};