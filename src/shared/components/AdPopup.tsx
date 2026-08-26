import { useState, useEffect } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
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
      console.log('🔍 Buscando publicidades activas en Firebase...');
      const data = await getPublicidadesActivas();
      console.log('📢 Resultado de la búsqueda:', data);
      setPublicidades(data);
      setLoading(false);
    };
    cargarPublicidades();
  }, []);

  // ✅ AUTO-ROTACIÓN: Cambia de publicidad cada 5 segundos si hay más de 1
  useEffect(() => {
    if (publicidades.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % publicidades.length);
      }, 5000); // 5000 ms = 5 segundos
      return () => clearInterval(interval);
    }
  }, [publicidades.length]);

  if (loading || publicidades.length === 0) return null;

  const currentAd = publicidades[currentIndex];

  const handleLinkClick = () => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop oscuro */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        
        {/* ✅ ETIQUETA PEQUEÑA Y CENTRADA (Ahora muestra el contador) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="px-2 py-0.5 bg-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand/30 backdrop-blur-md">
            Publicidad {publicidades.length > 1 && `(${currentIndex + 1}/${publicidades.length})`}
          </span>
        </div>

        {/* ✅ BOTÓN X PARA CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
          aria-label="Cerrar publicidad"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Imagen de la publicidad con flechas de navegación */}
        <div className="relative w-full aspect-video bg-dark-bg group">
          <img
            src={currentAd.imagenUrl}
            alt={currentAd.titulo}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          
          {/* Flechas (solo visibles si hay más de 1 publicidad y al pasar el mouse) */}
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

        {/* Contenido */}
        <div className="p-5 text-center space-y-4">
          <h3 className="text-xl font-bold text-white leading-tight transition-all duration-300">
            {currentAd.titulo}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed transition-all duration-300">
            {currentAd.descripcion}
          </p>

          {currentAd.link && (
            <button
              onClick={handleLinkClick}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors"
            >
              Conocer más
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {/* ✅ INDICADORES DE PUNTOS (Dots) */}
          {publicidades.length > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {publicidades.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-brand w-6' : 'bg-white/30 hover:bg-white/50 w-2'
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