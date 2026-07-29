import { useState } from 'react';
import { Carousel } from '../../../shared/components/Carousel';
import { ServiceCard } from '../../../shared/components/ServiceCard';
import { ServiceModal } from '../../../shared/components/ServiceModal';
import { servicesData } from '../../../core/data/servicesData';
import { ArrowRight } from 'lucide-react';

export const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<typeof servicesData[0] | null>(null);

  // Mostramos los primeros 8 servicios en el carrusel del inicio
  const featuredServices = servicesData.slice(0, 8);

  return (
    <>
      <Carousel
        title="Nuestros Servicios"
        subtitle="Soluciones profesionales en audio, video, streaming y producción"
        action={
          <a 
            href="/servicios" 
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-light transition-colors"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </a>
        }
      >
        {featuredServices.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            onClick={() => setSelectedService(service)} 
          />
        ))}
      </Carousel>

      {/* Modal de Detalle */}
      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </>
  );
};