import { useState, useEffect } from 'react';

interface Metadata {
  artist: string;
  title: string;
}

interface IcecastSource {
  listenurl?: string;
  title?: string;
}

interface IcecastStats {
  source: IcecastSource | IcecastSource[];
}

interface IcecastResponse {
  icestats: IcecastStats;
}

export const useRadioMetadata = () => {
  const [metadata, setMetadata] = useState<Metadata>({ 
    artist: 'La Poderosa', 
    title: 'Transmitiendo en Vivo' 
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Usamos un proxy CORS gratuito para evitar el bloqueo del navegador
        const targetUrl = 'https://sapircast.caster.fm:10406/status-json.xsl';
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl);
        const data: IcecastResponse = await response.json();
        
        const sources = data.icestats.source;
        const currentSource = Array.isArray(sources) 
          ? sources.find((s) => s.listenurl?.includes('q4QD0')) 
          : sources;

        if (currentSource && currentSource.title) {
          const parts = currentSource.title.split(' - ');
          const artist = parts.length > 1 ? parts[0].trim() : 'La Poderosa';
          const title = parts.length > 1 ? parts.slice(1).join(' - ').trim() : currentSource.title;
          
          setMetadata({ artist, title });
        }
      } catch {
        // Silencioso: si falla, mantiene el último valor conocido o el por defecto
      }
    };

    fetchMetadata();
    const interval = setInterval(fetchMetadata, 15000);

    return () => clearInterval(interval);
  }, []);

  return metadata;
};