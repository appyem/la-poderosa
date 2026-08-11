import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Upload, ExternalLink, Loader2 } from 'lucide-react';
import { 
  getAliados, 
  addAliado, 
  updateAliado, 
  deleteAliado, 
  uploadImagenAliado, 
  type Aliado 
} from '../../../core/firebase/services';

export const AliadosPage = () => {
  const [aliados, setAliados] = useState<Aliado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', enlaceUrl: '' });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Carga inicial segura. El linter ya no marca error aquí.
  useEffect(() => {
    const cargarAliados = async () => {
      try {
        const data = await getAliados();
        setAliados(data);
      } catch (error) {
        console.error('Error al cargar aliados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarAliados();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imagenUrl = previewUrl;
      if (imagenFile) {
        imagenUrl = await uploadImagenAliado(imagenFile);
      }

      if (editingId) {
        await updateAliado(editingId, { ...formData, imagenUrl });
      } else {
        await addAliado({ ...formData, imagenUrl });
      }
      
      resetForm();
      setLoading(true);
      try {
        const data = await getAliados();
        setAliados(data);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al guardar aliado:', error);
      alert('Error al guardar. Intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (aliado: Aliado) => {
    setFormData({ nombre: aliado.nombre, descripcion: aliado.descripcion, enlaceUrl: aliado.enlaceUrl });
    setPreviewUrl(aliado.imagenUrl);
    setEditingId(aliado.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este aliado?')) {
      try {
        await deleteAliado(id);
        setLoading(true);
        const data = await getAliados();
        setAliados(data);
      } catch (error) {
        console.error('Error al eliminar:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', enlaceUrl: '' });
    setImagenFile(null);
    setPreviewUrl('');
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Aliados</h1>
          <p className="text-text-secondary mt-1">Agregue o edite los aliados estratégicos de la emisora.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo Aliado
          </button>
        )}
      </div>

      {showForm && (
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
          <h3 className="text-lg font-bold text-white">{editingId ? 'Editar Aliado' : 'Nuevo Aliado'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Nombre del Aliado / Empresa</label>
                <input 
                  required
                  type="text" 
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                  placeholder="Ej: Banco Nacional"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Enlace (Web, Instagram, WhatsApp)</label>
                <input 
                  required
                  type="url" 
                  value={formData.enlaceUrl}
                  onChange={(e) => setFormData({...formData, enlaceUrl: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Descripción</label>
              <textarea 
                required
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none resize-none"
                placeholder="Breve descripción del aliado..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Logo o Imagen</label>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-elevated border border-dark-border hover:bg-dark-bg text-white transition-colors"
                >
                  <Upload className="w-4 h-4" /> {imagenFile ? 'Cambiar imagen' : 'Subir imagen'}
                </button>
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-dark-border" />
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Guardar Cambios' : 'Agregar Aliado'}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className="px-6 py-2.5 rounded-lg bg-dark-elevated hover:bg-dark-bg border border-dark-border text-white font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Aliados */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aliados.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-dark-surface rounded-xl border border-dark-border border-dashed">
            <p className="text-text-secondary">No hay aliados registrados aún.</p>
          </div>
        ) : (
          aliados.map((aliado) => (
            <div key={aliado.id} className="p-4 rounded-xl bg-dark-surface border border-dark-border flex gap-4">
              <img src={aliado.imagenUrl} alt={aliado.nombre} className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-dark-bg" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{aliado.nombre}</h4>
                <p className="text-sm text-text-secondary line-clamp-2 mt-1">{aliado.descripcion}</p>
                <a href={aliado.enlaceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline flex items-center gap-1 mt-2">
                  <ExternalLink className="w-3 h-3" /> Visitar enlace
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEdit(aliado)} className="p-2 rounded-lg bg-dark-elevated hover:bg-brand/20 text-text-secondary hover:text-brand transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(aliado.id)} className="p-2 rounded-lg bg-dark-elevated hover:bg-red-500/20 text-text-secondary hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};