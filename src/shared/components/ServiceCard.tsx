import { ArrowRight } from 'lucide-react';
import { servicesData } from '../../core/data/servicesData';

type Service = typeof servicesData[0];

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

export const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="w-80 flex-shrink-0 snap-start group cursor-pointer rounded-2xl overflow-hidden bg-dark-surface border border-dark-border hover:border-brand/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5"
    >
      {/* Imagen */}
      <div className="relative aspect-video overflow-hidden bg-dark-bg">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badge de Categoría */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
          {service.category}
        </div>
      </div>

      {/* Información */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-brand transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-text-secondary line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center gap-2 text-brand font-semibold text-sm pt-2 group-hover:gap-3 transition-all">
          <span>Cotizar este servicio</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};