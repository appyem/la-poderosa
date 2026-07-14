import { Users, Radio, DollarSign, TrendingUp, Activity } from 'lucide-react';

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
        {/* Gráfico Simulado (Ocupación de Audiencia) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-dark-surface border border-dark-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Audiencia por Programa (Últimas 24h)</h3>
            <select className="bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand">
              <option>Últimas 24 horas</option>
              <option>Última semana</option>
              <option>Último mes</option>
            </select>
          </div>
          
          {/* Visualización de barras CSS pura */}
          <div className="space-y-4">
            {[
              { name: 'La Mañana Poderosa', value: 85, listeners: '2,847' },
              { name: 'Ritmo Tropical', value: 62, listeners: '1,920' },
              { name: 'Noticias del Mediodía', value: 45, listeners: '1,450' },
              { name: 'Tarde Deportiva', value: 78, listeners: '2,100' },
              { name: 'Noche de Rock', value: 30, listeners: '890' },
            ].map((program, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{program.name}</span>
                  <span className="text-text-secondary">{program.listeners} oyentes</span>
                </div>
                <div className="h-2.5 bg-dark-bg rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-1000"
                    style={{ width: `${program.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
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
