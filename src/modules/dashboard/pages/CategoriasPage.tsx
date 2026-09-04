import { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit2, Upload, Loader2, FolderTree, 
  X, ArrowLeftCircle
} from 'lucide-react';
import { 
  getCategorias, 
  addCategoria, 
  updateCategoria, 
  deleteCategoria, 
  uploadImagenCategoria,
  type Categoria
} from '../../../core/firebase/services';

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icono: '📦',
    padreId: '', // Vacío = categoría principal
    orden: 1,
    activo: true
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    let isMounted = true;
    const cargar = async () => {
      setLoading(true);
      try {
        const data = await getCategorias();
        if (isMounted) setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    cargar();
    return () => { isMounted = false; };
  }, []);

  // Lista de emojis sugeridos para categorías
  const emojisSugeridos = [
    '📦', '👕', '👟', '🎧', '⌚', '💄', '🏠', '🛋️', '🔧',
    '📱', '💻', '🎮', '⚽', '🎸', '📚', '🧸', '🍫', '☕',
    '🎁', '💍', '👜', '🕶️', '🧴', '🍷', '🌿', '🎨', '🔌'
  ];

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      icono: '📦',
      padreId: '',
      orden: categorias.length + 1,
      activo: true
    });
    setImagenFile(null);
    setImagenPreview('');
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenCreate = () => {
    resetForm();
    setFormData(prev => ({ ...prev, orden: categorias.length + 1 }));
    setShowForm(true);
  };

  const handleOpenEdit = (categoria: Categoria) => {
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      icono: categoria.icono || '📦',
      padreId: categoria.padreId || '',
      orden: categoria.orden,
      activo: categoria.activo
    });
    setImagenPreview(categoria.imagenUrl || '');
    setEditingId(categoria.id);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImagenFile(file);
    if (file) {
      setImagenPreview(URL.createObjectURL(file));
    } else {
      setImagenPreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        alert('El nombre de la categoría es obligatorio.');
        setIsSubmitting(false);
        return;
      }

      // Si hay imagen nueva, subirla primero
      let imagenUrl = imagenPreview;
      if (imagenFile) {
        imagenUrl = await uploadImagenCategoria(imagenFile);
      }

      const dataToSave = {
  nombre: formData.nombre.trim(),
  descripcion: formData.descripcion.trim(),
  icono: formData.icono,
  imagenUrl,
  orden: formData.orden,
  activo: formData.activo,
  // ✅ Solo se agrega padreId si tiene valor real (categoría padre seleccionada)
  ...(formData.padreId && { padreId: formData.padreId })
};

      if (editingId) {
        // Editar existente
        await updateCategoria(editingId, dataToSave);
      } else {
        // Crear nueva
        await addCategoria(dataToSave);
      }

      // Recargar lista
      const data = await getCategorias();
      setCategorias(data);
      resetForm();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar la categoría. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoria: Categoria) => {
    // Verificar si tiene subcategorías
    const tieneSubcategorias = categorias.some(c => c.padreId === categoria.id);
    if (tieneSubcategorias) {
      alert('No se puede eliminar esta categoría porque tiene subcategorías. Elimine primero las subcategorías.');
      return;
    }

    if (window.confirm(`¿Está seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        await deleteCategoria(categoria.id);
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la categoría.');
      }
    }
  };

  // Agrupar categorías: principales vs subcategorías
  const categoriasPrincipales = categorias.filter(c => !c.padreId);
  const getSubcategoriasDe = (padreId: string) => 
    categorias.filter(c => c.padreId === padreId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderTree className="w-7 h-7 text-brand" />
            Gestión de Categorías
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Organice los productos de su tienda en categorías y subcategorías.
          </p>
        </div>
        {!showForm && (
          <button 
            onClick={handleOpenCreate} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Nueva Categoría
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-brand" /> : <Plus className="w-5 h-5 text-brand" />}
            {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Nombre *</label>
              <input 
                required 
                type="text" 
                placeholder="Ej: Ropa, Café, Electrónica" 
                value={formData.nombre} 
                onChange={e => setFormData({...formData, nombre: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
              />
            </div>

            {/* Icono (emoji) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Icono (Emoji)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={formData.icono} 
                  onChange={e => setFormData({...formData, icono: e.target.value})} 
                  className="w-20 px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white text-center text-xl focus:border-brand focus:outline-none"
                  maxLength={4}
                />
                <div className="flex-1 grid grid-cols-9 gap-1 overflow-y-auto max-h-[42px]">
                  {emojisSugeridos.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({...formData, icono: emoji})}
                      className={`w-8 h-8 rounded text-lg hover:bg-dark-elevated transition-colors ${
                        formData.icono === emoji ? 'bg-brand/20 border border-brand' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary">Descripción (opcional)</label>
            <textarea 
              rows={2}
              placeholder="Breve descripción de la categoría" 
              value={formData.descripcion} 
              onChange={e => setFormData({...formData, descripcion: e.target.value})} 
              className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none resize-none"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Categoría padre (para subcategorías) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">
                {editingId ? 'Es subcategoría de:' : 'Categoría padre (opcional)'}
              </label>
              <select
                value={formData.padreId}
                onChange={e => setFormData({...formData, padreId: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
              >
                <option value="">— Categoría principal —</option>
                {categoriasPrincipales
                  .filter(c => c.id !== editingId) // No puede ser subcategoría de sí misma
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icono} {c.nombre}
                    </option>
                  ))}
              </select>
            </div>

            {/* Orden */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Orden</label>
              <input 
                type="number" 
                min={1}
                value={formData.orden} 
                onChange={e => setFormData({...formData, orden: parseInt(e.target.value) || 1})} 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
              />
            </div>

            {/* Activo */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Estado</label>
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border cursor-pointer hover:border-brand transition-colors">
                <input 
                  type="checkbox" 
                  checked={formData.activo} 
                  onChange={e => setFormData({...formData, activo: e.target.checked})} 
                  className="w-4 h-4 rounded border-dark-border text-brand focus:ring-brand"
                />
                <span className="text-white text-sm">
                  {formData.activo ? '✅ Activa (visible)' : '⏸️ Inactiva (oculta)'}
                </span>
              </label>
            </div>
          </div>

          {/* Imagen de categoría */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Imagen (opcional)</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-elevated border border-dark-border hover:bg-dark-bg text-white transition-colors"
              >
                <Upload className="w-4 h-4" /> 
                {imagenPreview ? 'Cambiar imagen' : 'Subir imagen'}
              </button>
              {imagenPreview && (
                <>
                  <img src={imagenPreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagenFile(null);
                      setImagenPreview('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
            <button 
              type="button" 
              onClick={resetForm} 
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-dark-elevated hover:bg-dark-bg border border-dark-border text-white font-semibold transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de categorías */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
      ) : categorias.length === 0 ? (
        <div className="text-center py-12 bg-dark-surface rounded-xl border border-dark-border border-dashed">
          <FolderTree className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No hay categorías creadas.</p>
          <p className="text-text-muted text-sm mt-1">¡Cree la primera para empezar a organizar su tienda!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoriasPrincipales.map(cat => {
            const subs = getSubcategoriasDe(cat.id);
            return (
              <div key={cat.id} className="rounded-xl bg-dark-surface border border-dark-border overflow-hidden">
                {/* Categoría principal */}
                <div className="flex items-center gap-4 p-4 hover:bg-dark-elevated/50 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {cat.imagenUrl ? (
                      <img src={cat.imagenUrl} alt={cat.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{cat.icono || '📦'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white truncate">{cat.nombre}</h4>
                      {!cat.activo && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase">
                          Inactiva
                        </span>
                      )}
                    </div>
                    {cat.descripcion && (
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{cat.descripcion}</p>
                    )}
                    <p className="text-[10px] text-text-muted mt-1">
                      Orden: {cat.orden} • {subs.length} subcategoría(s)
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button 
                      onClick={() => handleOpenEdit(cat)} 
                      className="p-2 rounded-lg bg-dark-elevated hover:bg-brand/20 text-text-secondary hover:text-brand transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat)} 
                      className="p-2 rounded-lg bg-dark-elevated hover:bg-red-500/20 text-text-secondary hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategorías */}
                {subs.length > 0 && (
                  <div className="border-t border-dark-border bg-dark-bg/30">
                    {subs.map(sub => (
                      <div 
                        key={sub.id} 
                        className="flex items-center gap-3 p-3 pl-8 hover:bg-dark-elevated/50 transition-colors border-b border-dark-border/50 last:border-b-0"
                      >
                        <ArrowLeftCircle className="w-4 h-4 text-brand/40 rotate-90" />
                        <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {sub.imagenUrl ? (
                            <img src={sub.imagenUrl} alt={sub.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">{sub.icono || '📦'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-semibold text-white truncate">{sub.nombre}</h5>
                            {!sub.activo && (
                              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase">
                                Inactiva
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-text-muted">Orden: {sub.orden}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button 
                            onClick={() => handleOpenEdit(sub)} 
                            className="p-1.5 rounded-lg bg-dark-elevated hover:bg-brand/20 text-text-secondary hover:text-brand transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(sub)} 
                            className="p-1.5 rounded-lg bg-dark-elevated hover:bg-red-500/20 text-text-secondary hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};