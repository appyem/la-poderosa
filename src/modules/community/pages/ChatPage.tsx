import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Send, Smile, Paperclip, MoreVertical, Loader2 } from 'lucide-react';
import { getChatMessages, addChatMessage, type ChatMessage } from '../../../core/firebase/services';

export const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userName, setUserName] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false); // ✅ NUEVO: Controla cuándo entrar al chat
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null); // ✅ NUEVO: Para controlar el scroll

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const data = await getChatMessages(50);
        if (isMounted) {
          setMessages(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ✅ CORRECCIÓN DEFINITIVA DEL SCROLL (igual que en TVPage)
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Solo baja al fondo si el usuario YA estaba cerca del fondo (umbral de 100px)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userName.trim()) {
      if (!userName.trim()) {
        alert('Por favor, ingresa tu nombre primero');
      }
      return;
    }

    setSending(true);
    try {
      await addChatMessage(userName, message.trim());
      setMessage('');
      const data = await getChatMessages(50);
      setMessages(data);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  // ✅ Pantalla de ingreso de nombre CORREGIDA
  if (!nameConfirmed) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center py-6">
        <div className="max-w-md w-full p-6 bg-dark-surface border border-dark-border rounded-xl space-y-4">
          <h2 className="text-xl font-bold text-white text-center">Bienvenido al Chat en Vivo</h2>
          <p className="text-text-secondary text-center text-sm">Ingresa tu nombre para participar</p>
          
          {/* ✅ Envuelto en un form para que el botón Enter funcione correctamente */}
          <form onSubmit={(e) => {
            e.preventDefault();
            if (userName.trim()) {
              setNameConfirmed(true);
            }
          }}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Tu nombre completo..."
              className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none mb-4"
              autoFocus
            />
            <button
              type="submit"
              disabled={!userName.trim()}
              className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors disabled:opacity-50"
            >
              Entrar al Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const formatTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-dark-border mb-4">
        <div>
          <h1 className="text-xl font-bold">Chat en Vivo</h1>
          <p className="text-xs text-text-secondary">Conectado como: {userName}</p>
        </div>
        <button className="p-2 rounded-lg hover:bg-dark-elevated">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* ✅ Se agregó ref={chatContainerRef} para medir el scroll */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 bg-dark-surface rounded-t-xl border border-dark-border border-b-0"
      >
        {messages.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.usuario === 'Admin' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.usuario === 'Admin' ? 'bg-brand text-white' : 'bg-dark-elevated text-text-secondary'
              }`}>
                {msg.usuario.charAt(0).toUpperCase()}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.usuario === 'Admin' 
                  ? 'bg-brand text-white rounded-tr-none' 
                  : 'bg-dark-elevated text-text-primary rounded-tl-none'
              }`}>
                <p className="font-semibold text-xs mb-1 opacity-80">{msg.usuario}</p>
                <p>{msg.mensaje}</p>
                <p className="text-[10px] text-right mt-1 opacity-60">{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-dark-surface border border-dark-border rounded-b-xl flex items-center gap-2">
        <button type="button" className="p-2 rounded-full hover:bg-dark-elevated text-text-secondary">
          <Smile className="w-5 h-5" />
        </button>
        <button type="button" className="p-2 rounded-full hover:bg-dark-elevated text-text-secondary">
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-dark-bg border border-dark-border rounded-full px-4 py-2.5 focus:border-brand focus:outline-none text-sm"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="p-2.5 rounded-full bg-brand hover:bg-brand-light text-white transition-colors disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};