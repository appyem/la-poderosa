import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';

export const PagoExitosoPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedido');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificación del pago (aquí consultarías Firebase para confirmar que el estado cambió a 'pagado')
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
        <p className="text-text-secondary">Verificando su pago...</p>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8 max-w-2xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-white">
        ¡Pago Procesado con Éxito!
      </h1>
      
      <p className="text-text-secondary text-lg">
        Gracias por su compra en <span className="text-brand font-bold">La Poderosa Shop</span>.
        Hemos recibido su pedido y estamos preparando su envío a Caldas.
      </p>

      {pedidoId && (
        <div className="p-4 rounded-xl bg-dark-surface border border-dark-border inline-block">
          <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Número de Pedido</p>
          <p className="text-xl font-mono font-bold text-white">{pedidoId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate('/tienda')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-surface border border-dark-border text-white font-semibold hover:bg-dark-elevated transition-colors"
        >
          <Package className="w-4 h-4" />
          Seguir comprando
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold transition-colors"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </button>
      </div>

      <div className="pt-8 text-sm text-text-muted">
        <p>¿Tiene preguntas sobre su pedido?</p>
        <a 
          href="https://wa.me/573227027174?text=Hola,%20tengo%20una%20pregunta%20sobre%20mi%20pedido%20" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-brand hover:underline font-medium"
        >
          Contáctenos por WhatsApp
        </a>
      </div>
    </div>
  );
};