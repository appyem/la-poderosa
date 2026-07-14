import { useState } from 'react';
import { Clock, Radio } from 'lucide-react';
import { mockSchedule, mockPrograms } from '../../../core/data/mockData';

export const SchedulePage = () => {
  const days = mockSchedule.map(s => s.day);
  const [selectedDay, setSelectedDay] = useState(0);

  const currentSchedule = mockSchedule[selectedDay];
  
  // Horarios fijos para la parrilla
  const timeSlots = [
    { time: '06:00', label: 'Mañana' },
    { time: '10:00', label: 'Media mañana' },
    { time: '13:00', label: 'Mediodía' },
    { time: '14:00', label: 'Tarde' },
    { time: '18:00', label: 'Media tarde' },
    { time: '20:00', label: 'Noche' },
  ];

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Programación</h1>
        <p className="text-text-secondary">Consulta nuestra parrilla semanal de programas.</p>
      </div>

      {/* Selector de Días */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index)}
            className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedDay === index
                ? 'bg-brand text-white shadow-lg shadow-brand/30'
                : 'bg-dark-surface text-text-secondary hover:bg-dark-elevated border border-dark-border'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Parrilla del Día */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand" />
          Programación del {currentSchedule.day}
        </h2>

        <div className="space-y-2">
          {timeSlots.map((slot, index) => {
            const program = mockPrograms[index % mockPrograms.length];
            const isLive = index === 1; // Simulamos que el segundo slot está en vivo

            return (
              <div
                key={slot.time}
                className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  isLive
                    ? 'bg-brand/10 border-brand/30 hover:bg-brand/15'
                    : 'bg-dark-surface border-dark-border hover:bg-dark-elevated'
                }`}
              >
                {/* Horario */}
                <div className="flex-shrink-0 sm:w-24 text-center">
                  <p className="text-lg font-bold">{slot.time}</p>
                  <p className="text-xs text-text-muted">{slot.label}</p>
                </div>

                {/* Imagen */}
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full sm:w-16 h-24 sm:h-16 rounded-lg object-cover"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-brand transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{program.host}</p>
                  <p className="text-xs text-text-muted mt-1">{program.category}</p>
                </div>

                {/* Badge en vivo */}
                {isLive && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold self-start sm:self-center">
                    <Radio className="w-3 h-3" />
                    EN VIVO
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}