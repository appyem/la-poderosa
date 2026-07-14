import { Clock, ArrowRight } from 'lucide-react';
import { mockNews } from '../../core/data/mockData';

type News = typeof mockNews[0];

interface NewsCardProps {
  news: News;
  variant?: 'featured' | 'standard';
}

export const NewsCard = ({ news, variant = 'standard' }: NewsCardProps) => {
  if (variant === 'featured') {
    return (
      <article className="relative rounded-2xl overflow-hidden bg-dark-surface group cursor-pointer">
        <div className="relative aspect-video md:aspect-[21/9]">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Contenido sobre la imagen */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-brand text-white text-xs font-bold uppercase">
                {news.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-white/80">
                <Clock className="w-3 h-3" />
                {news.readTime}
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {news.title}
            </h2>
            <p className="text-sm text-white/90 line-clamp-2 max-w-2xl">
              {news.summary}
            </p>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span>{news.author}</span>
              <span>•</span>
              <span>{new Date(news.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex gap-4 p-4 rounded-xl bg-dark-surface hover:bg-dark-elevated transition-colors group cursor-pointer">
      {/* Imagen */}
      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-brand/20 text-brand text-xs font-semibold">
            {news.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            {news.readTime}
          </div>
        </div>
        <h3 className="font-semibold line-clamp-2 group-hover:text-brand transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-text-secondary line-clamp-2">
          {news.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-text-muted pt-1">
          <span>{news.author}</span>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </article>
  );
};