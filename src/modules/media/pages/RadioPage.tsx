import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Heart, Share2, 
  SkipForward, SkipBack, Users, Mic2, Clock,
  Headphones, MessageCircle, Send, AlertCircle
} from 'lucide-react';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { 
  getProgramasRadio, 
  getDJs, 
  addChatMessage, 
  getChatMessages,
  type ProgramaRadio, 
  type DJ,
  type ChatMessage 
} from '../../../core/firebase/services';
import { Timestamp } from 'firebase/firestore';

const STREAM_URL = "https://streams.radio.co/sf25c76934/listen"; 
const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const RadioPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [listeners, setListeners] = useState<number>(() => Math.floor(Math.random() * 2000) + 500);
  const [programas, setProgramas] = useState<ProgramaRadio[]>([]);
  const [djs, setDjs] = useState<DJ[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showChatInput, setShowChatInput] = useState(false);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  

  const ahora = new Date();
  const hoy = DIAS_SEMANA[ahora.getDay()];
  const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;

  const programaEnVivo = programas.find(prog => 
    prog.dias.includes(hoy) && prog.horaInicio <= horaActual && horaActual <= prog.horaFin
  );

  const proximoPrograma = programas.find(prog => 
    prog.dias.includes(hoy) && prog.horaInicio > horaActual
  );

  const programasDeHoy = programas
    .filter(prog => prog.dias.includes(hoy))
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  useEffect(() => {
    const loadData = async () => {
      try {
        const [programsData, djsData, chatData] = await Promise.all([
          getProgramasRadio(),
          getDJs(),
          getChatMessages(50)
        ]);
        setProgramas(programsData);
        setDjs(djsData);
        setChatMessages(chatData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Actualizar chat cada 5 segundos en segundo plano (sin forzar scroll)
    const interval = setInterval(async () => {
      try {
        const messages = await getChatMessages(50);
        setChatMessages(messages);
      } catch (error) {
        console.error('Error al actualizar chat:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Scroll automático de oyentes (sin errores de pureza)
  useEffect(() => {
    const listenersInterval = setInterval(() => {
      setListeners(prev => {
        const change = Math.floor(Math.random() * 15) - 5;
        return Math.max(100, prev + change);
      });
    }, 8000);

    return () => clearInterval(listenersInterval);
  }, []);

    // ✅ Scroll al final del chat SOLO al cargar la página por primera vez (si hay mensajes)
  
  useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    }, [chatMessages.length]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Error al reproducir:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

    const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Si el usuario no escribió nombre, usamos "Anónimo" por defecto
    const finalUserName = userName.trim() || 'Anónimo';
    if (!userName.trim()) {
      setUserName(finalUserName);
    }
    
    // ✅ Marcamos como confirmado para que el input de nombre desaparezca después de enviar
    setNameConfirmed(true);

    try {
      await addChatMessage(finalUserName, newMessage.trim());
      setNewMessage('');
      
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const getDJNombre = (djId: string) => {
    const dj = djs.find(d => d.id === djId);
    return dj ? dj.nombre : 'Por definir';
  };

  const formatTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
      </div>
    );
  }

  const currentProgram = programaEnVivo;
  const nextProgram = proximoPrograma;

  return (
    <div className="space-y-6 py-6">
      <audio ref={audioRef} src={STREAM_URL} preload="none" crossOrigin="anonymous" />

      {/* Reproductor Principal */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-dark via-dark-surface to-dark-bg border border-dark-border">
        <div className="absolute inset-0">
          <img
            src={currentProgram?.djId ? djs.find(d => d.id === currentProgram.djId)?.fotoUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920' : 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920'}
            alt={currentProgram?.nombre || 'Radio'}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/50 to-dark-bg" />
        </div>

        <div className="relative z-10 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                En Vivo
              </span>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Users className="w-4 h-4" />
                <span>{listeners.toLocaleString()} oyentes</span>
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

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {currentProgram ? currentProgram.nombre : 'LA PODEROSA - En Vivo'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-text-secondary">
              <div className="flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-brand" />
                <span>{currentProgram ? getDJNombre(currentProgram.djId) : 'Streaming 24/7'}</span>
              </div>
              {currentProgram ? (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand" />
                    <span>{currentProgram.horaInicio} - {currentProgram.horaFin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-brand" />
                    <span>{currentProgram.descripcion || 'Programa'}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">No hay programa específico programado para esta hora</span>
                </div>
              )}
            </div>
          </div>

          <AudioVisualizer isPlaying={isPlaying} barCount={30} />

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
          {nextProgram ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-brand/20 flex items-center justify-center">
                <Mic2 className="w-8 h-8 text-brand" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-white">{nextProgram.nombre}</h4>
                <p className="text-sm text-text-secondary">{getDJNombre(nextProgram.djId)}</p>
                <p className="text-xs text-text-muted">{nextProgram.horaInicio} - {nextProgram.horaFin}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-text-secondary">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">No hay más programas programados para hoy</p>
                <p className="text-xs mt-1">Vaya al Panel Admin &gt; Programación para agregar programas</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat en Vivo */}
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Chat en Vivo
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
            {chatMessages.length === 0 ? (
              <p className="text-text-secondary text-sm text-center py-4">No hay mensajes aún. ¡Sé el primero!</p>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand">
                    {msg.usuario.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold text-white">{msg.usuario}</span>{' '}
                      <span className="text-text-secondary">{msg.mensaje}</span>
                    </p>
                    <p className="text-xs text-text-muted mt-1">{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          
                    {!showChatInput ? (
            <button 
              onClick={() => {
                setShowChatInput(true);
                if (!userName) setNameConfirmed(false);
              }}
              className="w-full py-2 rounded-lg bg-dark-elevated hover:bg-dark-surface transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Unirse al chat
            </button>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-2">
              {!nameConfirmed && (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-white text-sm placeholder:text-text-muted focus:border-brand focus:outline-none"
                />
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-white text-sm placeholder:text-text-muted focus:border-brand focus:outline-none"
                />
                <button 
                  type="submit"
                  className="p-2 rounded-lg bg-brand hover:bg-brand-light text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Programación de Hoy */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Programación de Hoy ({hoy})</h2>
        {programas.length === 0 ? (
          <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-500 mb-2">No hay programas en la base de datos</h3>
                <p className="text-sm text-text-secondary mb-3">
                  Para ver la programación, debe crear programas en el panel de administración.
                </p>
                <a 
                  href="/dashboard/programacion" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-light transition-colors"
                >
                  Ir a Gestión de Programación
                </a>
              </div>
            </div>
          </div>
        ) : programasDeHoy.length === 0 ? (
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border text-center">
            <p className="text-text-secondary">No hay programas programados para {hoy}</p>
            <p className="text-xs text-text-muted mt-2">
              Total de programas en el sistema: {programas.length}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {programasDeHoy.map((program) => {
              const isLive = program.horaInicio <= horaActual && horaActual <= program.horaFin;
              return (
                <div
                  key={program.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    isLive
                      ? 'bg-brand/10 border border-brand/30'
                      : 'bg-dark-surface hover:bg-dark-elevated'
                  }`}
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <p className="text-sm font-semibold text-white">{program.horaInicio}</p>
                    <p className="text-xs text-text-muted">{program.horaFin}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-brand/20 flex items-center justify-center">
                    <Mic2 className="w-6 h-6 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{program.nombre}</h3>
                    <p className="text-sm text-text-secondary truncate">{getDJNombre(program.djId)}</p>
                  </div>
                  {isLive && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      EN VIVO
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};