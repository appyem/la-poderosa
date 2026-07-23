import { useState, useEffect } from 'react';
import { Newspaper, Loader2 } from 'lucide-react';
import { getNoticiasDelDia, type Noticia } from '../../../core/firebase/services';

export const NewsSection = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticiasDelDia()
      .then((data) => {
        setNoticias(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar noticias:', error);
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
        <h2 className="text-2xl md:text-3xl font-bold text-white">Noticias del Día</h2>
        <Newspaper className="w-6 h-6 text-brand" />
      </div>

      {noticias.length === 0 ? (
        <p className="text-text-secondary text-center py-8 bg-dark-surface rounded-xl border border-dark-border">
          No hay noticias publicadas hoy. ¡Vuelve más tarde!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((noticia) => (
            <article 
              key={noticia.id} 
              className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-brand/30 transition-colors group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={noticia.imagenUrl} 
                  alt={noticia.titulo} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                  <span className="px-2 py-1 rounded bg-brand/10 text-brand font-medium">
                    {noticia.categoria || 'General'}
                  </span>
                  <span>• {noticia.autor}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-brand transition-colors">
                  {noticia.titulo}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-3">
                  {noticia.resumen}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};