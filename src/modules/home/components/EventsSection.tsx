import { Carousel } from '../../../shared/components/Carousel';
import { EventCard } from '../../../shared/components/EventCard';
import { mockEvents } from '../../../core/data/mockData';

export const EventsSection = () => {
  return (
    <Carousel
      title="Próximos Eventos"
      subtitle="No te pierdas nuestras actividades"
    >
      {mockEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </Carousel>
  );
};