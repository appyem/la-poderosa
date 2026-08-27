import { X, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';
import { servicesData } from '../../core/data/servicesData';

type Service = typeof servicesData[0];

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

export const ServiceModal = ({ service, onClose }: ServiceModalProps) => {
  // WhatsApp Nativo (PC y Móvil)
  const whatsappMessage = encodeURIComponent(`Hola LA PODEROSA, quiero cotizar el servicio de: ${service.title}`);
  const whatsappUrl = `https://wa.me/573227027174?text=${whatsappMessage}`;

  // Email Profesional
  const emailSubject = encodeURIComponent(`Cotización de Servicio: ${service.title}`);
  const emailBody = encodeURIComponent(`Hola LA PODEROSA,\n\nEstoy interesado en cotizar el siguiente servicio:\n\n🎯 Servicio: ${service.title}\n📂 Categoría: ${service.category}\n\nQuedo atento a su respuesta con la disponibilidad, detalles y costos.\n\nGracias.`);
  const emailUrl = `mailto:lapoderosadelcafe104.1@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-dark-surface border border-dark-border shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-brand transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagen Grande */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-t-2xl">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="px-3 py-1 rounded-full bg-brand text-white text-xs font-bold uppercase tracking-wider mb-2 inline-block">
              {service.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{service.title}</h2>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Descripción del Servicio</h3>
            <p className="text-text-secondary leading-relaxed">{service.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Equipos Incluidos</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {service.equipment.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-dark-bg border border-dark-border">
                  <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-dark-border">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all hover:scale-[1.02] shadow-lg shadow-green-600/20"
            >
              <MessageCircle className="w-5 h-5" />
              Cotizar por WhatsApp
            </a>
            <a 
              href={emailUrl}
              className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl bg-brand hover:bg-brand-light text-white font-bold transition-all hover:scale-[1.02] shadow-lg shadow-brand/20"
            >
              <Mail className="w-5 h-5" />
              Solicitar por Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};