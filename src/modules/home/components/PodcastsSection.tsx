import { useState, useEffect } from 'react';
import { Mic, Loader2, Video } from 'lucide-react';
import { 
  getPodcasts, 
  obtenerImagenPrevisualizacionYoutube, 
  type Podcast 
} from '../../../core/firebase/services';

export const PodcastsSection = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPodcasts()
      .then((data) => {
        setPodcasts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar podcasts:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-12 flex justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Podcasts</h2>
        <Mic className="w-6 h-6 text-brand" />
      </div>

      {podcasts.length === 0 ? (
        <p className="text-text-secondary text-center py-8 bg-dark-surface rounded-xl border border-dark-border">
          No hay podcasts disponibles en este momento.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <a 
              key={podcast.id} 
              href={podcast.youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-brand/30 transition-colors block"
            >
              <div className="relative aspect-video bg-black">
                <img 
                  src={obtenerImagenPrevisualizacionYoutube(podcast.youtubeVideoId)} 
                  alt={podcast.titulo}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x180?text=Sin+Imagen'; 
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                  <Video className="w-12 h-12 text-red-600 drop-shadow-lg group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="p-5">
                <span className="text-xs text-brand font-medium uppercase tracking-wider">
                  {podcast.categoria || 'Podcast'}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 line-clamp-2 group-hover:text-brand transition-colors">
                  {podcast.titulo}
                </h3>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};