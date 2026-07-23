import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { 
  Megaphone, Plus, Trash2, Loader2, Upload, Image as ImageIcon, 
  AlertCircle, CheckCircle, ExternalLink, ToggleLeft, ToggleRight 
} from 'lucide-react';
import { 
  addAnuncio, 
  getAnuncios, 
  updateAnuncio, 
  deleteAnuncio, 
  uploadImagenAnuncio,
  type Anuncio 
} from '../../../core/firebase/services';

export const PublicidadPage = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enlaceUrl, setEnlaceUrl] = useState('');
  const [activo, setActivo] = useState(true);
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  // ✅ CORREGIDO: Función declarada ANTES de ser usada en useEffect
  const cargarAnuncios = async () => {
    setLoading(true);
    try {
      const data = await getAnuncios();
      setAnuncios(data);
    } catch (error) {
      console.error('Error al cargar anuncios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarAnuncios();
  }, []);

  const mostrarMensaje = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !empresa.trim() || !imagenFile) {
      mostrarMensaje('error', 'El título, la empresa y la imagen son obligatorios.');
      return;
    }

    try {
      setSaving(true);
      const imagenUrl = await uploadImagenAnuncio(imagenFile);
      
      await addAnuncio({
        titulo,
        empresa,
        descripcion,
        enlaceUrl,
        activo,
        imagenUrl
      });

      // Limpiar formulario
      setTitulo('');
      setEmpresa('');
      setDescripcion('');
      setEnlaceUrl('');
      setActivo(true);
      setImagenFile(null);
      const inputImagen = document.getElementById('imagen-anuncio-input') as HTMLInputElement;
      if (inputImagen) inputImagen.value = '';
      
      await cargarAnuncios();
      mostrarMensaje('success', 'Anuncio publicado exitosamente.');
    } catch (error) {
      console.error('Error al publicar anuncio:', error);
      mostrarMensaje('error', 'Error al publicar el anuncio.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActivo = async (id: string, estadoActual: boolean) => {
    try {
      await updateAnuncio(id, { activo: !estadoActual });
      await cargarAnuncios();
      mostrarMensaje('success', `Anuncio ${!estadoActual ? 'activado' : 'desactivado'}.`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este anuncio permanentemente?')) return;
    try {
      await deleteAnuncio(id);
      await cargarAnuncios();
      mostrarMensaje('success', 'Anuncio eliminado.');
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión de Publicidad</h1>
        <p className="text-sm text-text-secondary mt-1">Administre los banners y anuncios que se muestran en la plataforma</p>
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
        {/* Formulario de Nuevo Anuncio */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border sticky top-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Plus className="w-5 h-5 text-brand" />
              Nuevo Anuncio
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Título del Anuncio *</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nombre de la Empresa *</label>
                <input
                  type="text"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Descripción / Lo que hacen</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none resize-none"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">URL de Enlace (Redes o Web)</label>
                <input
                  type="url"
                  value={enlaceUrl}
                  onChange={(e) => setEnlaceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Imagen del Anuncio *</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-border rounded-lg cursor-pointer bg-dark-bg hover:bg-dark-elevated transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 text-text-muted mb-2" />
                    <p className="text-xs text-text-secondary text-center px-4">
                      {imagenFile ? imagenFile.name : 'Clic para seleccionar imagen'}
                    </p>
                  </div>
                  <input 
                    id="imagen-anuncio-input"
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    disabled={saving}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-text-secondary">Estado:</span>
                <button
                  type="button"
                  onClick={() => setActivo(!activo)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activo ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {activo ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  {activo ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {saving ? 'Publicando...' : 'Publicar Anuncio'}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Anuncios */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
            <h2 className="text-lg font-bold mb-4 text-white">Anuncios Publicados</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
              </div>
            ) : anuncios.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                <Megaphone className="w-12 h-12 mx-auto mb-3 text-text-muted" />
                <p>No hay anuncios publicados aún.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {anuncios.map((anuncio) => (
                  <div key={anuncio.id} className="flex gap-4 p-4 rounded-lg bg-dark-bg border border-dark-border group">
                    <img 
                      src={anuncio.imagenUrl} 
                      alt={anuncio.titulo} 
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-black"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white truncate">{anuncio.titulo}</h3>
                          <p className="text-sm text-brand font-medium">{anuncio.empresa}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          anuncio.activo ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {anuncio.activo ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2 mt-2">{anuncio.descripcion}</p>
                      {anuncio.enlaceUrl && (
                        <a 
                          href={anuncio.enlaceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand hover:underline mt-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {anuncio.enlaceUrl}
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 self-start">
                      <button
                        onClick={() => handleToggleActivo(anuncio.id, anuncio.activo)}
                        className="p-2 rounded-lg text-text-muted hover:text-brand hover:bg-brand/10 transition-colors"
                        title={anuncio.activo ? 'Desactivar' : 'Activar'}
                      >
                        {anuncio.activo ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleEliminar(anuncio.id)}
                        className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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