import { useState } from 'react';
import { 
  Camera, MessageCircle, Heart, 
  Share2, Users, Radio
} from 'lucide-react';

// ✅ URL del Plugin de Página de Facebook (100% Automático)
// Cuando transmitas en vivo con Yolobox a Facebook, el video aparecerá automáticamente arriba.
const FACEBOOK_PAGE_URL = "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Flapoderosadelcafe&tabs=timeline&width=800&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId";

export const TVPage = () => {
  const [selectedCamera, setSelectedCamera] = useState(1);
  const [showChat, setShowChat] = useState(true);

  const cameras = [
    { id: 1, name: 'Principal', icon: '📹' },
    { id: 2, name: 'Estudio', icon: '🎬' },
    { id: 3, name: 'Exterior', icon: '🌆' },
    { id: 4, name: 'Backstage', icon: '🎭' },
  ];

  const reactions = [
    { emoji: '❤️', count: 234 },
    { emoji: '👍', count: 189 },
    { emoji: '🔥', count: 156 },
    { emoji: '😂', count: 98 },
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Reproductor de Video (Facebook Embed) */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-dark-border">
        
        {/* Contenedor del Iframe con altura ajustada para Facebook */}
        <div className="relative w-full h-[500px] md:h-[600px] bg-black">
          <iframe
            src={FACEBOOK_PAGE_URL}
            title="Transmisión en Vivo Facebook"
            className="w-full h-full absolute inset-0"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
          
          {/* Overlay de controles (Flotando sobre el video de Facebook) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            {/* Badge EN VIVO */}
            <div className="absolute top-4 left-4 flex items-center gap-3 pointer-events-auto">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                EN VIVO
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs">
                <Users className="w-3 h-3" />
                <span>Viendo en Facebook</span>
              </div>
            </div>

            {/* Selector de Cámaras (Decorativo / Branding) */}
            <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto">
              {cameras.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => setSelectedCamera(cam.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCamera === cam.id
                      ? 'bg-brand text-white'
                      : 'bg-black/60 backdrop-blur-sm text-white hover:bg-black/80'
                  }`}
                >
                  {cam.icon} {cam.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reacciones Flotantes */}
          <div className="absolute bottom-20 right-4 flex flex-col gap-2 pointer-events-auto">
            {reactions.map((reaction, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span>{reaction.emoji}</span>
                <span className="text-xs">{reaction.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Información y Chat */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Información del Programa */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Noticiero Central</h1>
                <p className="text-text-secondary">Con Ana Martínez y Carlos Rodríguez</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-dark-elevated hover:bg-dark-surface transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-dark-elevated hover:bg-dark-surface transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-brand" />
                <span>Transmisión en vivo</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-brand" />
                <span>{cameras.length} cámaras disponibles</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand" />
                <span>Espectadores en Facebook</span>
              </div>
            </div>

            <p className="text-text-secondary">
              Las noticias más importantes del día con análisis en profundidad, entrevistas exclusivas 
              y reportajes especiales desde diferentes puntos del país.
            </p>

            {/* Botones de Reacción */}
            <div className="flex flex-wrap gap-2 pt-2">
              {reactions.map((reaction, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-elevated hover:bg-dark-surface transition-colors"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-sm font-medium">{reaction.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat en Vivo */}
        <div className="space-y-4">
          <div className="rounded-xl bg-dark-surface border border-dark-border overflow-hidden">
            <div className="p-4 border-b border-dark-border flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
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
                  {[
                    { user: 'Laura', message: '¡Excelente cobertura!', time: '2 min' },
                    { user: 'Pedro', message: 'Saludos desde Medellín 🇨🇴', time: '3 min' },
                    { user: 'Sofia', message: '¿Pueden repetir la noticia anterior?', time: '5 min' },
                    { user: 'Andrés', message: 'Muy buena calidad de video 👍', time: '7 min' },
                    { user: 'María', message: '¿A qué hora termina el noticiero?', time: '10 min' },
                  ].map((msg, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand flex-shrink-0">
                        {msg.user.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{msg.user}</span>{' '}
                          <span className="text-text-secondary">{msg.message}</span>
                        </p>
                        <p className="text-xs text-text-muted mt-1">Hace {msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-dark-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-2 rounded-lg bg-dark-elevated border border-dark-border focus:border-brand focus:outline-none transition-colors"
                    />
                    <button className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-light text-white font-medium transition-colors">
                      Enviar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};