import { Play, Clock, Calendar, Download, Share2, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { mockPodcasts } from '../../../core/data/mockData';

export const PodcastDetailPage = () => {
  const { id } = useParams();
  const podcast = mockPodcasts.find(p => p.id === id) || mockPodcasts[0];

  // Mock de episodios para este podcast
  const episodes = [
    { id: 'ep1', title: 'Episodio 1: El comienzo de todo', duration: '45:20', date: '15 Jul 2026', plays: '1.2K' },
    { id: 'ep2', title: 'Episodio 2: Entrevistas exclusivas', duration: '38:15', date: '08 Jul 2026', plays: '980' },
    { id: 'ep3', title: 'Episodio 3: Análisis profundo', duration: '52:10', date: '01 Jul 2026', plays: '1.5K' },
    { id: 'ep4', title: 'Episodio 4: Preguntas de la audiencia', duration: '41:05', date: '24 Jun 2026', plays: '850' },
  ];

  return (
    <div className="space-y-8 py-6">
      {/* Header del Podcast */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <img 
          src={podcast.image} 
          alt={podcast.title} 
          className="w-full md:w-64 h-64 rounded-2xl object-cover shadow-2xl shadow-brand/10"
        />
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-sm text-brand font-semibold uppercase tracking-wider">
            <span>{podcast.category}</span>
            <span>•</span>
            <span>{podcast.episodes} episodios</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">{podcast.title}</h1>
          <p className="text-lg text-text-secondary">Con {podcast.author}</p>
          <p className="text-text-secondary leading-relaxed max-w-2xl">
            Un espacio dedicado a explorar las historias, ideas y personajes que definen nuestra cultura. 
            Nuevos episodios cada semana con invitados especiales y análisis en profundidad.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold shadow-lg shadow-brand/30 transition-all">
              <Play className="w-5 h-5 fill-current" />
              Reproducir último episodio
            </button>
            <button className="p-3 rounded-lg bg-dark-surface border border-dark-border hover:bg-dark-elevated transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-lg bg-dark-surface border border-dark-border hover:bg-dark-elevated transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Episodios */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Episodios recientes</h2>
        <div className="space-y-2">
          {episodes.map((ep, index) => (
            <div 
              key={ep.id} 
              className="group flex items-center gap-4 p-4 rounded-xl bg-dark-surface hover:bg-dark-elevated border border-transparent hover:border-dark-border transition-all cursor-pointer"
            >
              <div className="flex-shrink-0 w-8 text-center text-text-muted font-mono text-sm">
                {index + 1}
              </div>
              
              <button className="flex-shrink-0 w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate group-hover:text-brand transition-colors">{ep.title}</h3>
                <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ep.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ep.duration}</span>
                  <span className="flex items-center gap-1">▶ {ep.plays}</span>
                </div>
              </div>

              <button className="p-2 rounded-full hover:bg-dark-bg text-text-secondary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};