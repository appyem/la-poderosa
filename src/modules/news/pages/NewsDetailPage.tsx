import { useState, useEffect } from 'react';
import { Calendar, Clock, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoticiasDelDia, type Noticia } from '../../../core/firebase/services';

interface AdaptedNews {
  id: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

const adaptNoticia = (n: Noticia): AdaptedNews => ({
  id: n.id,
  title: n.titulo,
  summary: n.resumen,
  author: n.autor,
  date: n.fecha.toDate().toISOString().split('T')[0],
  category: n.categoria,
  image: n.imagenUrl,
  readTime: '3 min'
});

export const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<AdaptedNews | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticiasDelDia().then(data => {
      const found = data.find(n => n.id === id);
      if (found) setNews(adaptNoticia(found));
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  if (!news) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Noticia no encontrada</h2>
        <p className="text-text-secondary mb-4">Es posible que la noticia haya expirado (regla de 24 horas).</p>
        <button onClick={() => navigate('/noticias')} className="text-brand hover:underline">Volver a noticias</button>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a noticias
      </button>

      <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 bg-dark-surface">
        <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
      </div>

      <article className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-bold uppercase">{news.category}</span>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(news.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {news.readTime} de lectura</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">{news.title}</h1>
          <p className="text-xl text-text-secondary leading-relaxed font-medium border-l-4 border-brand pl-4">{news.summary}</p>
        </div>

        <div className="flex items-center justify-between py-4 border-y border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center font-bold text-brand">
              {news.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm text-white">{news.author}</p>
              <p className="text-xs text-text-muted">Periodista</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-surface hover:bg-dark-elevated transition-colors text-sm font-medium text-white">
            <Share2 className="w-4 h-4" /> Compartir
          </button>
        </div>

        {/* Cuerpo del artículo (Placeholder hasta que se agregue campo 'contenido' a la BD) */}
        <div className="prose prose-invert prose-lg max-w-none text-text-secondary space-y-4">
          <p>{news.summary}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        </div>
      </article>
    </div>
  );
};