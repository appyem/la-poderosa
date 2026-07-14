import { Headphones, Clock } from 'lucide-react';
import { mockPodcasts } from '../../core/data/mockData';

type Podcast = typeof mockPodcasts[0];

interface PodcastCardProps {
  podcast: Podcast;
}

export const PodcastCard = ({ podcast }: PodcastCardProps) => {
  return (
    <div className="w-40 flex-shrink-0 snap-start group cursor-pointer">
      {/* Imagen cuadrada */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-dark-surface">
        <img
          src={podcast.image}
          alt={podcast.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Overlay con ícono */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Headphones className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-brand transition-colors">
          {podcast.title}
        </h3>
        <p className="text-xs text-text-secondary line-clamp-1">{podcast.author}</p>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>{podcast.episodes} eps</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {podcast.duration}
          </div>
        </div>
      </div>
    </div>
  );
};