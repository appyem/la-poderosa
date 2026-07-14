import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { mockEvents } from '../../../core/data/mockData';

export const EventsPage = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // Calendario mock del mes actual (Julio 2026)
  const daysInMonth = 31;
  const firstDay = 3; // Miércoles (0 = Domingo)
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const eventDays = [15, 28]; // Días con eventos

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-text-secondary">No te pierdas nuestras actividades y conciertos.</p>
        </div>
        
        {/* Toggle de vista */}
        <div className="flex gap-2 p-1 rounded-lg bg-dark-surface border border-dark-border">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'list' ? 'bg-brand text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'calendar' ? 'bg-brand text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            Calendario
          </button>
        </div>
      </div>

      {/* Vista Lista */}
      {view === 'list' && (
        <div className="grid md:grid-cols-2 gap-6">
          {mockEvents.map((event) => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString('es-ES', { month: 'long' });

            return (
              <div
                key={event.id}
                className="group rounded-2xl overflow-hidden bg-dark-surface border border-dark-border hover:border-brand/50 transition-all cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-white/95 backdrop-blur-sm text-dark-bg">
                    <span className="text-2xl font-bold leading-none">{day}</span>
                    <span className="text-xs font-semibold uppercase">{month.slice(0, 3)}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-brand text-white text-sm font-bold">
                    {event.price}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold group-hover:text-brand transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand" />
                      <span>
                        {eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} • {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <button className="w-full mt-2 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors">
                    Ver detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vista Calendario */}
      {view === 'calendar' && (
        <div className="rounded-2xl bg-dark-surface border border-dark-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Julio 2026</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-dark-elevated transition-colors text-text-secondary">
                ←
              </button>
              <button className="p-2 rounded-lg hover:bg-dark-elevated transition-colors text-text-secondary">
                →
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-text-muted py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const hasEvent = day && eventDays.includes(day);
              const isToday = day === 15;

              return (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                    day
                      ? hasEvent
                        ? 'bg-brand/20 text-brand font-bold border border-brand/50 cursor-pointer hover:bg-brand/30'
                        : isToday
                        ? 'bg-brand text-white font-bold'
                        : 'bg-dark-elevated text-text-secondary hover:bg-dark-bg cursor-pointer'
                      : ''
                  }`}
                >
                  {day && (
                    <>
                      <span>{day}</span>
                      {hasEvent && <span className="text-[8px] mt-0.5">Evento</span>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}