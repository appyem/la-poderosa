import { useState, useEffect } from 'react';
import { Users, Radio, DollarSign, TrendingUp, Activity, Clock, Calendar, Loader2 } from 'lucide-react';
import { getProgramasRadio, getDJs, type ProgramaRadio, type DJ } from '../../../core/firebase/services';

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const DashboardHome = () => {
  const metrics = [
    { title: 'Oyentes en Vivo', value: '2,847', change: '+12.5%', icon: Radio, color: 'text-brand', bg: 'bg-brand/10' },
    { title: 'Ingresos del Mes', value: '$12.4M', change: '+8.2%', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Nuevos Seguidores', value: '1,204', change: '+24.0%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Programas Emitidos', value: '142', change: '+5.1%', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const recentActivity = [
    { action: 'Nuevo patrocinador registrado', entity: 'Banco Nacional', time: 'Hace 15 min', type: 'success' },
    { action: 'Programación actualizada', entity: 'Parrilla de la Semana 42', time: 'Hace 1 hora', type: 'info' },
    { action: 'Alerta de streaming', entity: 'Caída de señal en Cámara 2', time: 'Hace 3 horas', type: 'warning' },
    { action: 'Nuevo artículo publicado', entity: 'Festival de Verano 2026', time: 'Hace 5 horas', type: 'success' },
  ];

  // Estados para la parrilla real
  const [programasHoy, setProgramasHoy] = useState<ProgramaRadio[]>([]);
  const [djs, setDjs] = useState<DJ[]>([]);
  const [loadingParrilla, setLoadingParrilla] = useState(true);

  useEffect(() => {
    Promise.all([getProgramasRadio(), getDJs()])
      .then(([programasData, djsData]) => {
        // Calcular día actual (0 = Domingo, 1 = Lunes, etc.)
        const hoy = new Date().getDay();
        const nombreDia = DIAS_SEMANA[hoy];
        
        // Filtrar programas del día actual y ordenarlos por hora
        const programasDelDia = programasData
          .filter(prog => prog.dias.includes(nombreDia))
          .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
        
        setProgramasHoy(programasDelDia);
        setDjs(djsData);
        setLoadingParrilla(false);
      })
      .catch(error => {
        console.error('Error al cargar la parrilla:', error);
        setLoadingParrilla(false);
      });
  }, []);

  // Calcular hora actual para detectar programa en vivo
  const ahora = new Date();
  const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;

  const getDJNombre = (djId: string) => {
    const dj = djs.find(d => d.id === djId);
    return dj ? dj.nombre : 'Sin asignar';
  };

  return (
    <div className="space-y-8">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-5 rounded-xl bg-dark-surface border border-dark-border hover:border-brand/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
            <p className="text-sm text-text-secondary mt-1">{metric.title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ✅ Parrilla Real del Día (Reemplaza el gráfico simulado) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-dark-surface border border-dark-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand" />
              Programación de Hoy ({DIAS_SEMANA[ahora.getDay()]})
            </h3>
            <span className="text-xs text-text-secondary">
              {programasHoy.length} programa{programasHoy.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {loadingParrilla ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-brand animate-spin" />
            </div>
          ) : programasHoy.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">No hay programas programados para hoy</p>
              <p className="text-xs text-text-muted mt-1">Agregue programas en Gestión de Programación</p>
            </div>
          ) : (
            <div className="space-y-3">
              {programasHoy.map((programa) => {
                const enVivo = programa.horaInicio <= horaActual && horaActual <= programa.horaFin;
                
                return (
                  <div
                    key={programa.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      enVivo
                        ? 'bg-brand/10 border-brand/30'
                        : 'bg-dark-bg border-dark-border hover:border-brand/20'
                    }`}
                  >
                    {/* Horario */}
                    <div className="flex-shrink-0 w-20 text-center">
                      <p className="text-sm font-bold text-white">{programa.horaInicio}</p>
                      <p className="text-xs text-text-muted">{programa.horaFin}</p>
                    </div>

                    {/* Info del programa */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white truncate">{programa.nombre}</h4>
                        {enVivo && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                            <Radio className="w-3 h-3" />
                            EN VIVO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary truncate">
                        🎤 {getDJNombre(programa.djId)}
                      </p>
                    </div>

                    {/* Icono de reloj */}
                    <Clock className="w-4 h-4 text-text-muted flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actividad Reciente */}
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex gap-3 items-start pb-4 border-b border-dark-border last:border-0 last:pb-0">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' : 
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{activity.entity}</p>
                  <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 rounded-lg bg-dark-elevated hover:bg-dark-bg border border-dark-border text-sm font-medium transition-colors">
            Ver todo el historial
          </button>
        </div>
      </div>
    </div>
  );
};