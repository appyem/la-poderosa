import { useState, useEffect } from 'react';
import { ExternalLink, Megaphone, X } from 'lucide-react';
import { getAnuncios, type Anuncio } from '../../core/firebase/services';

export const AdBanner = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    getAnuncios()
      .then(setAnuncios)
      .catch(console.error);
  }, []);

   useEffect(() => {
    if (anuncios.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % anuncios.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [anuncios.length]);

  if (!isVisible || anuncios.length === 0) return null;

  const ad = anuncios[currentIndex];

  return (
    <div className="w-full bg-dark-surface border-b border-dark-border relative overflow-hidden">
      {/* Botón para cerrar el banner */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 rounded-full bg-dark-bg/50 hover:bg-dark-bg text-text-muted hover:text-white transition-colors z-10"
        aria-label="Cerrar publicidad"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Contenido del Anuncio (Clicable) */}
      <a 
        href={ad.enlaceUrl || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-3 gap-4 hover:bg-dark-elevated transition-colors group"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-dark-border">
            <img src={ad.imagenUrl} alt={ad.titulo} className="w-full h-full object-cover" />
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <span className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1">
                <Megaphone className="w-3 h-3" />
                Patrocinado
              </span>
              <span className="text-xs text-text-muted">• {ad.empresa}</span>
            </div>
            <h4 className="text-sm md:text-base font-bold text-white group-hover:text-brand transition-colors line-clamp-1">
              {ad.titulo}
            </h4>
            <p className="text-xs md:text-sm text-text-secondary line-clamp-1 md:line-clamp-2 max-w-2xl">
              {ad.descripcion}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors text-sm font-semibold flex-shrink-0">
          <span>Ver más</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </a>

      {/* Indicadores de carrusel (si hay más de 1 anuncio) */}
      {anuncios.length > 1 && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {anuncios.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'bg-brand w-4' : 'bg-dark-border w-1.5 hover:bg-brand/50'
              }`}
              aria-label={`Ver anuncio ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};