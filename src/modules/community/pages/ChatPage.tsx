import { useState, useEffect, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Send, Smile, Paperclip, MoreVertical, Loader2 } from 'lucide-react';
import { getChatMessages, addChatMessage, type ChatMessage } from '../../../core/firebase/services';

export const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ SOLUCIÓN REAL AL ERROR DE HOOKS: 
  // La lógica asíncrona y los setState están DENTRO de una función callback, 
  // lo cual cumple exactamente con la regla oficial de React: 
  // "calling setState in a callback function when external state changes".
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

    fetchMessages(); // Carga inicial
    const interval = setInterval(fetchMessages, 5000); // Actualización cada 5s

    return () => {
      isMounted = false; // Previene actualizaciones de estado si el componente se desmonta
      clearInterval(interval);
    };
  }, []);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
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
      // Forzamos una recarga inmediata tras enviar
      const data = await getChatMessages(50);
      setMessages(data);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  // Pantalla de ingreso de nombre
  if (!userName) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center py-6">
        <div className="max-w-md w-full p-6 bg-dark-surface border border-dark-border rounded-xl space-y-4">
          <h2 className="text-xl font-bold text-white text-center">Bienvenido al Chat en Vivo</h2>
          <p className="text-text-secondary text-center text-sm">Ingresa tu nombre para participar</p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Tu nombre..."
            className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && userName.trim()) {
                // El useEffect se encargará de cargar los mensajes al renderizarse de nuevo
              }
            }}
          />
          <button
            onClick={() => {
              if (userName.trim()) {
                // Al cambiar el estado, el componente se renderiza y dispara el useEffect
              }
            }}
            disabled={!userName.trim()}
            className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors disabled:opacity-50"
          >
            Entrar al Chat
          </button>
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

  // ✅ SIN 'any': Usamos el tipo Timestamp oficial de Firebase Firestore
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

      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-dark-surface rounded-t-xl border border-dark-border border-b-0">
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