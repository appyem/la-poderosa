import { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockGalleries } from '../../../core/data/mockData';

export const GalleriesPage = () => {
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [filter, setFilter] = useState('Todas');

  const categories = ['Todas', 'Eventos', 'Estudio', 'Música', 'Conciertos'];

  // Mock de fotos para la galería seleccionada
  const mockPhotos = [
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    'https://images.unsplash.com/photo-1429962714451-bb9346dc4fb1?w=800',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
  ];

  const openLightbox = (galleryId: string, index: number) => {
    setSelectedGallery(galleryId);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setSelectedGallery(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    setLightboxIndex((prev) => {
      if (direction === 'prev') return prev === 0 ? mockPhotos.length - 1 : prev - 1;
      return prev === mockPhotos.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Galerías</h1>
        <p className="text-text-secondary">Explora nuestros álbumes de fotos y coberturas.</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === cat
                ? 'bg-brand text-white'
                : 'bg-dark-surface text-text-secondary hover:bg-dark-elevated border border-dark-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Álbumes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGalleries.map((gallery) => (
          <div
            key={gallery.id}
            onClick={() => openLightbox(gallery.id, 0)} // <-- AQUÍ SE AGREGÓ EL onClick
            className="group rounded-2xl overflow-hidden bg-dark-surface border border-dark-border hover:border-brand/50 transition-all cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={gallery.cover}
                alt={gallery.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <ImageIcon className="w-3 h-3" />
                  <span>{gallery.photos} fotos</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">
                  {gallery.title}
                </h3>
                <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                  {gallery.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <img
            src={mockPhotos[lightboxIndex]}
            alt={`Foto ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          />

          <button
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
            {lightboxIndex + 1} / {mockPhotos.length}
          </div>
        </div>
      )}
    </div>
  );
}