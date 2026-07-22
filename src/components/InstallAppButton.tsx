import { useState, useEffect } from 'react';
import { Download, Share, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export const InstallAppButton = () => {
  const [isInstalled] = useState(() => {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  });
  
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = () => {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    
    if (isIos) {
      setShowIosInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ Usuario aceptó la instalación');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand text-white font-bold shadow-lg hover:opacity-90 transition-all"
      >
        <Download className="w-5 h-5" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">App</span>
      </button>

      {showIosInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 max-w-sm w-full relative shadow-2xl">
            <button 
              onClick={() => setShowIosInstructions(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-bold text-white">Instalar en iPhone</h3>
              <p className="text-text-secondary text-sm">
                Para agregar <strong>La Poderosa</strong> a tu pantalla de inicio, sigue estos 2 pasos:
              </p>
              <div className="bg-dark-elevated rounded-xl p-4 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-white">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white font-bold text-xs flex-shrink-0">1</span>
                  <span>Toca el botón <Share className="w-4 h-4 inline mx-1" /> <strong>Compartir</strong> abajo.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white font-bold text-xs flex-shrink-0">2</span>
                  <span>Desliza hacia arriba y selecciona <strong>"Agregar a inicio"</strong>.</span>
                </div>
              </div>
              <button 
                onClick={() => setShowIosInstructions(false)}
                className="w-full py-3 rounded-xl bg-brand text-white font-bold hover:opacity-90 transition-colors"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};