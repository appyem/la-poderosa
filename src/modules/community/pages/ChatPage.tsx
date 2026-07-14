import { useState } from 'react';
import { Send, Smile, Paperclip, MoreVertical } from 'lucide-react';

export const ChatPage = () => {
  const [message, setMessage] = useState('');
  const messages = [
    { id: 1, user: 'Admin', text: '¡Bienvenidos al chat en vivo de LA PODEROSA!', time: '10:00', isAdmin: true },
    { id: 2, user: 'Carlos', text: '¡Hola! Excelente programa hoy.', time: '10:02', isAdmin: false },
    { id: 3, user: 'María', text: '¿Pueden poner la canción que sonó hace rato?', time: '10:05', isAdmin: false },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-dark-border mb-4">
        <div><h1 className="text-xl font-bold">Chat en Vivo</h1><p className="text-xs text-text-secondary">1,240 usuarios conectados</p></div>
        <button className="p-2 rounded-lg hover:bg-dark-elevated"><MoreVertical className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-dark-surface rounded-t-xl border border-dark-border border-b-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isAdmin ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.isAdmin ? 'bg-brand text-white' : 'bg-dark-elevated text-text-secondary'}`}>
              {msg.user.charAt(0)}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isAdmin ? 'bg-brand text-white rounded-tr-none' : 'bg-dark-elevated text-text-primary rounded-tl-none'}`}>
              <p className="font-semibold text-xs mb-1 opacity-80">{msg.user}</p>
              <p>{msg.text}</p>
              <p className="text-[10px] text-right mt-1 opacity-60">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-dark-surface border border-dark-border rounded-b-xl flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-dark-elevated text-text-secondary"><Smile className="w-5 h-5" /></button>
        <button className="p-2 rounded-full hover:bg-dark-elevated text-text-secondary"><Paperclip className="w-5 h-5" /></button>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 bg-dark-bg border border-dark-border rounded-full px-4 py-2.5 focus:border-brand focus:outline-none text-sm" />
        <button className="p-2.5 rounded-full bg-brand hover:bg-brand-light text-white transition-colors"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
};
