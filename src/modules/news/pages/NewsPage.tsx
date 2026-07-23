import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { NewsCard } from '../../../shared/components/NewsCard';
import { getNoticiasDelDia, type Noticia } from '../../../core/firebase/services';

// Adaptador: Convierte el tipo de Firebase al que espera NewsCard
interface AdaptedNews {
  id: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  category: string;
  image: string;
  isFeatured: boolean;
  readTime: string;
}

const adaptNoticia = (n: Noticia, isFeatured = false): AdaptedNews => ({
  id: n.id,
  title: n.titulo,
  summary: n.resumen,
  author: n.autor,
  date: n.fecha.toDate().toISOString().split('T')[0],
  category: n.categoria,
  image: n.imagenUrl,
  isFeatured,
  readTime: '3 min' // Valor por defecto
});

export const NewsPage = () => {
  const [noticias, setNoticias] = useState<AdaptedNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticiasDelDia()
      .then(data => {
        if (data.length > 0) {
          const featured = adaptNoticia(data[0], true);
          const others = data.slice(1).map(n => adaptNoticia(n, false));
          setNoticias([featured, ...others]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar noticias:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  const featuredNews = noticias[0] || null;
  const otherNews = noticias.slice(1);

  return (
    <div className="space-y-8 py-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Noticias del Día</h1>
        <p className="text-text-secondary">Mantente informado con las últimas novedades de hoy.</p>
        
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar noticias..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-surface border border-dark-border text-white focus:border-brand focus:outline-none transition-colors"
          />
        </div>
      </div>

      {featuredNews ? (
        <NewsCard news={featuredNews} variant="featured" />
      ) : (
        <div className="text-center py-12 bg-dark-surface rounded-xl border border-dark-border">
          <p className="text-text-secondary">No hay noticias destacadas para hoy.</p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Más recientes</h2>
        {otherNews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {otherNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-center py-8">No hay más noticias para mostrar.</p>
        )}
      </div>
    </div>
  );
};