import { useEffect, useState } from 'react';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          <img 
            src="/logo.jpg" 
            alt="LA PODEROSA" 
            className="w-40 h-40 rounded-full object-cover shadow-2xl shadow-brand/50 border-4 border-brand animate-pulse"
          />
          <div className="absolute inset-0 w-40 h-40 rounded-full border-4 border-brand/30 animate-ping" />
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-white">LA PODEROSA</h1>
          <p className="text-sm text-text-muted uppercase tracking-widest">Cargando experiencia...</p>
        </div>
      </div>
    </div>
  );
};