import { useState, useEffect } from 'react';
import { Plus, Trash2, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { addDJ, getDJs, deleteDJ, type DJ } from '../../../core/firebase/services';

export const DJsPage = () => {
  const [djs, setDjs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    fotoUrl: '',
    bio: ''
  });

  useEffect(() => {
    getDJs().then(data => {
      setDjs(data);
      setLoading(false);
    }).catch(error => {
      console.error('Error al cargar DJs:', error);
      setMessage({ type: 'error', text: 'Error al cargar los DJs' });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setMessage({ type: 'error', text: 'El nombre del DJ es obligatorio' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      
      // ✅ SOLUCIÓN TIPADA: Definimos el tipo exacto que espera la función addDJ
      const djData: { nombre: string; fotoUrl?: string; bio?: string } = {
        nombre: formData.nombre.trim(),
      };
      
      // Solo agregamos las propiedades opcionales si tienen valor real
      if (formData.fotoUrl.trim()) {
        djData.fotoUrl = formData.fotoUrl.trim();
      }
      
      if (formData.bio.trim()) {
        djData.bio = formData.bio.trim();
      }
      
      await addDJ(djData);

      setFormData({ nombre: '', fotoUrl: '', bio: '' });
      
      const data = await getDJs();
      setDjs(data);
      
      setMessage({ type: 'success', text: 'DJ agregado exitosamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al agregar DJ:', error);
      setMessage({ type: 'error', text: 'Error al agregar el DJ' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (djId: string, djNombre: string) => {
    if (!confirm(`¿Está seguro de eliminar a "${djNombre}"?`)) return;

    try {
      await deleteDJ(djId);
      const data = await getDJs();
      setDjs(data);
      setMessage({ type: 'success', text: 'DJ eliminado correctamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al eliminar DJ:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el DJ' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de DJs</h1>
          <p className="text-sm text-text-secondary mt-1">Administre los locutores y presentadores de la emisora</p>
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
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border sticky top-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand" />
              Agregar Nuevo DJ
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nombre del DJ *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Carlos Rodríguez"
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-text-muted focus:border-brand focus:outline-none transition-colors"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">URL de Foto (opcional)</label>
                <input
                  type="url"
                  value={formData.fotoUrl}
                  onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-text-muted focus:border-brand focus:outline-none transition-colors"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Biografía (opcional)</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Breve descripción del DJ..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-text-muted focus:border-brand focus:outline-none transition-colors resize-none"
                  disabled={saving}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
                ) : (
                  <><Plus className="w-5 h-5" /> Agregar DJ</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand" />
              DJs Registrados ({djs.length})
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
              </div>
            ) : djs.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No hay DJs registrados aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {djs.map((dj) => (
                  <div
                    key={dj.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-dark-bg border border-dark-border hover:border-brand/30 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      {dj.fotoUrl ? (
                        <img src={dj.fotoUrl} alt={dj.nombre} className="w-12 h-12 rounded-full object-cover border-2 border-brand/30" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-brand" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{dj.nombre}</h3>
                      {dj.bio && <p className="text-sm text-text-secondary truncate mt-0.5">{dj.bio}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(dj.id, dj.nombre)}
                      className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar DJ"
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