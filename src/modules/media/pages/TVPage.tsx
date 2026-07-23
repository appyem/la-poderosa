import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { 
  MessageCircle, Heart, Share2, Users, Radio, 
  Send, Loader2, AlertCircle 
} from 'lucide-react';
import { 
  getTvConfig, 
  extraerVideoIdDeYoutube,
  getChatMessages, 
  addChatMessage, 
  type ChatMessage 
} from '../../../core/firebase/services';
import { Timestamp } from 'firebase/firestore';

export const TVPage = () => {
  const [videoId, setVideoId] = useState('');
  const [loadingTv, setLoadingTv] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getTvConfig().then(url => {
      setVideoId(extraerVideoIdDeYoutube(url));
      setLoadingTv(false);
    });

    const loadChat = async () => {
      const messages = await getChatMessages(50);
      setChatMessages(messages);
    };
    loadChat();

    const chatInterval = setInterval(loadChat, 5000);
    return () => clearInterval(chatInterval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const finalUserName = userName.trim() || 'Espectador';
    if (!userName.trim()) {
      setUserName(finalUserName);
    }
    setNameConfirmed(true);

    try {
      await addChatMessage(finalUserName, newMessage.trim());
      setNewMessage('');
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const formatTime = (timestamp: Timestamp) => {
    const diff = currentTime - timestamp.toDate().getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes < 1 ? 'Ahora' : `Hace ${minutes} min`;
  };

  return (
    <div className="space-y-6 py-6">
      {/* Reproductor de Video (YouTube Embed) */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-dark-border">
        <div className="relative w-full aspect-video bg-black">
          {loadingTv ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-brand animate-spin" />
            </div>
          ) : videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`}
              title="Transmisión en Vivo YouTube"
              className="w-full h-full absolute inset-0"
              style={{ border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary">
              <AlertCircle className="w-16 h-16 mb-4 text-text-muted" />
              <p className="text-xl font-semibold">No hay transmisión en vivo en este momento</p>
              <p className="text-sm mt-2">Vuelve más tarde para ver nuestra programación.</p>
            </div>
          )}

          {/* Overlay de controles */}
          {videoId && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-4 left-4 flex items-center gap-3 pointer-events-auto">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  EN VIVO
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información y Chat */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Información del Programa */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Transmisión en Vivo</h1>
                <p className="text-text-secondary">LA PODEROSA Televisión</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-dark-elevated hover:bg-dark-surface transition-colors text-white">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-dark-elevated hover:bg-dark-surface transition-colors text-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-brand" />
                <span>Señal en vivo</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand" />
                <span>Espectadores conectados</span>
              </div>
            </div>

            <p className="text-text-secondary">
              Disfruta de nuestra programación en vivo con la mejor calidad de video y sonido. 
              Interactúa con nosotros a través del chat en tiempo real.
            </p>
          </div>
        </div>

        {/* Chat en Vivo REAL */}
        <div className="space-y-4">
          <div className="rounded-xl bg-dark-surface border border-dark-border overflow-hidden">
            <div className="p-4 border-b border-dark-border flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand" />
                Chat en Vivo
              </h3>
              <button 
                onClick={() => setShowChat(!showChat)}
                className="text-sm text-text-secondary hover:text-white transition-colors"
              >
                {showChat ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showChat && (
              <>
                <div className="h-96 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 ? (
                    <p className="text-text-secondary text-sm text-center py-4">Sé el primero en saludar.</p>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand flex-shrink-0">
                          {msg.usuario.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
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

                <div className="p-4 border-t border-dark-border">
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
                      <button type="submit" className="p-2 rounded-lg bg-brand hover:bg-brand-light text-white transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};