import { Calendar, Clock, Share2, MessageCircle, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockNews } from '../../../core/data/mockData';

export const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const news = mockNews.find(n => n.id === id) || mockNews[0];

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a noticias
      </button>

      {/* Imagen Principal */}
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 bg-dark-surface">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido del Artículo */}
      <article className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-bold uppercase">
              {news.category}
            </span>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(news.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {news.readTime} de lectura
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{news.title}</h1>
          
          <p className="text-xl text-text-secondary leading-relaxed font-medium border-l-4 border-brand pl-4">
            {news.summary}
          </p>
        </div>

        <div className="flex items-center justify-between py-4 border-y border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center font-bold text-brand">
              {news.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm">{news.author}</p>
              <p className="text-xs text-text-muted">Periodista</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-surface hover:bg-dark-elevated transition-colors text-sm font-medium">
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
          </div>
        </div>

        {/* Cuerpo del artículo (Mock) */}
        <div className="prose prose-invert prose-lg max-w-none text-text-secondary space-y-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <blockquote className="border-l-4 border-brand pl-4 italic text-white text-xl my-6">
            "Esta es una cita destacada del artículo que resume el punto clave de la noticia de manera impactante."
          </blockquote>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </div>

        {/* Sección de Comentarios (Mock) */}
        <div className="pt-8 border-t border-dark-border space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-brand" />
            Comentarios (3)
          </h3>
          
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-dark-elevated flex-shrink-0" />
            <div className="flex-1">
              <textarea 
                placeholder="Escribe un comentario..." 
                className="w-full p-4 rounded-xl bg-dark-surface border border-dark-border focus:border-brand focus:outline-none transition-colors resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-light text-white text-sm font-semibold transition-colors">
                  Publicar
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-sm font-bold text-brand flex-shrink-0">
                  U{i}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Usuario {i}</span>
                    <span className="text-xs text-text-muted">Hace {i} hora{i > 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Excelente artículo, muy bien detallado y con toda la información necesaria. ¡Sigan así!
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};