import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '../../../core/firebase/config';

// Interfaz para tipar la respuesta de la Cloud Function
interface ResultadoNotificacion {
  success: boolean;
  successCount?: number;
  failureCount?: number;
  error?: string;
}

export const NotificacionesPage = () => {
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [url, setUrl] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ success: boolean; message: string } | null>(null);

  const functions = getFunctions(app);
  const enviarNotificacion = httpsCallable<
    { titulo: string; mensaje: string; url: string },
    ResultadoNotificacion
  >(functions, 'enviarNotificacionPush');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);

    try {
      const result = await enviarNotificacion({ titulo, mensaje, url });
      const data = result.data;

      if (data.success) {
        setResultado({
          success: true,
          message: `✅ Notificación enviada a ${data.successCount} dispositivos`
        });
        setTitulo('');
        setMensaje('');
        setUrl('');
      } else {
        setResultado({
          success: false,
          message: `❌ Error: ${data.error}`
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setResultado({
        success: false,
        message: `❌ Error: ${errorMessage}`
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Enviar Notificación Push</h1>
        <p className="text-text-secondary mt-1">Envíe notificaciones a todos los usuarios que instalaron la app.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Título de la notificación</label>
          <input
            required
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
            placeholder="Ej: ¡Nuevo episodio disponible!"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Mensaje</label>
          <textarea
            required
            rows={4}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none resize-none"
            placeholder="Ej: Escucha el nuevo episodio de nuestro podcast..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">URL al hacer clic (opcional)</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none"
            placeholder="https://lapoderosa.co/noticias/123"
          />
        </div>

        {resultado && (
          <div className={`p-4 rounded-lg ${resultado.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {resultado.message}
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-semibold transition-colors disabled:opacity-50"
        >
          {enviando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Enviar Notificación
            </>
          )}
        </button>
      </form>
    </div>
  );
};