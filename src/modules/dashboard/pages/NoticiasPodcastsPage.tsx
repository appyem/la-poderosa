import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Newspaper, Mic, Plus, Trash2, Loader2, Upload, Video, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  addNoticia, 
  getNoticiasDelDia, 
  deleteNoticia, 
  uploadImagenNoticia, 
  addPodcast, 
  getPodcasts, 
  deletePodcast, 
  obtenerImagenPrevisualizacionYoutube,
  type Noticia, 
  type Podcast 
} from '../../../core/firebase/services';

type TabType = 'noticias' | 'podcasts';

export const NoticiasPodcastsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('noticias');
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados para Noticias
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [nuevaNoticia, setNuevaNoticia] = useState({ titulo: '', resumen: '', autor: '', categoria: '' });
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  // Estados para Podcasts
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [nuevoPodcast, setNuevoPodcast] = useState({ titulo: '', youtubeUrl: '', categoria: '' });

  // ✅ CORREGIDO: Función declarada ANTES de ser usada en useEffect
  const cargarDatos = async () => {
    setLoadingData(true);
    try {
      const [noticiasData, podcastsData] = await Promise.all([
        getNoticiasDelDia(),
        getPodcasts()
      ]);
      setNoticias(noticiasData);
      setPodcasts(podcastsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos();
  }, []);

  const mostrarMensaje = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // --- Lógica de Noticias ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenFile(e.target.files[0]);
    }
  };

  const handleSubmitNoticia = async (e: FormEvent) => {
    e.preventDefault();
    if (!nuevaNoticia.titulo.trim() || !imagenFile) {
      mostrarMensaje('error', 'El título y la imagen son obligatorios.');
      return;
    }

    try {
      setSaving(true);
      const imagenUrl = await uploadImagenNoticia(imagenFile);
      
      await addNoticia({
        titulo: nuevaNoticia.titulo,
        resumen: nuevaNoticia.resumen,
        autor: nuevaNoticia.autor,
        categoria: nuevaNoticia.categoria,
        imagenUrl: imagenUrl
      });

      setNuevaNoticia({ titulo: '', resumen: '', autor: '', categoria: '' });
      setImagenFile(null);
      const inputImagen = document.getElementById('imagen-input') as HTMLInputElement;
      if (inputImagen) inputImagen.value = '';
      
      await cargarDatos();
      mostrarMensaje('success', 'Noticia publicada exitosamente.');
    } catch (error) {
      console.error('Error al publicar noticia:', error);
      mostrarMensaje('error', 'Error al publicar la noticia.');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarNoticia = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta noticia?')) return;
    try {
      await deleteNoticia(id);
      await cargarDatos();
      mostrarMensaje('success', 'Noticia eliminada.');
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  // --- Lógica de Podcasts ---
  const handleSubmitPodcast = async (e: FormEvent) => {
    e.preventDefault();
    if (!nuevoPodcast.titulo.trim() || !nuevoPodcast.youtubeUrl.trim()) {
      mostrarMensaje('error', 'El título y la URL de YouTube son obligatorios.');
      return;
    }

    try {
      setSaving(true);
      await addPodcast(nuevoPodcast);
      setNuevoPodcast({ titulo: '', youtubeUrl: '', categoria: '' });
      await cargarDatos();
      mostrarMensaje('success', 'Podcast agregado exitosamente.');
    } catch (error) {
      console.error('Error al agregar podcast:', error);
      mostrarMensaje('error', 'Error al agregar el podcast. Verifique la URL de YouTube.');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarPodcast = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este podcast?')) return;
    try {
      await deletePodcast(id);
      await cargarDatos();
      mostrarMensaje('success', 'Podcast eliminado.');
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Contenido</h1>
          <p className="text-sm text-text-secondary mt-1">Administre las noticias del día y los podcasts</p>
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

      {/* Pestañas */}
      <div className="flex gap-2 border-b border-dark-border pb-2">
        <button
          onClick={() => setActiveTab('noticias')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'noticias' 
              ? 'bg-brand/20 text-brand border border-brand/30' 
              : 'text-text-secondary hover:bg-dark-elevated'
          }`}
        >
          <Newspaper className="w-4 h-4" /> Noticias del Día ({noticias.length})
        </button>
        <button
          onClick={() => setActiveTab('podcasts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'podcasts' 
              ? 'bg-brand/20 text-brand border border-brand/30' 
              : 'text-text-secondary hover:bg-dark-elevated'
          }`}
        >
          <Mic className="w-4 h-4" /> Podcasts ({podcasts.length})
        </button>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
      ) : (
        <>
          {/* ================= SECCIÓN NOTICIAS ================= */}
          {activeTab === 'noticias' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Formulario Noticias */}
              <div className="lg:col-span-1">
                <div className="p-6 rounded-xl bg-dark-surface border border-dark-border sticky top-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-brand" />
                    Nueva Noticia
                  </h2>
                  <form onSubmit={handleSubmitNoticia} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Título *</label>
                      <input
                        type="text"
                        value={nuevaNoticia.titulo}
                        onChange={(e) => setNuevaNoticia({ ...nuevaNoticia, titulo: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Resumen</label>
                      <textarea
                        value={nuevaNoticia.resumen}
                        onChange={(e) => setNuevaNoticia({ ...nuevaNoticia, resumen: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none resize-none"
                        disabled={saving}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Autor</label>
                        <input
                          type="text"
                          value={nuevaNoticia.autor}
                          onChange={(e) => setNuevaNoticia({ ...nuevaNoticia, autor: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Categoría</label>
                        <input
                          type="text"
                          value={nuevaNoticia.categoria}
                          onChange={(e) => setNuevaNoticia({ ...nuevaNoticia, categoria: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                          disabled={saving}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Imagen (desde PC) *</label>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-border rounded-lg cursor-pointer bg-dark-bg hover:bg-dark-elevated transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 text-text-muted mb-2" />
                          <p className="text-xs text-text-secondary text-center px-4">
                            {imagenFile ? imagenFile.name : 'Clic para seleccionar imagen'}
                          </p>
                        </div>
                        <input 
                          id="imagen-input"
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          disabled={saving}
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      {saving ? 'Publicando...' : 'Publicar Noticia'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Lista Noticias */}
              <div className="lg:col-span-2">
                <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
                  <h2 className="text-lg font-bold mb-4">Noticias Publicadas Hoy</h2>
                  {noticias.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                      <Newspaper className="w-12 h-12 mx-auto mb-3 text-text-muted" />
                      <p>No hay noticias publicadas hoy.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {noticias.map((noticia) => (
                        <div key={noticia.id} className="flex gap-4 p-3 rounded-lg bg-dark-bg border border-dark-border group">
                          <img 
                            src={noticia.imagenUrl} 
                            alt={noticia.titulo} 
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{noticia.titulo}</h3>
                            <p className="text-sm text-text-secondary line-clamp-2 mt-1">{noticia.resumen}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                              <span>{noticia.autor}</span> • <span>{noticia.categoria}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEliminarNoticia(noticia.id)}
                            className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 self-start"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= SECCIÓN PODCASTS ================= */}
          {activeTab === 'podcasts' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Formulario Podcasts */}
              <div className="lg:col-span-1">
                <div className="p-6 rounded-xl bg-dark-surface border border-dark-border sticky top-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-brand" />
                    Nuevo Podcast
                  </h2>
                  <form onSubmit={handleSubmitPodcast} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Título *</label>
                      <input
                        type="text"
                        value={nuevoPodcast.titulo}
                        onChange={(e) => setNuevoPodcast({ ...nuevoPodcast, titulo: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">URL de YouTube *</label>
                      <input
                        type="url"
                        value={nuevoPodcast.youtubeUrl}
                        onChange={(e) => setNuevoPodcast({ ...nuevoPodcast, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Categoría</label>
                      <input
                        type="text"
                        value={nuevoPodcast.categoria}
                        onChange={(e) => setNuevoPodcast({ ...nuevoPodcast, categoria: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
                        disabled={saving}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                      {saving ? 'Guardando...' : 'Agregar Podcast'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Lista Podcasts */}
              <div className="lg:col-span-2">
                <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
                  <h2 className="text-lg font-bold mb-4">Podcasts Registrados</h2>
                  {podcasts.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                      <Mic className="w-12 h-12 mx-auto mb-3 text-text-muted" />
                      <p>No hay podcasts registrados.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {podcasts.map((podcast) => (
                        <div key={podcast.id} className="relative group rounded-lg overflow-hidden bg-dark-bg border border-dark-border">
                          <a 
                            href={podcast.youtubeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block aspect-video bg-black"
                          >
                            <img 
                              src={obtenerImagenPrevisualizacionYoutube(podcast.youtubeVideoId)} 
                              alt={podcast.titulo}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x180?text=Sin+Imagen';
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                              <Video className="w-10 h-10 text-red-600 drop-shadow-lg" />
                            </div>
                          </a>
                          <div className="p-3">
                            <h3 className="font-semibold text-white text-sm truncate">{podcast.titulo}</h3>
                            <p className="text-xs text-text-muted mt-1">{podcast.categoria}</p>
                          </div>
                          <button
                            onClick={() => handleEliminarPodcast(podcast.id)}
                            className="absolute top-2 right-2 p-2 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};