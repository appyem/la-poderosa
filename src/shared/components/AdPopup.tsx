import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPublicidadesActivas, type Publicidad } from '../../core/firebase/services';

interface AdPopupProps {
  onClose: () => void;
}

export const AdPopup = ({ onClose }: AdPopupProps) => {
  const [publicidades, setPublicidades] = useState<Publicidad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPublicidades = async () => {
      const data = await getPublicidadesActivas();
      setPublicidades(data);
      setLoading(false);
    };
    cargarPublicidades();
  }, []);

  useEffect(() => {
    if (publicidades.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % publicidades.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [publicidades.length]);

  if (loading || publicidades.length === 0) return null;

  const currentAd = publicidades[currentIndex];

  const handleVerMas = () => {
    if (currentAd.link) {
      window.open(currentAd.link, '_blank');
    }
    onClose();
  };

  const nextAd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % publicidades.length);
  };

  const prevAd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + publicidades.length) % publicidades.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop oscuro */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* ✅ MODAL COMPACTO: Menos invasivo, imagen protagonista */}
      <div className="relative w-full sm:max-w-sm max-h-[70vh] bg-dark-surface sm:border sm:border-dark-border sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col">
        
        {/* Etiqueta pequeña y centrada */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <span className="px-2 py-0.5 bg-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand/30 backdrop-blur-md">
            Publicidad {publicidades.length > 1 && `(${currentIndex + 1}/${publicidades.length})`}
          </span>
        </div>

        {/* Botón X para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
          aria-label="Cerrar publicidad"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagen protagonista con altura controlada */}
        <div className="relative w-full aspect-[4/3] bg-dark-bg group flex-shrink-0">
          <img
            src={currentAd.imagenUrl}
            alt={currentAd.titulo}
            className="w-full h-full object-cover"
          />
          
          {/* Flechas de navegación */}
          {publicidades.length > 1 && (
            <>
              <button 
                onClick={prevAd}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Publicidad anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextAd}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Siguiente publicidad"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Contenido compacto: título + descripción truncada + botón "Ver más" */}
        <div className="p-4 text-center space-y-2 flex-1">
          <h3 className="text-base font-bold text-white leading-tight line-clamp-1">
            {currentAd.titulo}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {currentAd.descripcion}
          </p>

          {currentAd.link && (
            <button
              onClick={handleVerMas}
              className="w-full mt-2 px-4 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors text-sm"
            >
              Ver más
            </button>
          )}

          {/* Indicadores de puntos */}
          {publicidades.length > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {publicidades.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-brand w-5' : 'bg-white/30 hover:bg-white/50 w-1.5'
                  }`}
                  aria-label={`Ir a publicidad ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};