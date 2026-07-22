import { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: '¡Hola! Soy el asistente de LA PODEROSA. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre la programación, noticias o eventos.' }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'Entendido. Estoy procesando tu solicitud. (Respuesta simulada de IA)' }]);
    }, 1000);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-36 right-4 md:bottom-8 md:right-8 w-80 md:w-96 bg-dark-surface border border-dark-border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 animate-slide-up">
          <div className="p-4 bg-brand text-white flex items-center justify-between">
            <div className="flex items-center gap-2"><Sparkles className="w-5 h-5" /><span className="font-bold">Asistente IA</span></div>
            <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 h-80 overflow-y-auto p-4 space-y-3 bg-dark-bg">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand text-white rounded-br-none' : 'bg-dark-elevated text-text-secondary rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-dark-border flex gap-2 bg-dark-surface">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Escribe tu pregunta..." className="flex-1 bg-dark-bg border border-dark-border rounded-full px-3 py-2 text-sm focus:border-brand focus:outline-none" />
            <button onClick={handleSend} className="p-2 rounded-full bg-brand text-white hover:bg-brand-light transition-colors"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-36 right-4 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-brand hover:bg-brand-light text-white shadow-lg shadow-brand/40 flex items-center justify-center z-50 transition-transform hover:scale-110">
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
      </button>
    </>
  );
};