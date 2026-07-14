import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const ContactPage = () => {
  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Contáctanos</h1>
        <p className="text-text-secondary">Estamos aquí para escucharte. Escríbenos o visítanos.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
            <h3 className="text-xl font-bold">Información de Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-brand/10 text-brand"><MapPin className="w-5 h-5" /></div>
                <div><p className="font-semibold">Dirección</p><p className="text-sm text-text-secondary">Av. Principal #123, Centro de Medios, Ciudad</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-brand/10 text-brand"><Phone className="w-5 h-5" /></div>
                <div><p className="font-semibold">Teléfono</p><p className="text-sm text-text-secondary">+57 (1) 234 5678</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-brand/10 text-brand"><Mail className="w-5 h-5" /></div>
                <div><p className="font-semibold">Correo</p><p className="text-sm text-text-secondary">contacto@lapoderosa.com</p></div>
              </div>
            </div>
          </div>
          <div className="aspect-video rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center">
            <span className="text-text-secondary flex items-center gap-2"><MapPin className="w-5 h-5" /> Mapa de Ubicación (Google Maps)</span>
          </div>
        </div>
        <form className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4" onSubmit={(e) => e.preventDefault()}>
          <h3 className="text-xl font-bold">Envíanos un mensaje</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Tu nombre" className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border focus:border-brand focus:outline-none" />
            <input type="email" placeholder="tu@email.com" className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border focus:border-brand focus:outline-none" />
          </div>
          <input type="text" placeholder="Asunto" className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border focus:border-brand focus:outline-none" />
          <textarea rows={4} placeholder="Escribe tu mensaje aquí..." className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border focus:border-brand focus:outline-none resize-none"></textarea>
          <button type="submit" className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold flex items-center justify-center gap-2 transition-colors">
            <Send className="w-4 h-4" /> Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
};
