import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  addProgramaRadio, 
  getProgramasRadio, 
  deleteProgramaRadio, 
  getDJs,
  type ProgramaRadio, 
  type DJ 
} from '../../../core/firebase/services';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ProgramasPage = () => {
  const [programas, setProgramas] = useState<ProgramaRadio[]>([]);
  const [djs, setDjs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    djId: '',
    dias: [] as string[],
    horaInicio: '07:00',
    horaFin: '08:00'
  });

  // Cargar datos al montar (usando .then/.catch para cumplir con las reglas de React Hooks)
  useEffect(() => {
    Promise.all([getDJs(), getProgramasRadio()])
      .then(([djsData, programasData]) => {
        setDjs(djsData);
        setProgramas(programasData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar datos:', error);
        setMessage({ type: 'error', text: 'Error al cargar los datos' });
        setLoading(false);
      });
  }, []);

  const handleDiaChange = (dia: string) => {
    setFormData(prev => {
      const dias = prev.dias.includes(dia)
        ? prev.dias.filter(d => d !== dia)
        : [...prev.dias, dia];
      return { ...prev, dias };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.djId || formData.dias.length === 0) {
      setMessage({ type: 'error', text: 'Nombre, DJ y al menos un día son obligatorios' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      
      await addProgramaRadio({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        djId: formData.djId,
        dias: formData.dias,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin
      });

      setFormData({ nombre: '', descripcion: '', djId: '', dias: [], horaInicio: '07:00', horaFin: '08:00' });
      
      const data = await getProgramasRadio();
      setProgramas(data);
      
      setMessage({ type: 'success', text: 'Programa agregado exitosamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al agregar Programa:', error);
      setMessage({ type: 'error', text: 'Error al agregar el programa' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (programaId: string, programaNombre: string) => {
    if (!confirm(`¿Está seguro de eliminar el programa "${programaNombre}"?`)) return;

    try {
      await deleteProgramaRadio(programaId);
      const data = await getProgramasRadio();
      setProgramas(data);
      setMessage({ type: 'success', text: 'Programa eliminado correctamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al eliminar Programa:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el programa' });
    }
  };

  const getDJName = (djId: string) => {
    const dj = djs.find(d => d.id === djId);
    return dj ? dj.nombre : 'DJ Desconocido';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Programas</h1>
          <p className="text-sm text-text-secondary mt-1">Administre la parrilla de programación de la emisora</p>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/30 text-green-500' 
            : 'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formulario para agregar Programa */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border sticky top-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand" />
              Agregar Nuevo Programa
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nombre del Programa *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: La Mañanera"
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-text-muted focus:border-brand focus:outline-none transition-colors"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Breve descripción del programa..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-text-muted focus:border-brand focus:outline-none transition-colors resize-none"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">DJ / Locutor *</label>
                <select
                  value={formData.djId}
                  onChange={(e) => setFormData({ ...formData, djId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none transition-colors"
                  disabled={saving || djs.length === 0}
                >
                  <option value="">Seleccione un DJ</option>
                  {djs.map(dj => (
                    <option key={dj.id} value={dj.id}>{dj.nombre}</option>
                  ))}
                </select>
                {djs.length === 0 && (
                  <p className="text-xs text-yellow-500 mt-1">⚠️ Primero debe agregar DJs</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Días de emisión *</label>
                <div className="grid grid-cols-2 gap-2">
                  {DIAS_SEMANA.map(dia => (
                    <label key={dia} className="flex items-center gap-2 p-2 rounded-lg bg-dark-bg border border-dark-border cursor-pointer hover:border-brand/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.dias.includes(dia)}
                        onChange={() => handleDiaChange(dia)}
                        className="rounded border-dark-border text-brand focus:ring-brand bg-dark-surface"
                        disabled={saving}
                      />
                      <span className="text-sm text-white">{dia}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Hora Inicio *</label>
                  <input
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none transition-colors"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Hora Fin *</label>
                  <input
                    type="time"
                    value={formData.horaFin}
                    onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none transition-colors"
                    disabled={saving}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
                ) : (
                  <><Plus className="w-5 h-5" /> Agregar Programa</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Programas existentes */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand" />
              Parrilla de Programación ({programas.length})
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
              </div>
            ) : programas.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No hay programas registrados aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {programas.map((prog) => (
                  <div
                    key={prog.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-dark-bg border border-dark-border hover:border-brand/30 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{prog.nombre}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand/20 text-brand font-medium">
                          {prog.horaInicio} - {prog.horaFin}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary truncate mb-2">{prog.descripcion || 'Sin descripción'}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <User className="w-3 h-3" />
                          <span>{getDJName(prog.djId)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <Calendar className="w-3 h-3" />
                          <span>{prog.dias.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(prog.id, prog.nombre)}
                      className="self-end sm:self-center p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar Programa"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};