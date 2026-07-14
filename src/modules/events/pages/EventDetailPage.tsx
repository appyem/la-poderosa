import { Calendar, Clock, MapPin, Users, Ticket, Share2, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockEvents } from '../../../core/data/mockData';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find(e => e.id === id) || mockEvents[0];
  const eventDate = new Date(event.date);

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a eventos
      </button>

      {/* Imagen Principal */}
      <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-brand text-white text-xs font-bold uppercase">
            {event.price}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white">{event.title}</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
            <h2 className="text-xl font-bold">Descripción del evento</h2>
            <p className="text-text-secondary leading-relaxed">
              Únete a nosotros en una noche inolvidable llena de música, arte y cultura. 
              Este evento reúne a los mejores artistas de la escena local e internacional 
              en un ambiente único diseñado para disfrutar al máximo.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Habrá zonas de comida, merchandise exclusivo y actividades especiales 
              durante toda la jornada. No te lo pierdas.
            </p>
          </div>

          {/* Mapa Placeholder */}
          <div className="rounded-xl overflow-hidden border border-dark-border">
            <div className="aspect-video bg-dark-surface flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 text-brand mx-auto" />
                <p className="text-text-secondary">Mapa del lugar</p>
                <p className="text-sm text-text-muted">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Compra */}
        <div className="space-y-4">
          <div className="sticky top-24 p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-5 h-5 text-brand" />
                <span className="text-text-secondary">
                  {eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-brand" />
                <span className="text-text-secondary">{event.time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-brand" />
                <span className="text-text-secondary">{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-5 h-5 text-brand" />
                <span className="text-text-secondary">{event.attendees.toLocaleString()} asistentes confirmados</span>
              </div>
            </div>

            <div className="pt-4 border-t border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">{event.price}</span>
                <div className="flex items-center gap-1 text-sm text-text-muted">
                  <Ticket className="w-4 h-4" />
                  Entradas disponibles
                </div>
              </div>

              <button className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold shadow-lg shadow-brand/30 transition-all">
                Reservar entrada
              </button>
              <button className="w-full mt-2 py-3 rounded-lg bg-dark-elevated hover:bg-dark-bg border border-dark-border text-white font-semibold transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Compartir evento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}