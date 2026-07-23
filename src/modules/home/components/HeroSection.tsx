import { useState, useEffect } from 'react';
import { Play, Calendar, Headphones } from 'lucide-react';
import { getProgramasRadio, getDJs, type ProgramaRadio, type DJ } from '../../../core/firebase/services';

// Tipo local estricto para los datos que mostraremos en el Hero
interface LiveProgramData {
  id: string;
  nombre: string;
  host: string;
  time: string;
  categoria: string;
  imagen: string;
}

export const HeroSection = () => {
  const [liveProgram, setLiveProgram] = useState<LiveProgramData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [listeners, setListeners] = useState<number>(0);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchData = async () => {
      try {
        const [programs, djs] = await Promise.all([
          getProgramasRadio(),
          getDJs()
        ]);

        const ahora = new Date();
        const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;

        // 1. Buscar si hay un programa en vivo ahora mismo
        const programaEnVivo = programs.find((prog: ProgramaRadio) => 
          prog.horaInicio <= horaActual && horaActual <= prog.horaFin
        );

        if (programaEnVivo) {
          const dj = djs.find((d: DJ) => d.id === programaEnVivo.djId);
          
          const datosPrograma: LiveProgramData = {
            id: programaEnVivo.id,
            nombre: programaEnVivo.nombre,
            host: dj ? dj.nombre : 'Por definir',
            time: `${programaEnVivo.horaInicio} - ${programaEnVivo.horaFin}`,
            categoria: programaEnVivo.descripcion || 'Programa',
            imagen: dj?.fotoUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920'
          };

          setLiveProgram(datosPrograma);
          
          // Simular oyentes en tiempo real
          const initialListeners = Math.floor(Math.random() * 1500) + 1000;
          setListeners(initialListeners);

          intervalId = setInterval(() => {
            setListeners((prev: number) => prev + Math.floor(Math.random() * 5));
          }, 5000);

        } else {
          // 2. Si no hay nada en vivo, mostrar el próximo programa
          const proximoPrograma = programs.find((prog: ProgramaRadio) => prog.horaInicio > horaActual);
          
          if (proximoPrograma) {
            const dj = djs.find((d: DJ) => d.id === proximoPrograma.djId);
            setLiveProgram({
              id: proximoPrograma.id,
              nombre: `Próximamente: ${proximoPrograma.nombre}`,
              host: dj ? dj.nombre : 'Por definir',
              time: `${proximoPrograma.horaInicio} - ${proximoPrograma.horaFin}`,
              categoria: proximoPrograma.descripcion || 'Programa',
              imagen: dj?.fotoUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920'
            });
          } else {
            setLiveProgram(null);
          }
        }
      } catch (error) {
        console.error('Error al cargar el programa en vivo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Limpieza del intervalo al desmontar el componente
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const handleEscucharAhora = () => {
    window.dispatchEvent(new CustomEvent('radio-control', { 
      detail: { action: 'play' } 
    }));
  };

  // Estado de carga
  if (loading) {
    return (
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-dark via-dark-surface to-dark-bg border border-dark-border min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
      </section>
    );
  }

  // Estado sin programas
  if (!liveProgram) {
    return (
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-dark via-dark-surface to-dark-bg border border-dark-border min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920"
            alt="Programación"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-12 space-y-6 max-w-2xl">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
              Programación Próxima
            </h1>
            <p className="text-base md:text-lg text-text-secondary max-w-xl">
              Mantente atento a nuestra programación. ¡Próximamente en vivo!
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={handleEscucharAhora}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold shadow-lg shadow-brand/30 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              Escuchar Ahora
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Estado normal con programa (en vivo o próximo)
  return (
    <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-dark via-dark-surface to-dark-bg border border-dark-border min-h-[400px]">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0">
        <img
          src={liveProgram.imagen}
          alt={liveProgram.nombre}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 p-6 md:p-12 space-y-6 max-w-2xl">
        {/* Badge EN VIVO (solo si no dice "Próximamente") */}
        {!liveProgram.nombre.startsWith('Próximamente') && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              En Vivo Ahora
            </span>
            <span className="text-sm text-text-secondary">
              {listeners.toLocaleString()} oyentes
            </span>
          </div>
        )}

        {/* Título y descripción */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
            {liveProgram.nombre}
          </h1>
          <p className="text-base md:text-lg text-text-secondary max-w-xl">
            Con {liveProgram.host}. La mejor información y música para empezar tu día con toda la energía.
          </p>
        </div>

        {/* Información del programa */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-brand" />
            <span>{liveProgram.categoria}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand" />
            <span>{liveProgram.time}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button 
            onClick={handleEscucharAhora}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold shadow-lg shadow-brand/30 transition-all hover:scale-105"
          >
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