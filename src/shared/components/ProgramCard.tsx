import { Play, Users } from 'lucide-react';
import { mockPrograms } from '../../core/data/mockData';

type Program = typeof mockPrograms[0];

interface ProgramCardProps {
  program: Program;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgramCard = ({ program, size = 'md' }: ProgramCardProps) => {
  const sizeClasses = {
    sm: 'w-40',
    md: 'w-56',
    lg: 'w-72',
  };

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 snap-start group cursor-pointer`}>
      {/* Imagen */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-dark-surface">
        <img
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badge EN VIVO */}
        {program.isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-600 text-white text-xs font-bold">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            EN VIVO
          </div>
        )}

        {/* Overlay con botón play (hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="w-14 h-14 rounded-full bg-brand hover:bg-brand-light flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-white fill-current ml-1" />
          </button>
        </div>

        {/* Contador de oyentes (si está en vivo) */}
        {program.isLive && program.listeners > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs">
            <Users className="w-3 h-3" />
            {program.listeners.toLocaleString()}
          </div>
        )}
      </div>

      {/* Información */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-brand transition-colors">
          {program.title}
        </h3>
        <p className="text-xs text-text-secondary line-clamp-1">{program.host}</p>
        <p className="text-xs text-text-muted">{program.time}</p>
      </div>
    </div>
  );
};