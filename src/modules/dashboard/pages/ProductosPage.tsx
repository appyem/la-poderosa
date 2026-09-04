import { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit2, Upload, Loader2, ShoppingBag, 
  X, Star, Flame, Package
} from 'lucide-react';
import { 
  getProductos, 
  addProducto, 
  updateProducto, 
  deleteProducto, 
  uploadImagenProducto,
  getCategorias,
  type Producto,
  type Categoria
} from '../../../core/firebase/services';
import { Timestamp } from 'firebase/firestore';

export const ProductosPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcionCorta: '',
    descripcion: '',
    precio: 0,
    precioAnterior: 0,
    stock: 0,
    sku: '',
    categoriaId: '',
    destacado: false,
    enOferta: false,
    activo: true,
    fechaOfertaFin: '',
    pesoKg: 0
  });

  const [imagenes, setImagenes] = useState<string[]>([]); // URLs de imágenes ya subidas
  const [imagenesPreview, setImagenesPreview] = useState<string[]>([]); // Previews locales
  const [imagenesFiles, setImagenesFiles] = useState<File[]>([]); // Archivos pendientes de subir
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [busqueda, setBusqueda] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar productos y categorías al montar
  useEffect(() => {
    let isMounted = true;
    const cargar = async () => {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          getProductos(),
          getCategorias()
        ]);
        if (isMounted) {
          setProductos(prods);
          setCategorias(cats);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    cargar();
    return () => { isMounted = false; };
  }, []);

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcionCorta: '',
      descripcion: '',
      precio: 0,
      precioAnterior: 0,
      stock: 0,
      sku: '',
      categoriaId: categorias[0]?.id || '',
      destacado: false,
      enOferta: false,
      activo: true,
      fechaOfertaFin: '',
      pesoKg: 0
    });
    setImagenes([]);
    setImagenesPreview([]);
    setImagenesFiles([]);
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenCreate = () => {
    resetForm();
    setFormData(prev => ({ ...prev, categoriaId: categorias[0]?.id || '' }));
    setShowForm(true);
  };

  const handleOpenEdit = (producto: Producto) => {
    setFormData({
      titulo: producto.titulo,
      descripcionCorta: producto.descripcionCorta,
      descripcion: producto.descripcion,
      precio: producto.precio,
      precioAnterior: producto.precioAnterior || 0,
      stock: producto.stock,
      sku: producto.sku || '',
      categoriaId: producto.categoriaId,
      destacado: producto.destacado,
      enOferta: producto.enOferta,
      activo: producto.activo,
      fechaOfertaFin: producto.fechaOfertaFin 
  ? new Date(producto.fechaOfertaFin.toMillis()).toISOString().slice(0, 16)
  : '',
      pesoKg: producto.pesoKg || 0
    });
    setImagenes(producto.imagenes || []);
    setImagenesPreview(producto.imagenes || []);
    setImagenesFiles([]);
    setEditingId(producto.id);
    setShowForm(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = imagenes.length + imagenesFiles.length + files.length;
    
    if (total > 5) {
      alert('Máximo 5 imágenes por producto. Ya tiene ' + (imagenes.length + imagenesFiles.length) + '.');
      return;
    }

    const newFiles = files.slice(0, 5 - imagenes.length - imagenesFiles.length);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    
    setImagenesFiles(prev => [...prev, ...newFiles]);
    setImagenesPreview(prev => [...prev, ...newPreviews]);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    // Si es una imagen ya subida (URL), remover de imagenes
    if (index < imagenes.length) {
      setImagenes(prev => prev.filter((_, i) => i !== index));
    } else {
      // Si es una imagen pendiente (preview), remover de files
      const fileIndex = index - imagenes.length;
      setImagenesFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    setImagenesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validaciones
      if (!formData.titulo.trim()) {
        alert('El título del producto es obligatorio.');
        setIsSubmitting(false);
        return;
      }
      if (!formData.categoriaId) {
        alert('Debe seleccionar una categoría.');
        setIsSubmitting(false);
        return;
      }
      if (formData.precio <= 0) {
        alert('El precio debe ser mayor a 0.');
        setIsSubmitting(false);
        return;
      }
      if (imagenes.length + imagenesFiles.length === 0) {
        alert('Debe agregar al menos una imagen del producto.');
        setIsSubmitting(false);
        return;
      }

      // Subir nuevas imágenes pendientes
      const nuevasUrls: string[] = [];
      for (const file of imagenesFiles) {
        const url = await uploadImagenProducto(file);
        nuevasUrls.push(url);
      }
      const imagenesFinales = [...imagenes, ...nuevasUrls];

      // Preparar fecha de oferta
      const fechaOfertaFin = formData.enOferta && formData.fechaOfertaFin
        ? Timestamp.fromDate(new Date(formData.fechaOfertaFin))
        : undefined;

      const dataToSave = {
  titulo: formData.titulo.trim(),
  descripcionCorta: formData.descripcionCorta.trim().slice(0, 150),
  descripcion: formData.descripcion.trim(),
  precio: formData.precio,
  stock: formData.stock,
  categoriaId: formData.categoriaId,
  imagenes: imagenesFinales,
  destacado: formData.destacado,
  enOferta: formData.enOferta,
  activo: formData.activo,
  // ✅ Solo se agregan estos campos si tienen valor válido
  ...(formData.enOferta && formData.precioAnterior > 0 && { precioAnterior: formData.precioAnterior }),
  ...(formData.sku.trim() && { sku: formData.sku.trim() }),
  ...(formData.pesoKg > 0 && { pesoKg: formData.pesoKg }),
  ...(fechaOfertaFin && { fechaOfertaFin })
};

      if (editingId) {
        await updateProducto(editingId, dataToSave);
      } else {
        await addProducto(dataToSave);
      }

      const data = await getProductos();
      setProductos(data);
      resetForm();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (producto: Producto) => {
    if (window.confirm(`¿Está seguro de eliminar el producto "${producto.titulo}"?`)) {
      try {
        await deleteProducto(producto.id);
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el producto.');
      }
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = !filtroCategoria || p.categoriaId === filtroCategoria;
    const coincideBusqueda = !busqueda || 
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const getCategoriaNombre = (categoriaId: string): string => {
    return categorias.find(c => c.id === categoriaId)?.nombre || 'Sin categoría';
  };

  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const getEstadoStock = (stock: number): { texto: string; clase: string } => {
    if (stock === 0) return { texto: 'Agotado', clase: 'bg-red-500/20 text-red-400' };
    if (stock <= 5) return { texto: `Stock bajo (${stock})`, clase: 'bg-yellow-500/20 text-yellow-400' };
    return { texto: `En stock (${stock})`, clase: 'bg-green-500/20 text-green-400' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-brand" />
            Gestión de Productos
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Administre el catálogo de su tienda. Total: {productos.length} producto(s).
          </p>
        </div>
        {!showForm && (
          <button 
            onClick={handleOpenCreate} 
            disabled={categorias.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={categorias.length === 0 ? 'Primero cree al menos una categoría' : ''}
          >
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        )}
      </div>

      {/* Filtros */}
      {!showForm && productos.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-dark-surface border border-dark-border">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Buscar por título o SKU..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none text-sm"
            />
          </div>
          <select
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            className="px-4 py-2 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none text-sm"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>
                {c.icono} {c.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-brand" /> : <Plus className="w-5 h-5 text-brand" />}
            {editingId ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Título */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Título del producto *</label>
              <input 
                required 
                type="text" 
                placeholder="Ej: Camiseta La Poderosa - Edición Especial" 
                value={formData.titulo} 
                onChange={e => setFormData({...formData, titulo: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
              />
            </div>

            {/* Descripción corta */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-text-secondary">
                Descripción corta ({formData.descripcionCorta.length}/150)
              </label>
              <input 
                type="text" 
                maxLength={150}
                placeholder="Resumen para mostrar en tarjetas (máx. 150 caracteres)" 
                value={formData.descripcionCorta} 
                onChange={e => setFormData({...formData, descripcionCorta: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
              />
            </div>

            {/* Descripción larga */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Descripción completa</label>
              <textarea 
                rows={4}
                placeholder="Detalles del producto, materiales, medidas, etc." 
                value={formData.descripcion} 
                onChange={e => setFormData({...formData, descripcion: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {/* Precio */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Precio actual (COP) *</label>
              <input 
                required 
                type="number" 
                min={0}
                step={1000}
                value={formData.precio || ''} 
                onChange={e => setFormData({...formData, precio: parseInt(e.target.value) || 0})} 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                placeholder="50000"
              />
            </div>

            {/* Precio anterior (solo si hay oferta) */}
            {formData.enOferta && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Precio anterior (tachado)</label>
                <input 
                  type="number" 
                  min={0}
                  step={1000}
                  value={formData.precioAnterior || ''} 
                  onChange={e => setFormData({...formData, precioAnterior: parseInt(e.target.value) || 0})} 
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                  placeholder="80000"
                />
              </div>
            )}

            {/* Stock */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Stock disponible</label>
              <input 
                type="number" 
                min={0}
                value={formData.stock || ''} 
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
              />
            </div>

            {/* SKU */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">SKU (código interno)</label>
              <input 
                type="text" 
                placeholder="CAM-001" 
                value={formData.sku} 
                onChange={e => setFormData({...formData, sku: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Categoría *</label>
              <select
                required
                value={formData.categoriaId}
                onChange={e => setFormData({...formData, categoriaId: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
              >
                <option value="">— Seleccione una categoría —</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icono} {c.nombre} {c.padreId ? '(subcategoría)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Peso */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Peso (kg)</label>
              <input 
                type="number" 
                min={0}
                step={0.1}
                value={formData.pesoKg || ''} 
                onChange={e => setFormData({...formData, pesoKg: parseFloat(e.target.value) || 0})} 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                placeholder="0.5"
              />
            </div>
          </div>

          {/* Flags (Destacado, Oferta, Activo) */}
          <div className="grid md:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-lg bg-dark-bg border border-dark-border cursor-pointer hover:border-brand transition-colors">
              <input 
                type="checkbox" 
                checked={formData.destacado} 
                onChange={e => setFormData({...formData, destacado: e.target.checked})} 
                className="w-4 h-4 rounded border-dark-border text-brand focus:ring-brand"
              />
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm">Producto Destacado</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-lg bg-dark-bg border border-dark-border cursor-pointer hover:border-brand transition-colors">
              <input 
                type="checkbox" 
                checked={formData.enOferta} 
                onChange={e => setFormData({...formData, enOferta: e.target.checked})} 
                className="w-4 h-4 rounded border-dark-border text-brand focus:ring-brand"
              />
              <Flame className="w-4 h-4 text-red-400" />
              <span className="text-white text-sm">En Oferta</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-lg bg-dark-bg border border-dark-border cursor-pointer hover:border-brand transition-colors">
              <input 
                type="checkbox" 
                checked={formData.activo} 
                onChange={e => setFormData({...formData, activo: e.target.checked})} 
                className="w-4 h-4 rounded border-dark-border text-brand focus:ring-brand"
              />
              <Package className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">
                {formData.activo ? 'Visible en tienda' : 'Oculto en tienda'}
              </span>
            </label>
          </div>

          {/* Fecha fin de oferta */}
          {formData.enOferta && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">
                Fecha de fin de oferta (opcional)
              </label>
              <input 
                type="datetime-local" 
                value={formData.fechaOfertaFin}
                onChange={e => setFormData({...formData, fechaOfertaFin: e.target.value})}
                className="w-full md:w-1/2 px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none [color-scheme:dark]"
              />
            </div>
          )}

          {/* Galería de imágenes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Imágenes del producto ({imagenes.length + imagenesFiles.length}/5) *
            </label>
            <div className="flex flex-wrap gap-3">
              {imagenesPreview.map((preview, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Preview ${idx + 1}`} 
                    className="w-24 h-24 rounded-lg object-cover border-2 border-dark-border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-brand text-white text-[9px] font-bold">
                      PRINCIPAL
                    </span>
                  )}
                </div>
              ))}
              
              {imagenes.length + imagenesFiles.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-dark-border hover:border-brand flex flex-col items-center justify-center gap-1 text-text-muted hover:text-brand transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-[10px]">Agregar</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              multiple
              onChange={handleImageSelect} 
              className="hidden" 
            />
            <p className="text-xs text-text-muted">
              La primera imagen será la principal. Se permiten hasta 5 imágenes.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? 'Guardar Cambios' : 'Crear Producto'}
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

      {/* Lista de productos */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-12 bg-dark-surface rounded-xl border border-dark-border border-dashed">
          <ShoppingBag className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No hay productos creados.</p>
          <p className="text-text-muted text-sm mt-1">
            {categorias.length === 0 
              ? 'Primero cree al menos una categoría.' 
              : '¡Cree el primer producto para empezar a vender!'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productosFiltrados.map(producto => {
            const estadoStock = getEstadoStock(producto.stock);
            return (
              <div key={producto.id} className="rounded-xl bg-dark-surface border border-dark-border overflow-hidden hover:border-brand/30 transition-colors">
                <div className="relative aspect-square bg-dark-bg overflow-hidden">
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img 
                      src={producto.imagenes[0]} 
                      alt={producto.titulo} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {producto.destacado && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500 text-white text-[10px] font-bold uppercase flex items-center gap-1">
                        <Star className="w-2.5 h-2.5" /> Destacado
                      </span>
                    )}
                    {producto.enOferta && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" /> Oferta
                      </span>
                    )}
                    {!producto.activo && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-500 text-white text-[10px] font-bold uppercase">
                        Oculto
                      </span>
                    )}
                  </div>

                  {/* Cantidad de imágenes */}
                  {producto.imagenes && producto.imagenes.length > 1 && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm">
                      +{producto.imagenes.length - 1} fotos
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div>
                    <p className="text-[10px] text-brand font-semibold uppercase">
                      {getCategoriaNombre(producto.categoriaId)}
                    </p>
                    <h4 className="font-bold text-white line-clamp-1">{producto.titulo}</h4>
                    {producto.sku && (
                      <p className="text-[10px] text-text-muted">SKU: {producto.sku}</p>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">
                      {formatPrecio(producto.precio)}
                    </span>
                    {producto.enOferta && producto.precioAnterior && (
                      <span className="text-xs text-text-muted line-through">
                        {formatPrecio(producto.precioAnterior)}
                      </span>
                    )}
                  </div>

                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${estadoStock.clase}`}>
                    {estadoStock.texto}
                  </span>

                  <div className="flex gap-2 pt-2 border-t border-dark-border">
                    <button 
                      onClick={() => handleOpenEdit(producto)} 
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-dark-elevated hover:bg-brand/20 text-text-secondary hover:text-brand transition-colors text-xs font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(producto)} 
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-dark-elevated hover:bg-red-500/20 text-text-secondary hover:text-red-500 transition-colors text-xs font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};