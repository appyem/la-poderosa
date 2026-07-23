import { useState, useEffect } from 'react';
import { Clock, Radio } from 'lucide-react';
import { 
  getProgramasRadio, 
  getDJs, 
  type ProgramaRadio, 
  type DJ 
} from '../../../core/firebase/services';

export const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [programs, setPrograms] = useState<ProgramaRadio[]>([]);
  const [djs, setDjs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [programsData, djsData] = await Promise.all([
          getProgramasRadio(),
          getDJs()
        ]);
        setPrograms(programsData);
        setDjs(djsData);
      } catch (err) {
        console.error('Error al cargar la programación:', err);
        setError('Error al cargar la programación');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const currentDay = DIAS_SEMANA[selectedDay];
  const programsForDay = programs.filter(prog => 
    prog.dias.includes(currentDay)
  ).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  // Calcular hora actual para el indicador "EN VIVO"
  const now = new Date();
  const currentHours = now.getHours().toString().padStart(2, '0');
  const currentMinutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Programación</h1>
        <p className="text-text-secondary">Consulta nuestra parrilla semanal de programas.</p>
      </div>

      {/* Selector de Días */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {DIAS_SEMANA.map((day, index) => (
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
          Programación del {currentDay}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : programsForDay.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-lg text-text-secondary">No hay programas programados para {currentDay}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {programsForDay.map((program) => {
              const isLive = program.horaInicio <= currentTime && currentTime <= program.horaFin;
              const dj = djs.find(d => d.id === program.djId);

              return (
                <div
                  key={program.id}
                  className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    isLive
                      ? 'bg-brand/10 border-brand/30 hover:bg-brand/15'
                      : 'bg-dark-surface border-dark-border hover:bg-dark-elevated'
                  }`}
                >
                  {/* Horario */}
                  <div className="flex-shrink-0 sm:w-24 text-center">
                    <p className="text-lg font-bold">{program.horaInicio} - {program.horaFin}</p>
                    <p className="text-xs text-text-muted">Programa</p>
                  </div>

                  {/* Imagen - Placeholder para el DJ */}
                  <div className="w-full sm:w-16 h-24 sm:h-16 rounded-lg bg-brand/20 flex items-center justify-center">
                    <span className="text-white text-2xl">🎤</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-brand transition-colors">
                      {program.nombre}
                    </h3>
                    <p className="text-sm text-text-secondary">{dj ? dj.nombre : 'DJ Desconocido'}</p>
                    <p className="text-xs text-text-muted mt-1">{program.descripcion || 'Sin descripción'}</p>
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
        )}
      </div>
    </div>
  );
};