import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Heart, Share2, 
  SkipForward, SkipBack, Users, Mic2, Clock,
  Headphones, MessageCircle
} from 'lucide-react';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { mockPrograms } from '../../../core/data/mockData';

// ✅ URL CORRECTA DE ESCUCHA PÚBLICA DE RADIO.CO
const STREAM_URL = "https://streams.radio.co/sf25c76934/listen"; 

export const RadioPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Referencia al elemento de audio real
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentProgram = mockPrograms.find(p => p.isLive) || mockPrograms[0];
  const nextProgram = mockPrograms[1];

  // Efecto para controlar la reproducción real
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Error al reproducir:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Efecto para controlar el volumen real
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Elemento de Audio Oculto (El que se conecta a Radio.co) */}
      <audio 
        ref={audioRef} 
        src={STREAM_URL} 
        preload="none" 
        crossOrigin="anonymous"
      />

      {/* Reproductor Principal */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-dark via-dark-surface to-dark-bg border border-dark-border">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0">
          <img
            src={currentProgram.image}
            alt={currentProgram.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/50 to-dark-bg" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 p-6 md:p-8 space-y-6">
          {/* Badge EN VIVO */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                En Vivo
              </span>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Users className="w-4 h-4" />
                <span>{currentProgram.listeners.toLocaleString()} oyentes</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-brand text-white' : 'bg-dark-elevated text-text-secondary hover:bg-dark-surface'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-dark-elevated text-text-secondary hover:bg-dark-surface transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Información del Programa */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">{currentProgram.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-text-secondary">
              <div className="flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-brand" />
                <span>{currentProgram.host}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" />
                <span>{currentProgram.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-brand" />
                <span>{currentProgram.category}</span>
              </div>
            </div>
          </div>

          {/* Visualizador de Audio */}
          <AudioVisualizer isPlaying={isPlaying} barCount={30} />

          {/* Controles de Reproducción */}
          <div className="flex items-center justify-center gap-6">
            <button className="p-3 rounded-full bg-dark-elevated hover:bg-dark-surface transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="p-5 rounded-full bg-brand hover:bg-brand-light shadow-lg shadow-brand/30 transition-all hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </button>
            
            <button className="p-3 rounded-full bg-dark-elevated hover:bg-dark-surface transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Control de Volumen */}
          <div className="flex items-center gap-4 max-w-md mx-auto">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full hover:bg-dark-elevated transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-text-secondary" />
              ) : (
                <Volume2 className="w-5 h-5 text-text-secondary" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setIsMuted(false);
              }}
              className="flex-1 h-2 bg-dark-elevated rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand"
            />
            <span className="text-sm text-text-secondary w-10 text-right">{isMuted ? 0 : volume}%</span>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Próximo Programa */}
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Próximo Programa
          </h3>
          <div className="flex items-center gap-4">
            <img
              src={nextProgram.image}
              alt={nextProgram.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold">{nextProgram.title}</h4>
              <p className="text-sm text-text-secondary">{nextProgram.host}</p>
              <p className="text-xs text-text-muted">{nextProgram.time}</p>
            </div>
          </div>
        </div>

        {/* Chat en Vivo */}
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Chat en Vivo
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand">
                M
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">María</span>{' '}
                  <span className="text-text-secondary">¡Excelente programa hoy!</span>
                </p>
                <p className="text-xs text-text-muted mt-1">Hace 2 min</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand">
                J
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">Juan</span>{' '}
                  <span className="text-text-secondary">Saludos desde Palestina 🇨🇴</span>
                </p>
                <p className="text-xs text-text-muted mt-1">Hace 5 min</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2 rounded-lg bg-dark-elevated hover:bg-dark-surface transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <MessageCircle className="w-4 h-4" />
            Unirse al chat
          </button>
        </div>
      </div>

      {/* Programación de Hoy */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Programación de Hoy</h2>
        <div className="space-y-2">
          {mockPrograms.map((program) => (
            <div
              key={program.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                program.isLive
                  ? 'bg-brand/10 border border-brand/30'
                  : 'bg-dark-surface hover:bg-dark-elevated'
              }`}
            >
              <div className="flex-shrink-0 w-16 text-center">
                <p className="text-sm font-semibold">{program.time.split(' - ')[0]}</p>
                <p className="text-xs text-text-muted">{program.time.split(' - ')[1]}</p>
              </div>
              <img
                src={program.image}
                alt={program.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{program.title}</h3>
                <p className="text-sm text-text-secondary truncate">{program.host}</p>
              </div>
              {program.isLive && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  EN VIVO
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};