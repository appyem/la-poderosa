import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Apple, BarChart3, Calendar } from 'lucide-react';
import { getEstadisticasInstalaciones, type Instalacion } from '../../../core/firebase/services';

export const AnaliticasPage = () => {
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEstadisticasInstalaciones()
      .then(data => {
        setInstalaciones(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar analíticas:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-4 border-brand border-t-transparent"></div></div>;
  }

  const total = instalaciones.length;
  const androidCount = instalaciones.filter(i => i.dispositivo === 'Android').length;
  const iosCount = instalaciones.filter(i => i.dispositivo === 'iOS').length;
  const desktopCount = instalaciones.filter(i => i.dispositivo === 'Desktop').length;
  const ultimasInstalaciones = instalaciones.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analíticas de Instalaciones</h1>
        <p className="text-text-secondary mt-1">Seguimiento de usuarios que han instalado la PWA.</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Total Instalaciones</p>
              <p className="text-3xl font-bold text-white mt-1">{total}</p>
            </div>
            <div className="p-3 rounded-full bg-brand/10 text-brand">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Android</p>
              <p className="text-3xl font-bold text-green-500 mt-1">{androidCount}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500/10 text-green-500">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">iOS (iPhone/iPad)</p>
              <p className="text-3xl font-bold text-gray-300 mt-1">{iosCount}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-500/10 text-gray-300">
              <Apple className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Escritorio</p>
              <p className="text-3xl font-bold text-blue-500 mt-1">{desktopCount}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
              <Monitor className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de últimas instalaciones */}
      <div className="rounded-xl bg-dark-surface border border-dark-border overflow-hidden">
        <div className="p-4 border-b border-dark-border flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand" />
          <h3 className="font-semibold text-white">Últimas Instalaciones</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-dark-elevated">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Dispositivo</th>
                <th className="px-6 py-3">Navegador</th>
              </tr>
            </thead>
            <tbody>
              {ultimasInstalaciones.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-text-secondary">
                    No hay instalaciones registradas aún. ¡Prueba instalar la app!
                  </td>
                </tr>
              ) : (
                ultimasInstalaciones.map((inst) => (
                  <tr key={inst.id} className="border-b border-dark-border hover:bg-dark-elevated/50 transition-colors">
                    <td className="px-6 py-4 text-white">
                      {inst.fecha.toDate().toLocaleDateString('es-ES', { 
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        inst.dispositivo === 'Android' ? 'bg-green-500/10 text-green-500' :
                        inst.dispositivo === 'iOS' ? 'bg-gray-500/10 text-gray-300' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {inst.dispositivo === 'Android' && <Smartphone className="w-3 h-3" />}
                        {inst.dispositivo === 'iOS' && <Apple className="w-3 h-3" />}
                        {inst.dispositivo === 'Desktop' && <Monitor className="w-3 h-3" />}
                        {inst.dispositivo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{inst.navegador}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};