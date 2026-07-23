import { useState, useEffect } from 'react';
import { Newspaper, Loader2, X, Calendar, User as UserIcon } from 'lucide-react';
import { getNoticiasDelDia, type Noticia } from '../../../core/firebase/services';

export const NewsSection = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState<Noticia | null>(null);

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

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNoticiaSeleccionada(null);
    };
    if (noticiaSeleccionada) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Bloquea scroll del fondo
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [noticiaSeleccionada]);

  const formatFecha = (timestamp: import('firebase/firestore').Timestamp) => {
    return timestamp.toDate().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              onClick={() => setNoticiaSeleccionada(noticia)}
              className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-brand/50 transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-xl hover:shadow-brand/10"
            >
              <div className="relative overflow-hidden">
                <img
                  src={noticia.imagenUrl}
                  alt={noticia.titulo}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded bg-brand/90 text-white text-xs font-bold uppercase backdrop-blur-sm">
                    {noticia.categoria || 'General'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-brand transition-colors">
                  {noticia.titulo}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-3">
                  {noticia.resumen}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-border">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <UserIcon className="w-3 h-3" />
                    {noticia.autor || 'Redacción'}
                  </span>
                  <span className="text-xs text-brand font-medium">
                    Leer más →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ================= MODAL DE NOTICIA COMPLETA ================= */}
      {noticiaSeleccionada && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setNoticiaSeleccionada(null)}
        >
          {/* Backdrop oscuro con blur */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Contenido del Modal */}
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de Cerrar */}
            <button
              onClick={() => setNoticiaSeleccionada(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scroll interno */}
            <div className="overflow-y-auto">
              {/* Imagen Grande */}
              <div className="relative w-full aspect-[16/9] bg-black">
                <img
                  src={noticiaSeleccionada.imagenUrl}
                  alt={noticiaSeleccionada.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent" />
              </div>

              {/* Contenido */}
              <div className="p-6 md:p-8 -mt-12 relative">
                {/* Categoría */}
                <span className="inline-block px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-bold uppercase mb-4">
                  {noticiaSeleccionada.categoria || 'General'}
                </span>

                {/* Título */}
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
                  {noticiaSeleccionada.titulo}
                </h2>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6 pb-6 border-b border-dark-border">
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-brand" />
                    {noticiaSeleccionada.autor || 'Redacción'}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand" />
                    {formatFecha(noticiaSeleccionada.fecha)}
                  </span>
                </div>

                {/* Resumen Completo */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {noticiaSeleccionada.resumen}
                  </p>
                </div>

                {/* Botón de Cierre inferior (móvil) */}
                <div className="mt-8 pt-6 border-t border-dark-border flex justify-end">
                  <button
                    onClick={() => setNoticiaSeleccionada(null)}
                    className="px-6 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};