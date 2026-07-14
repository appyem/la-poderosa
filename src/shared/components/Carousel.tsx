import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Carousel = ({ children, title, subtitle, action }: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header del carrusel */}
      {(title || action) && (
        <div className="flex items-center justify-between px-4 md:px-0">
          <div>
            {title && <h2 className="text-xl md:text-2xl font-bold">{title}</h2>}
            {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Contenedor del carrusel */}
      <div className="relative group">
        {/* Botón izquierdo (solo desktop) */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-elevated/90 backdrop-blur-sm border border-dark-border items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-surface"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Contenido scrolleable */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-0 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>

        {/* Botón derecho (solo desktop) */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-elevated/90 backdrop-blur-sm border border-dark-border items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-surface"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};