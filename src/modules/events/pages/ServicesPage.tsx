import { useState } from 'react';
import { ServiceCard } from '../../../shared/components/ServiceCard';
import { ServiceModal } from '../../../shared/components/ServiceModal';
import { servicesData, type Service } from '../../../core/data/servicesData';

const categories = ['Todos', 'Audio', 'Video', 'Streaming', 'Producción', 'Radio/Podcast'] as const;
type Category = typeof categories[number];

export const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = activeCategory === 'Todos' 
    ? servicesData 
    : servicesData.filter((s: Service) => s.category === activeCategory);

  return (
    <div className="space-y-8 py-6 min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Nuestros Servicios Profesionales</h1>
        <p className="text-text-secondary text-lg">
          Ofrecemos soluciones integrales en audio, video, streaming y producción de eventos. 
          Haga clic en cualquier servicio para ver los equipos incluidos y solicitar su cotización.
        </p>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-brand text-white shadow-lg shadow-brand/25'
                : 'bg-dark-surface text-text-secondary border border-dark-border hover:border-brand/50 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Servicios */}
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service: Service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onClick={() => setSelectedService(service)} 
            />
          ))}
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
};