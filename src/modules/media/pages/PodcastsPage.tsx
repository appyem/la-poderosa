import { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { PodcastCard } from '../../../shared/components/PodcastCard';
import { getPodcasts, obtenerImagenPrevisualizacionYoutube, type Podcast } from '../../../core/firebase/services';

interface AdaptedPodcast {
  id: string;
  title: string;
  author: string;
  episodes: number;
  duration: string;
  image: string;
  category: string;
}

const adaptPodcast = (p: Podcast): AdaptedPodcast => ({
  id: p.id,
  title: p.titulo,
  author: 'LA PODEROSA', // Default ya que el tipo actual no tiene autor
  episodes: 1,
  duration: 'Variable',
  image: obtenerImagenPrevisualizacionYoutube(p.youtubeVideoId),
  category: p.categoria
});

export const PodcastsPage = () => {
  const [podcasts, setPodcasts] = useState<AdaptedPodcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPodcasts()
      .then(data => {
        setPodcasts(data.map(adaptPodcast));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar podcasts:', err);
        setLoading(false);
      });
  }, []);

  // Extraer categorías únicas dinámicamente
  const categories = ['Todos', ...Array.from(new Set(podcasts.map(p => p.category).filter(Boolean)))];

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 py-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Podcasts</h1>
        <p className="text-text-secondary">Explora nuestros programas y episodios exclusivos.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar podcast o episodio..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-surface border border-dark-border text-white focus:border-brand focus:outline-none transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-dark-surface border border-dark-border hover:bg-dark-elevated transition-colors">
            <Filter className="w-5 h-5 text-text-secondary" />
            <span className="text-sm font-medium text-white">Filtrar</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, index) => (
            <button 
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                index === 0 
                  ? 'bg-brand text-white' 
                  : 'bg-dark-surface text-text-secondary hover:bg-dark-elevated border border-dark-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {podcasts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-dark-surface rounded-xl border border-dark-border">
          <p className="text-text-secondary">No hay podcasts disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};