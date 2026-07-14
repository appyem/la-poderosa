import { Carousel } from '../../../shared/components/Carousel';
import { PodcastCard } from '../../../shared/components/PodcastCard';
import { mockPodcasts } from '../../../core/data/mockData';

export const PodcastsSection = () => {
  return (
    <Carousel
      title="Podcasts Populares"
      subtitle="Escucha cuando quieras, donde quieras"
    >
      {mockPodcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </Carousel>
  );
};