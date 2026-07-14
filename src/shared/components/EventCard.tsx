import { Calendar, MapPin, Users } from 'lucide-react';
import { mockEvents } from '../../core/data/mockData';

type Event = typeof mockEvents[0];

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();

  return (
    <div className="w-72 flex-shrink-0 snap-start group cursor-pointer">
      {/* Imagen */}
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-dark-surface">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badge de fecha */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-white/95 backdrop-blur-sm text-dark-bg">
          <span className="text-xl font-bold leading-none">{day}</span>
          <span className="text-[10px] font-semibold uppercase">{month}</span>
        </div>

        {/* Precio */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-brand text-white text-xs font-bold">
          {event.price}
        </div>
      </div>

      {/* Información */}
      <div className="space-y-2">
        <h3 className="font-semibold line-clamp-2 group-hover:text-brand transition-colors">
          {event.title}
        </h3>
        <div className="space-y-1.5 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand" />
            <span>{eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand" />
            <span>{event.attendees.toLocaleString()} asistentes</span>
          </div>
        </div>
      </div>
    </div>
  );
};