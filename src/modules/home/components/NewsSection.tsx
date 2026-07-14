import { NewsCard } from '../../../shared/components/NewsCard';
import { mockNews } from '../../../core/data/mockData';

export const NewsSection = () => {
  const featuredNews = mockNews.find(n => n.isFeatured) || mockNews[0];
  const otherNews = mockNews.filter(n => n.id !== featuredNews.id);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-4 md:px-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Últimas Noticias</h2>
          <p className="text-sm text-text-secondary mt-1">Mantente informado con nosotros</p>
        </div>
      </div>

      <div className="space-y-4 px-4 md:px-0">
        {/* Noticia destacada */}
        <NewsCard news={featuredNews} variant="featured" />

        {/* Otras noticias */}
        <div className="grid gap-4 md:grid-cols-2">
          {otherNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
    </section>
  );
};