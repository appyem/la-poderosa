import { Play, Calendar, Headphones } from 'lucide-react';
import { mockPrograms } from '../../../core/data/mockData';

export const HeroSection = () => {
  const liveProgram = mockPrograms.find(p => p.isLive) || mockPrograms[0];

  return (
    <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-dark via-dark-surface to-dark-bg border border-dark-border">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0">
        <img
          src={liveProgram.image}
          alt={liveProgram.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 p-6 md:p-12 space-y-6 max-w-2xl">
        {/* Badge EN VIVO */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            En Vivo Ahora
          </span>
          <span className="text-sm text-text-secondary">
            {liveProgram.listeners.toLocaleString()} oyentes
          </span>
        </div>

        {/* Título y descripción */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {liveProgram.title}
          </h1>
          <p className="text-base md:text-lg text-text-secondary max-w-xl">
            Con {liveProgram.host}. La mejor información y música para empezar tu día con toda la energía.
          </p>
        </div>

        {/* Información del programa */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-brand" />
            <span>{liveProgram.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand" />
            <span>{liveProgram.time}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold shadow-lg shadow-brand/30 transition-all hover:scale-105">
            <Play className="w-5 h-5 fill-current" />
            Escuchar Ahora
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-dark-elevated/80 backdrop-blur-sm border border-dark-border hover:bg-dark-surface text-white font-semibold transition-all">
            <Calendar className="w-5 h-5" />
            Programación
          </button>
        </div>
      </div>

      {/* Efecto decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </section>
  );
};