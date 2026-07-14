import { useMemo } from 'react';

// En el futuro, esto vendrá de Firestore según el dominio o subdominio.
// Por ahora, es la configuración "LA PODEROSA" por defecto.
export const useTenant = () => {
  const tenantConfig = useMemo(() => ({
    name: 'LA PODEROSA',
    slogan: 'La voz que te mueve', // Configurable
    logoUrl: '/src/assets/logo.png', // Ajusta la extensión si es .jpg
    theme: {
      primaryColor: '#E50914',
      backgroundColor: '#0A0A0A',
    },
    features: {
      hasLiveRadio: true,
      hasLiveTV: true,
      hasPodcasts: true,
      hasNews: true,
    }
  }), []);

  return tenantConfig;
};