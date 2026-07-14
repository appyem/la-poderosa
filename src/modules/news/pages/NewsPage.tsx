import { Search } from 'lucide-react';
import { NewsCard } from '../../../shared/components/NewsCard';
import { mockNews } from '../../../core/data/mockData';

export const NewsPage = () => {
  const featuredNews = mockNews.find(n => n.isFeatured) || mockNews[0];
  const otherNews = mockNews.filter(n => n.id !== featuredNews.id);

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Noticias</h1>
        <p className="text-text-secondary">Mantente informado con las últimas novedades.</p>
        
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar noticias..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-surface border border-dark-border focus:border-brand focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Noticia Destacada */}
      <NewsCard news={featuredNews} variant="featured" />

      {/* Grid de Noticias */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Más recientes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {otherNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
          {/* Duplicamos para llenar el grid en la demo */}
          {otherNews.map((news) => (
            <NewsCard key={`${news.id}-dup`} news={{...news, id: `${news.id}-dup`}} />
          ))}
        </div>
      </div>
    </div>
  );
};