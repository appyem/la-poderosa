import { X, ExternalLink, Building2 } from 'lucide-react';
import type { Anuncio } from '../../core/firebase/services';

interface AdModalProps {
  anuncio: Anuncio;
  onClose: () => void;
}

export const AdModal = ({ anuncio, onClose }: AdModalProps) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-dark-surface border border-dark-border shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-brand transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagen Grande */}
        <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl bg-black">
          <img 
            src={anuncio.imagenUrl} 
            alt={anuncio.titulo} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent" />
          
          {/* Badge de empresa */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white">
            <Building2 className="w-4 h-4 text-brand" />
            <span className="text-sm font-semibold">{anuncio.empresa}</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Título */}
          <div>
            <span className="text-xs font-bold text-brand uppercase tracking-wider mb-2 block">
              Contenido Patrocinado
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {anuncio.titulo}
            </h2>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-text-secondary leading-relaxed text-base md:text-lg whitespace-pre-line">
              {anuncio.descripcion}
            </p>
          </div>

          {/* Botón de acción */}
          <div className="pt-4 border-t border-dark-border">
            <a 
              href={anuncio.enlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-brand hover:bg-brand-light text-white font-bold transition-all hover:scale-[1.02] shadow-lg shadow-brand/20"
            >
              <ExternalLink className="w-5 h-5" />
              Visitar Sitio Web
            </a>
            <p className="text-xs text-text-muted text-center mt-3">
              Se abrirá en una nueva pestaña
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};