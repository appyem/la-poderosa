import { useState, useEffect } from 'react';
import { Play, Clock, Calendar, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPodcasts, obtenerImagenPrevisualizacionYoutube } from '../../../core/firebase/services';

interface AdaptedPodcastDetail {
  id: string;
  title: string;
  author: string;
  episodes: number;
  image: string;
  category: string;
  youtubeUrl: string;
}

export const PodcastDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState<AdaptedPodcastDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPodcasts().then(data => {
      const found = data.find(p => p.id === id);
      if (found) {
        setPodcast({
          id: found.id,
          title: found.titulo,
          author: 'LA PODEROSA',
          episodes: 1,
          image: obtenerImagenPrevisualizacionYoutube(found.youtubeVideoId),
          category: found.categoria,
          youtubeUrl: found.youtubeUrl
        });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  if (!podcast) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Podcast no encontrado</h2>
        <button onClick={() => navigate('/podcasts')} className="text-brand hover:underline">Volver a podcasts</button>
      </div>
    );
  }

  // Mock de episodios (hasta que se implemente gestión de episodios por separado)
  const episodes = [
    { id: 'ep1', title: `Episodio completo: ${podcast.title}`, duration: 'Variable', date: 'Hoy', plays: 'N/A' },
  ];

  return (
    <div className="space-y-8 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a podcasts
      </button>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <img src={podcast.image} alt={podcast.title} className="w-full md:w-64 h-64 rounded-2xl object-cover shadow-2xl shadow-brand/10" />
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-sm text-brand font-semibold uppercase tracking-wider">
            <span>{podcast.category}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">{podcast.title}</h1>
          <p className="text-lg text-text-secondary">Presentado por {podcast.author}</p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <a 
              href={podcast.youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold shadow-lg shadow-brand/30 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Ver en YouTube
            </a>
            <button className="p-3 rounded-lg bg-dark-surface border border-dark-border hover:bg-dark-elevated transition-colors text-white">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Episodios</h2>
        <div className="space-y-2">
          {episodes.map((ep, index) => (
            <a 
              key={ep.id} 
              href={podcast.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-xl bg-dark-surface hover:bg-dark-elevated border border-transparent hover:border-dark-border transition-all cursor-pointer"
            >
              <div className="flex-shrink-0 w-8 text-center text-text-muted font-mono text-sm">{index + 1}</div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate group-hover:text-brand transition-colors">{ep.title}</h3>
                <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ep.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ep.duration}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};