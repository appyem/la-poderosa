import { useState } from 'react';
import { Phone, Mail, MapPin, Share2, Copy, Check } from 'lucide-react';

// SVGs oficiales de redes sociales
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z"/></svg>
);
const TikTokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
);
const YouTubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

export const TarjetaPage = () => {
  const [copied, setCopied] = useState(false);

  const datos = {
    nombre: 'LA PODEROSA DEL CAFÉ',
    eslogan: 'Siempre contigo, Siempre poderosa.',
    logo: '/logo.png',
    telefono: '+57 322 702 7174',
    whatsapp: '573227027174',
    email: 'comercial@lapoderosa.co',
    direccion: 'Risaralda - Caldas',
    web: 'lapoderosa.co'
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleShareWhatsApp = () => {
    // ✅ MENSAJE ESPECÍFICO PARA LA TARJETA
    const text = `📇 *Tarjeta de Presentación Digital*\n\n${datos.nombre}\n"${datos.eslogan}"\n\n📱 Accede a todos nuestros contactos y redes sociales aquí:\n${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    // ✅ PANTALLA COMPLETA SIN PADDING
    <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center relative overflow-hidden">
      {/* Resplandor ambiental */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Tarjeta Compacta - OCUPA TODA LA PANTALLA */}
      <div className="w-full h-full bg-neutral-900/80 backdrop-blur-2xl overflow-hidden relative">
        
        {/* MARCA DE AGUA DENTRO DE LA TARJETA CON MODULACIÓN VISIBLE */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="relative">
            {/* Ondas de modulación del fondo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[280px] h-[280px] rounded-full border-2 border-amber-500/20 animate-ping-bg-1" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[280px] h-[280px] rounded-full border-2 border-amber-500/15 animate-ping-bg-2" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[280px] h-[280px] rounded-full border-2 border-amber-500/10 animate-ping-bg-3" />
            </div>
            
            {/* Logo de fondo con 40% de opacidad y pulso */}
            <img 
              src={datos.logo} 
              alt=""
              className="w-[280px] h-[280px] opacity-[0.4] object-contain animate-pulse-bg"
            />
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header con Logo Modulando */}
          <div className="relative pt-8 pb-4 px-6 text-center flex-shrink-0">
            <div className="relative inline-block">
              {/* Ondas de modulación del logo principal */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-amber-500/40 animate-ping-fast" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 animate-ping-medium" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-amber-500/20 animate-ping-slow" />
              </div>
              
              {/* Resplandor detrás del logo */}
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse-glow" />
              
              {/* Logo principal con pulso */}
              <img 
                src={datos.logo} 
                alt={datos.nombre}
                className="relative w-20 h-20 rounded-full border-2 border-amber-500/30 shadow-xl object-cover bg-neutral-800 p-1.5 animate-pulse-logo"
              />
            </div>
            <h1 className="mt-3 text-xl font-bold text-white tracking-tight leading-none drop-shadow-lg">
              {datos.nombre}
            </h1>
            <p className="mt-1.5 text-amber-400/90 text-xs font-medium italic tracking-wide drop-shadow-md">
              {datos.eslogan}
            </p>
          </div>

          {/* Contenido principal - Se expande para llenar el espacio */}
          <div className="flex-1 flex flex-col justify-center px-4 py-4 space-y-4">
            {/* Botones de Acción */}
            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all active:scale-95 backdrop-blur-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-green-600/90 hover:bg-green-500 text-white text-xs font-medium transition-all active:scale-95 backdrop-blur-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                Compartir
              </button>
            </div>

            {/* Contacto Compacto */}
            <div className="space-y-2">
              <a href={`tel:${datos.telefono.replace(/\s/g, '')}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-semibold">Llamar</p>
                  <p className="text-neutral-200 text-xs font-medium truncate">{datos.telefono}</p>
                </div>
              </a>

              <a href={`mailto:${datos.email}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-semibold">Correo</p>
                  <p className="text-neutral-200 text-xs font-medium truncate">{datos.email}</p>
                </div>
              </a>

              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(datos.direccion)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-semibold">Ubicación</p>
                  <p className="text-neutral-200 text-xs font-medium truncate">{datos.direccion}</p>
                </div>
              </a>
            </div>

            {/* Redes Sociales Grid Compacto */}
            <div className="grid grid-cols-4 gap-2">
              <a href="https://www.instagram.com/lapoderosadelcafe/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/5 hover:border-pink-500/30 transition-all backdrop-blur-sm">
                <InstagramIcon />
              </a>
              <a href="https://www.facebook.com/lapoderosadelcafe" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-600/10 border border-white/5 hover:border-blue-500/30 transition-all backdrop-blur-sm">
                <FacebookIcon />
              </a>
              <a href="https://www.tiktok.com/@poderazadelcafe104" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-neutral-800/50 border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm">
                <TikTokIcon />
              </a>
              <a href="https://www.youtube.com/@LaPoderosadelCaf%C3%A9" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-red-600/10 border border-white/5 hover:border-red-500/30 transition-all backdrop-blur-sm">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Footer Clickeable - Lleva a la página principal */}
          <div className="bg-black/30 px-4 py-3 text-center border-t border-white/5 backdrop-blur-sm flex-shrink-0">
            <a 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 transition-colors"
            >
              🌐 {datos.web}
            </a>
          </div>
        </div>
      </div>

      {/* ESTILOS CSS PARA LAS ANIMACIONES */}
      <style>{`
        @keyframes ping-fast {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes ping-medium {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes ping-bg-1 {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes ping-bg-2 {
          0% { transform: scale(1); opacity: 0.25; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes ping-bg-3 {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes pulse-logo {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes pulse-bg {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
        .animate-ping-fast { animation: ping-fast 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-medium { animation: ping-medium 2s cubic-bezier(0, 0, 0.2, 1) infinite; animation-delay: 0.3s; }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; animation-delay: 0.6s; }
        .animate-ping-bg-1 { animation: ping-bg-1 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-bg-2 { animation: ping-bg-2 3s cubic-bezier(0, 0, 0.2, 1) infinite; animation-delay: 0.5s; }
        .animate-ping-bg-3 { animation: ping-bg-3 3s cubic-bezier(0, 0, 0.2, 1) infinite; animation-delay: 1s; }
        .animate-pulse-logo { animation: pulse-logo 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-pulse-bg { animation: pulse-bg 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};