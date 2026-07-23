import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Tv, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  getTvConfig, 
  updateTvUrl, 
  extraerVideoIdDeYoutube 
} from '../../../core/firebase/services';

export const StreamingPage = () => {
  const [tvUrl, setTvUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    getTvConfig().then(url => {
      setTvUrl(url);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const mostrarMensaje = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tvUrl.trim()) {
      mostrarMensaje('error', 'La URL de YouTube es obligatoria.');
      return;
    }

    const videoId = extraerVideoIdDeYoutube(tvUrl);
    if (!videoId) {
      mostrarMensaje('error', 'La URL de YouTube no es válida.');
      return;
    }

    try {
      setSaving(true);
      await updateTvUrl(tvUrl);
      mostrarMensaje('success', 'URL de televisión actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar TV:', error);
      mostrarMensaje('error', 'Error al guardar la configuración.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Control de Streaming</h1>
        <p className="text-sm text-text-secondary mt-1">Gestione la transmisión en vivo de la plataforma</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/30 text-green-500' 
            : 'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="max-w-2xl">
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <Tv className="w-5 h-5 text-brand" />
            Configuración de Televisión en Vivo
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Ingrese la URL del video o canal de YouTube que desea mostrar en la página de Televisión. 
            El sistema extraerá automáticamente el video para la transmisión en vivo.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">URL de YouTube en Vivo *</label>
              <input
                type="url"
                value={tvUrl}
                onChange={(e) => setTvUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none transition-colors"
                disabled={saving}
              />
              <p className="text-xs text-text-muted mt-2">
                Ejemplo válido: https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </p>
            </div>

            {tvUrl && extraerVideoIdDeYoutube(tvUrl) && (
              <div className="p-4 rounded-lg bg-brand/5 border border-brand/20">
                <p className="text-sm text-brand font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  URL válida detectada. ID del video: {extraerVideoIdDeYoutube(tvUrl)}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-lg bg-brand hover:bg-brand-light text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Tv className="w-5 h-5" />}
              {saving ? 'Guardando...' : 'Actualizar Transmisión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};