import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Upload, Loader2, Newspaper, Mic2, Calendar, CheckCircle } from 'lucide-react';
import { 
  getNoticiasActivas,
  addNoticia, 
  deleteNoticia, 
  uploadImagenNoticia, 
  getPodcasts, 
  addPodcast, 
  deletePodcast, 
  uploadImagenPodcast,
  extraerVideoIdDeYoutube,
  obtenerImagenPrevisualizacionYoutube,
  type Noticia,
  type Podcast
} from '../../../core/firebase/services';
import { Timestamp } from 'firebase/firestore';

export const NoticiasPodcastsPage = () => {
  const [activeTab, setActiveTab] = useState<'noticias' | 'podcasts'>('noticias');
  
  // ✅ SOLUCIÓN DE PUREZA: El tiempo se guarda en estado, no se calcula en el render
  const [now, setNow] = useState<number>(() => Date.now());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000); // Se actualiza cada minuto
    return () => clearInterval(timer);
  }, []);
  
  // Estados Noticias
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [showFormNoticia, setShowFormNoticia] = useState(false);
  const [formDataNoticia, setFormDataNoticia] = useState({ 
    titulo: '', 
    resumen: '', 
    autor: '', 
    categoria: '', 
    activa: true 
  });
  const [imagenNoticia, setImagenNoticia] = useState<File | null>(null);
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [loadingNoticias, setLoadingNoticias] = useState(true);
  const [isSubmittingNoticia, setIsSubmittingNoticia] = useState(false);

  // Estados Podcasts
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [showFormPodcast, setShowFormPodcast] = useState(false);
  const [formDataPodcast, setFormDataPodcast] = useState({ titulo: '', youtubeUrl: '', categoria: '' });
  const [imagenPodcast, setImagenPodcast] = useState<File | null>(null);
  const [loadingPodcasts, setLoadingPodcasts] = useState(true);
  const [isSubmittingPodcast, setIsSubmittingPodcast] = useState(false);

  const fileInputNoticiaRef = useRef<HTMLInputElement>(null);
  const fileInputPodcastRef = useRef<HTMLInputElement>(null);

  // Carga de datos: SOLO noticias activas
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (activeTab === 'noticias') {
        setLoadingNoticias(true);
        try {
          const data = await getNoticiasActivas();
          if (isMounted) setNoticias(data);
        } catch (error) {
          console.error('Error al cargar noticias:', error);
        } finally {
          if (isMounted) setLoadingNoticias(false);
        }
      } else {
        setLoadingPodcasts(true);
        try {
          const data = await getPodcasts();
          if (isMounted) setPodcasts(data);
        } catch (error) {
          console.error('Error al cargar podcasts:', error);
        } finally {
          if (isMounted) setLoadingPodcasts(false);
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [activeTab]);

  const handleNoticiaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNoticia(true);
    try {
      if (!imagenNoticia) {
        alert('Por favor, suba una imagen para la noticia.');
        setIsSubmittingNoticia(false);
        return;
      }
      const imagenUrl = await uploadImagenNoticia(imagenNoticia);
      let expiracionTimestamp: Timestamp | undefined = undefined;
      if (fechaExpiracion) {
        expiracionTimestamp = Timestamp.fromDate(new Date(fechaExpiracion));
      }

      await addNoticia({
        ...formDataNoticia,
        imagenUrl,
        fechaExpiracion: expiracionTimestamp
      });
      
      resetFormNoticia();
      setLoadingNoticias(true);
      setNoticias(await getNoticiasActivas());
      setLoadingNoticias(false);
    } catch (error) {
      console.error('Error al guardar noticia:', error);
      alert('Error al guardar la noticia.');
    } finally {
      setIsSubmittingNoticia(false);
    }
  };

  const handleDeleteNoticia = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta noticia?')) {
      try {
        await deleteNoticia(id);
        setLoadingNoticias(true);
        setNoticias(await getNoticiasActivas());
        setLoadingNoticias(false);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const resetFormNoticia = () => {
    setFormDataNoticia({ titulo: '', resumen: '', autor: '', categoria: '', activa: true });
    setImagenNoticia(null);
    setFechaExpiracion('');
    setShowFormNoticia(false);
    if (fileInputNoticiaRef.current) fileInputNoticiaRef.current.value = '';
  };

  const handlePodcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPodcast(true);
    try {
      const videoId = extraerVideoIdDeYoutube(formDataPodcast.youtubeUrl);
      if (!videoId) { 
        alert('URL de YouTube no válida.'); 
        setIsSubmittingPodcast(false); 
        return; 
      }
      // ✅ CORREGIDO: Usamos const en lugar de let
      const imagenUrl = imagenPodcast 
        ? await uploadImagenPodcast(imagenPodcast) 
        : obtenerImagenPrevisualizacionYoutube(videoId);
        
      await addPodcast({ 
        titulo: formDataPodcast.titulo, 
        youtubeUrl: formDataPodcast.youtubeUrl, 
        categoria: formDataPodcast.categoria, 
        imagenUrl 
      });
      
      resetFormPodcast();
      setLoadingPodcasts(true); 
      setPodcasts(await getPodcasts()); 
      setLoadingPodcasts(false);
    } catch (error) {
      console.error('Error al guardar podcast:', error);
      alert('Error al guardar el podcast.');
    } finally { 
      setIsSubmittingPodcast(false); 
    }
  };

  const handleDeletePodcast = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este podcast?')) {
      try { 
        await deletePodcast(id); 
        setLoadingPodcasts(true); 
        setPodcasts(await getPodcasts()); 
        setLoadingPodcasts(false); 
      } catch (error) { 
        console.error('Error al eliminar:', error); 
      }
    }
  };

  const resetFormPodcast = () => {
    setFormDataPodcast({ titulo: '', youtubeUrl: '', categoria: '' });
    setImagenPodcast(null);
    setShowFormPodcast(false);
    if (fileInputPodcastRef.current) fileInputPodcastRef.current.value = '';
  };

  const formatFecha = (timestamp: Timestamp) => timestamp.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatFechaExpiracion = (timestamp: Timestamp) => timestamp.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-dark-border">
        <button onClick={() => setActiveTab('noticias')} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'noticias' ? 'border-brand text-brand' : 'border-transparent text-text-secondary hover:text-white'}`}>
          <Newspaper className="w-4 h-4" /> Noticias
        </button>
        <button onClick={() => setActiveTab('podcasts')} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'podcasts' ? 'border-brand text-brand' : 'border-transparent text-text-secondary hover:text-white'}`}>
          <Mic2 className="w-4 h-4" /> Podcasts
        </button>
      </div>

      {activeTab === 'noticias' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Gestión de Noticias</h2>
              <p className="text-sm text-text-secondary">Aquí solo aparecen las noticias activas y visibles en la web.</p>
            </div>
            {!showFormNoticia && (
              <button onClick={() => setShowFormNoticia(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors">
                <Plus className="w-4 h-4" /> Nueva Noticia
              </button>
            )}
          </div>

          {showFormNoticia && (
            <form onSubmit={handleNoticiaSubmit} className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
              <h3 className="text-lg font-bold text-white">Agregar Nueva Noticia</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Título" value={formDataNoticia.titulo} onChange={e => setFormDataNoticia({...formDataNoticia, titulo: e.target.value})} className="px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none" />
                <input required type="text" placeholder="Categoría" value={formDataNoticia.categoria} onChange={e => setFormDataNoticia({...formDataNoticia, categoria: e.target.value})} className="px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none" />
              </div>
              <input required type="text" placeholder="Autor" value={formDataNoticia.autor} onChange={e => setFormDataNoticia({...formDataNoticia, autor: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none" />
              <textarea required rows={3} placeholder="Resumen o cuerpo de la noticia" value={formDataNoticia.resumen} onChange={e => setFormDataNoticia({...formDataNoticia, resumen: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none resize-none" />
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-brand/10 border border-brand/30">
                <input type="checkbox" id="activa" checked={formDataNoticia.activa} onChange={(e) => setFormDataNoticia({...formDataNoticia, activa: e.target.checked})} className="w-5 h-5 rounded border-dark-border text-brand focus:ring-brand cursor-pointer" />
                <label htmlFor="activa" className="text-sm font-bold text-white cursor-pointer select-none">
                  ✅ Marcar como Activa (Visible en la página principal)
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Fecha y hora de expiración (Opcional)</label>
                <input type="datetime-local" value={fechaExpiracion} onChange={(e) => setFechaExpiracion(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none [color-scheme:dark]" />
                <p className="text-xs text-text-muted">Deje vacío si no debe expirar.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Imagen de portada</label>
                <div className="flex items-center gap-4">
                  <input type="file" ref={fileInputNoticiaRef} accept="image/*" onChange={e => setImagenNoticia(e.target.files?.[0] || null)} className="hidden" />
                  <button type="button" onClick={() => fileInputNoticiaRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-elevated border border-dark-border hover:bg-dark-bg text-white transition-colors">
                    <Upload className="w-4 h-4" /> {imagenNoticia ? 'Cambiar imagen' : 'Subir imagen'}
                  </button>
                  {imagenNoticia && <span className="text-sm text-text-secondary">{imagenNoticia.name}</span>}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmittingNoticia} className="px-6 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSubmittingNoticia && <Loader2 className="w-4 h-4 animate-spin" />} Publicar Noticia
                </button>
                <button type="button" onClick={resetFormNoticia} className="px-6 py-2.5 rounded-lg bg-dark-elevated hover:bg-dark-bg border border-dark-border text-white font-semibold transition-colors">Cancelar</button>
              </div>
            </form>
          )}

          {loadingNoticias ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {noticias.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-text-secondary bg-dark-surface rounded-xl border border-dark-border border-dashed">
                  No hay noticias activas. ¡Cree la primera!
                </div>
              ) : (
                noticias.map((n) => {
                  // ✅ CORREGIDO: Usamos la variable de estado 'now' en lugar de Date.now()
                  const estaExpirada = !!(n.fechaExpiracion && n.fechaExpiracion.toMillis() <= now);
                  return (
                    <div key={n.id} className={`p-4 rounded-xl border flex gap-4 ${estaExpirada ? 'bg-red-500/5 border-red-500/20 opacity-70' : 'bg-dark-surface border-dark-border'}`}>
                      <img src={n.imagenUrl} alt={n.titulo} className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-dark-bg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white truncate">{n.titulo}</h4>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{n.resumen}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatFecha(n.fecha)}</span>
                          {estaExpirada ? (
                            <span className="text-red-400 font-medium">Expirada</span>
                          ) : n.fechaExpiracion ? (
                            <span className="text-yellow-500 font-medium">Expira: {formatFechaExpiracion(n.fechaExpiracion)}</span>
                          ) : (
                            <span className="text-green-500 font-medium">Activa indefinidamente</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteNoticia(n.id)} className="p-2 rounded-lg bg-dark-elevated hover:bg-red-500/20 text-text-secondary hover:text-red-500 transition-colors self-start">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'podcasts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Gestión de Podcasts</h2>
              <p className="text-sm text-text-secondary">Agregue episodios mediante enlaces de YouTube.</p>
            </div>
            {!showFormPodcast && (
              <button onClick={() => setShowFormPodcast(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors">
                <Plus className="w-4 h-4" /> Nuevo Podcast
              </button>
            )}
          </div>
          {showFormPodcast && (
            <form onSubmit={handlePodcastSubmit} className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
              <h3 className="text-lg font-bold text-white">Agregar Nuevo Podcast</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Título del episodio" value={formDataPodcast.titulo} onChange={e => setFormDataPodcast({...formDataPodcast, titulo: e.target.value})} className="px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none" />
                <input required type="text" placeholder="Categoría" value={formDataPodcast.categoria} onChange={e => setFormDataPodcast({...formDataPodcast, categoria: e.target.value})} className="px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none" />
              </div>
              <input required type="url" placeholder="URL de YouTube" value={formDataPodcast.youtubeUrl} onChange={e => setFormDataPodcast({...formDataPodcast, youtubeUrl: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none" />
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Miniatura personalizada (Opcional)</label>
                <div className="flex items-center gap-4">
                  <input type="file" ref={fileInputPodcastRef} accept="image/*" onChange={e => setImagenPodcast(e.target.files?.[0] || null)} className="hidden" />
                  <button type="button" onClick={() => fileInputPodcastRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-elevated border border-dark-border hover:bg-dark-bg text-white transition-colors">
                    <Upload className="w-4 h-4" /> {imagenPodcast ? 'Cambiar imagen' : 'Usar miniatura de YouTube'}
                  </button>
                  {imagenPodcast && <span className="text-sm text-text-secondary">{imagenPodcast.name}</span>}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmittingPodcast} className="px-6 py-2.5 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSubmittingPodcast && <Loader2 className="w-4 h-4 animate-spin" />} Publicar Podcast
                </button>
                <button type="button" onClick={resetFormPodcast} className="px-6 py-2.5 rounded-lg bg-dark-elevated hover:bg-dark-bg border border-dark-border text-white font-semibold transition-colors">Cancelar</button>
              </div>
            </form>
          )}
          {loadingPodcasts ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {podcasts.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-dark-surface border border-dark-border flex gap-4">
                  <img src={p.imagenUrl} alt={p.titulo} className="w-32 h-20 rounded-lg object-cover flex-shrink-0 bg-dark-bg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{p.titulo}</h4>
                    <p className="text-xs text-text-secondary mt-1">{p.categoria}</p>
                  </div>
                  <button onClick={() => handleDeletePodcast(p.id)} className="p-2 rounded-lg bg-dark-elevated hover:bg-red-500/20 text-text-secondary hover:text-red-500 transition-colors self-start">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};