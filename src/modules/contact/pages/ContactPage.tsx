import { Mail, Phone, MapPin, Send, Globe, Camera, Music, MessageCircle, ExternalLink } from 'lucide-react';

export const ContactPage = () => {
  // Datos de redes sociales organizados para renderizado limpio
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/santamariaturismorural',
      icon: Globe, // Icono genérico para web/red social
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      handle: 'Santa María Turismo Rural',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/lapoderosadelcafe/',
      icon: Camera, // Icono de cámara para Instagram
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      handle: '@lapoderosadelcafe',
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@poderazadelcafe104',
      icon: Music, // Icono de música para TikTok
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      handle: '@poderazadelcafe104',
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/message/732P3S5KLI6MC1',
      icon: MessageCircle,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      handle: '315 161 5474',
    },
  ];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Contáctanos</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Estamos aquí para escucharte. Síguenos en nuestras redes, escríbenos o visítanos para hacer parte de La Poderosa.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* COLUMNA IZQUIERDA: Información y Redes */}
        <div className="space-y-6">
          
          {/* Tarjeta de Redes Sociales */}
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-brand" />
              Síguenos en Redes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-lg border border-dark-border ${social.bg} hover:scale-[1.02] transition-all group`}
                >
                  <div className={`p-2 rounded-full bg-dark-surface ${social.color} group-hover:scale-110 transition-transform`}>
                    <social.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{social.name}</span>
                    <span className="text-xs text-text-secondary truncate">{social.handle}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Tarjeta de Información de Contacto */}
          <div className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
            <h3 className="text-xl font-bold text-white">Información Directa</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-brand/10 text-brand flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Teléfono / WhatsApp</p>
                  <a href="https://wa.me/573151615474" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-brand transition-colors">
                    +57 315 161 5474
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-brand/10 text-brand flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Correo Electrónico</p>
                  <a href="mailto:lapoderosadelcafe104.1@gmail.com" className="text-sm text-text-secondary hover:text-brand transition-colors break-all">
                    lapoderosadelcafe104.1@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-brand/10 text-brand flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Ubicación</p>
                  <p className="text-sm text-text-secondary">Colombia - Emisora La Poderosa del Café</p>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder de Mapa */}
          <div className="aspect-video rounded-xl bg-dark-surface border border-dark-border flex flex-col items-center justify-center text-text-secondary">
            <MapPin className="w-8 h-8 mb-2 text-brand" />
            <span className="text-sm">Mapa de Ubicación (Próximamente)</span>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario de Contacto */}
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Envíanos un mensaje</h3>
            <p className="text-sm text-text-secondary mt-1">Responderemos a la brevedad posible.</p>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado (Simulación)'); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Nombre completo</label>
                <input 
                  type="text" 
                  placeholder="Tu nombre" 
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-text-muted focus:border-brand focus:outline-none transition-colors" 
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Correo electrónico</label>
                <input 
                  type="email" 
                  placeholder="tu@email.com" 
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-text-muted focus:border-brand focus:outline-none transition-colors" 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Asunto</label>
              <input 
                type="text" 
                placeholder="¿En qué podemos ayudarte?" 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-text-muted focus:border-brand focus:outline-none transition-colors" 
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Mensaje</label>
              <textarea 
                rows={5} 
                placeholder="Escribe tu mensaje aquí..." 
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-text-muted focus:border-brand focus:outline-none transition-colors resize-none" 
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" /> Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};