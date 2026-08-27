import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  // Número nuevo con código de país (57 para Colombia)
  const phoneNumber = '573227027174';
  const message = encodeURIComponent('Hola La Poderosa, quiero más información');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      // ✅ POSICIONAMIENTO INTELIGENTE:
      // - Celular: bottom-36 (144px) para quedar justo encima del mini reproductor (bottom-16) y la barra inferior (bottom-0)
      // - PC: bottom-8 right-8 (esquina inferior derecha clásica y elegante)
      className="fixed bottom-36 md:bottom-8 right-4 md:right-8 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 flex items-center justify-center z-40 transition-all hover:scale-110 active:scale-95 group"
    >
      <MessageCircle className="w-7 h-7 fill-current" />
      
      {/* Tooltip que aparece al pasar el mouse en PC */}
      <span className="absolute right-16 bg-dark-surface text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-dark-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
        ¡Escríbenos por WhatsApp!
      </span>
    </a>
  );
};