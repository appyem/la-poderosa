import { useState, useEffect } from 'react';
import { ExternalLink, Loader2, Handshake } from 'lucide-react';
import { getAliados, type Aliado } from '../../../core/firebase/services';

export const GalleriesPage = () => {
  const [aliados, setAliados] = useState<Aliado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAliados()
      .then(data => {
        setAliados(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar aliados:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 text-brand mb-2">
          <Handshake className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Nuestros Aliados</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Empresas e instituciones que confían en nosotros y hacen posible La Poderosa. Conócelos y conéctate con ellos.
        </p>
      </div>

      {/* Grid de Aliados */}
      {aliados.length === 0 ? (
        <div className="text-center py-16 bg-dark-surface rounded-2xl border border-dark-border border-dashed">
          <Handshake className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary text-lg">Próximamente revelaremos nuestros aliados estratégicos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aliados.map((aliado) => (
            <div
              key={aliado.id}
              className="group rounded-2xl overflow-hidden bg-dark-surface border border-dark-border hover:border-brand/50 transition-all duration-300 flex flex-col"
            >
              {/* Imagen del Aliado */}
              <div className="relative aspect-video overflow-hidden bg-dark-bg">
                <img
                  src={aliado.imagenUrl}
                  alt={aliado.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Contenido */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors">
                  {aliado.nombre}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">
                  {aliado.descripcion}
                </p>
                
                <a
                  href={aliado.enlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand/10 text-brand font-semibold group-hover:bg-brand group-hover:text-white transition-all"
                >
                  <span>Visitar / Contactar</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};