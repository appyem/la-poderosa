import { Search, Filter } from 'lucide-react';
import { PodcastCard } from '../../../shared/components/PodcastCard';
import { mockPodcasts } from '../../../core/data/mockData';

export const PodcastsPage = () => {
  const categories = ['Todos', 'Documental', 'Política', 'Ciencia', 'Lifestyle', 'Música'];

  return (
    <div className="space-y-8 py-6">
      {/* Header y Búsqueda */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Podcasts</h1>
        <p className="text-text-secondary">Explora nuestros programas y episodios exclusivos.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar podcast o episodio..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-surface border border-dark-border focus:border-brand focus:outline-none transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-dark-surface border border-dark-border hover:bg-dark-elevated transition-colors">
            <Filter className="w-5 h-5 text-text-secondary" />
            <span className="text-sm font-medium">Filtrar</span>
          </button>
        </div>

        {/* Categorías */}
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

      {/* Grid de Podcasts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {mockPodcasts.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
        {/* Duplicamos para llenar el grid en la demo */}
        {mockPodcasts.map((podcast) => (
          <PodcastCard key={`${podcast.id}-dup`} podcast={{...podcast, id: `${podcast.id}-dup`}} />
        ))}
      </div>
    </div>
  );
};