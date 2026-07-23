import { useState, useEffect } from 'react';
import { Search, Loader2, X, Calendar, User as UserIcon } from 'lucide-react';
import { getNoticiasDelDia, type Noticia } from '../../../core/firebase/services';
import { Timestamp } from 'firebase/firestore';

export const NewsPage = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState<Noticia | null>(null);

  const cargarNoticias = async () => {
    setLoading(true);
    try {
      const data = await getNoticiasDelDia();
      setNoticias(data);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarNoticias();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNoticiaSeleccionada(null);
    };
    if (noticiaSeleccionada) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [noticiaSeleccionada]);

  const formatFecha = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const noticiasFiltradas = noticias.filter(n =>
    n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    n.resumen.toLowerCase().includes(busqueda.toLowerCase()) ||
    n.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const featuredNews = noticiasFiltradas[0] || null;
  const otherNews = noticiasFiltradas.slice(1);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Noticias del Día</h1>
        <p className="text-text-secondary">Mantente informado con las últimas novedades.</p>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar noticias..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-surface border border-dark-border text-white focus:border-brand focus:outline-none transition-colors"
          />
        </div>
      </div>

      {noticiasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-dark-surface rounded-xl border border-dark-border">
          <p className="text-text-secondary text-lg">
            {busqueda ? 'No se encontraron noticias con esa búsqueda.' : 'No hay noticias publicadas hoy.'}
          </p>
        </div>
      ) : (
        <>
          {/* Noticia Destacada */}
          {featuredNews && (
            <article
              onClick={() => setNoticiaSeleccionada(featuredNews)}
              className="group relative rounded-2xl overflow-hidden bg-dark-surface border border-dark-border hover:border-brand/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-brand/10"
            >
              <div className="relative overflow-hidden">
                <img
                  src={featuredNews.imagenUrl}
                  alt={featuredNews.titulo}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-dark-surface/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-brand/90 text-white text-xs font-bold uppercase backdrop-blur-sm">
                    ⭐ Destacada
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  {/* ✅ CORREGIDO: text-xl en móvil, leading-snug para evitar superposición */}
                  <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-snug group-hover:text-brand transition-colors">
                    {featuredNews.titulo}
                  </h2>
                  {/* ✅ CORREGIDO: text-sm en móvil, md:text-base en desktop */}
                  <p className="text-sm md:text-base text-text-secondary line-clamp-2 md:line-clamp-3">
                    {featuredNews.resumen}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3 text-xs md:text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3 md:w-4 md:h-4" />
                      {featuredNews.autor || 'Redacción'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      {formatFecha(featuredNews.fecha)}
                    </span>
                    <span className="text-brand font-medium ml-auto hidden md:inline">
                      Leer noticia completa →
                    </span>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Grid de Noticias */}
          {otherNews.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Más recientes</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {otherNews.map((noticia) => (
                  <article
                    key={noticia.id}
                    onClick={() => setNoticiaSeleccionada(noticia)}
                    className="group bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-brand/50 transition-all cursor-pointer hover:scale-[1.01] hover:shadow-lg hover:shadow-brand/5"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={noticia.imagenUrl}
                        alt={noticia.titulo}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded bg-brand/90 text-white text-[10px] md:text-xs font-bold uppercase backdrop-blur-sm">
                          {noticia.categoria || 'General'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 md:p-5">
                      {/* ✅ CORREGIDO: text-base en móvil para títulos de cards */}
                      <h3 className="text-base md:text-lg font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-brand transition-colors">
                        {noticia.titulo}
                      </h3>
                      {/* ✅ CORREGIDO: text-sm explícito */}
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {noticia.resumen}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
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
            </div>
          )}
        </>
      )}

      {/* ================= MODAL DE NOTICIA COMPLETA ================= */}
      {noticiaSeleccionada && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setNoticiaSeleccionada(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setNoticiaSeleccionada(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto">
              <div className="relative w-full aspect-[16/9] bg-black">
                <img
                  src={noticiaSeleccionada.imagenUrl}
                  alt={noticiaSeleccionada.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent" />
              </div>

              <div className="p-5 md:p-8 -mt-8 md:-mt-12 relative">
                <span className="inline-block px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-bold uppercase mb-3 md:mb-4">
                  {noticiaSeleccionada.categoria || 'General'}
                </span>

                {/* ✅ CORREGIDO: leading-snug en móvil para evitar superposición de títulos largos */}
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-4">
                  {noticiaSeleccionada.titulo}
                </h2>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-text-secondary mb-5 md:mb-6 pb-5 md:pb-6 border-b border-dark-border">
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-brand" />
                    {noticiaSeleccionada.autor || 'Redacción'}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand" />
                    {formatFecha(noticiaSeleccionada.fecha)}
                  </span>
                </div>

                {/* ✅ CORREGIDO: text-base en móvil, md:text-lg en desktop */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-base md:text-lg text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {noticiaSeleccionada.resumen}
                  </p>
                </div>

                <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-dark-border flex justify-end">
                  <button
                    onClick={() => setNoticiaSeleccionada(null)}
                    className="px-6 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors text-sm md:text-base"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};