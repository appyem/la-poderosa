import { useState, useEffect, useRef } from 'react';
import { Tv, AlertCircle, Monitor, X, Globe } from 'lucide-react';
import { db } from '../../../core/firebase/config'; 
import { doc, setDoc, deleteDoc, onSnapshot, collection, addDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';

export const StreamingPage = () => {
  const [streamMode, setStreamMode] = useState<'webrtc' | 'hls'>('webrtc');
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState('Sistema listo para transmitir');
  
  const streamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const unsubscribeViewerRef = useRef<Unsubscribe | null>(null);
  const activeViewers = useRef<Map<string, Unsubscribe>>(new Map());

  const rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      {
        urls: 'turn:stream.lapoderosa.co:3478',
        username: 'lapoderosa',
        credential: 'LaPoderosaTurn2024!'
      }
    ]
  };

  const startWebRTC = async () => {
    try {
      await setDoc(doc(db, 'live_streams', 'settings'), { mode: 'webrtc', active: true });
      setStatus('Solicitando permiso de captura...');
      
      // ✅ SOLUCIÓN RESOLUCIÓN: Solicitar explícitamente Full HD
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30, max: 30 } }, 
        audio: true 
      });

      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.contentHint = "motion";
      videoTrack.onended = () => stopStream();

      setStatus('Conectando señal en vivo...');
      const pc = new RTCPeerConnection(rtcConfig);
      pcRef.current = pc;
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // 1. Publicar la OFERTA MAESTRA (Persistente, nunca se sobrescribe)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await setDoc(doc(db, 'live_streams', 'main'), {
        type: 'offer',
        sdp: offer.sdp,
        active: true,
        timestamp: serverTimestamp()
      });

      // 2. Escuchar nuevos espectadores que envían su respuesta
      unsubscribeViewerRef.current = onSnapshot(collection(db, 'live_streams', 'viewers'), (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          const viewerId = change.doc.id;
          const data = change.doc.data();

                    if ((change.type === 'added' || change.type === 'modified') && data?.type === 'answer') {
            const pc = pcRef.current;
            if (pc && pc.signalingState === 'have-local-offer') {
              try {
                await pc.setRemoteDescription(new RTCSessionDescription({
                  type: 'answer',
                  sdp: data.sdp
                }));
                setStatus('🔴 TRANSMITIENDO (Captura de Pantalla)');
                setIsStreaming(true);

                const unsubIce = onSnapshot(collection(db, 'live_streams', 'viewers', viewerId, 'ice_viewer'), (iceSnap) => {
                  iceSnap.docChanges().forEach((iceChange) => {
                    if (iceChange.type === 'added' && pc.signalingState !== 'closed') {
                      pc.addIceCandidate(new RTCIceCandidate(iceChange.doc.data().candidate)).catch(console.error);
                    }
                  });
                });
                activeViewers.current.set(viewerId, unsubIce);
              } catch (err) {
                console.error('Error al establecer respuesta:', err);
              }
            }
          }

          if (change.type === 'removed') {
            const unsub = activeViewers.current.get(viewerId);
            if (unsub) unsub();
            activeViewers.current.delete(viewerId);
          }
        });
      });

      // 3. Cuando el Admin genera un candidato ICE, enviarlo a TODOS los espectadores activos
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          const candidateData = { candidate: event.candidate.toJSON(), timestamp: serverTimestamp() };
          const promises = Array.from(activeViewers.current.keys()).map(async (vId) => {
            await addDoc(collection(db, 'live_streams', 'viewers', vId, 'ice_admin'), candidateData);
          });
          await Promise.all(promises);
        }
      };

    } catch (error) {
      console.error('❌ Error al iniciar stream:', error);
      setStatus('Error: ' + (error as Error).message);
    }
  };

  const activateHLS = async () => {
    try {
      await setDoc(doc(db, 'live_streams', 'settings'), { 
        mode: 'hls', 
        active: true,
        src: 'https://stream.lapoderosa.co/live/lapoderosa.m3u8'
      });
      setStatus('🔴 TRANSMITIENDO (Fuente Externa YoloBox/OBS)');
      setIsStreaming(true);
    } catch (error) {
      console.error('❌ Error al activar HLS:', error);
    }
  };

  const stopStream = async () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    
    // Limpiar listeners de todos los espectadores
    activeViewers.current.forEach((unsub) => unsub());
    activeViewers.current.clear();
    
    if (unsubscribeViewerRef.current) {
      unsubscribeViewerRef.current();
      unsubscribeViewerRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    // 1. Eliminar la oferta maestra
    await deleteDoc(doc(db, 'live_streams', 'main'));
    
    // 2. Limpiar la colección de viewers para no dejar basura en la base de datos
    try {
      const viewersSnap = await getDocs(collection(db, 'live_streams', 'viewers'));
      const batch = writeBatch(db);
      viewersSnap.docs.forEach((d) => {
        batch.delete(d.ref);
      });
      await batch.commit();
    } catch (e) {
      console.error('Error limpiando viewers:', e);
    }

    await setDoc(doc(db, 'live_streams', 'settings'), { mode: streamMode, active: false });
    
    setIsStreaming(false);
    setStatus('Sistema listo para transmitir');
  };

      useEffect(() => {
    // 1. Capturar las referencias actuales ANTES del return (esto satisface al linter)
    const viewersToClean = activeViewers.current;
    const viewerUnsub = unsubscribeViewerRef.current;
    const currentPc = pcRef.current;

    return () => {
      // 2. Usar solo las variables locales en la limpieza
      viewersToClean.forEach((unsub) => unsub());
      if (viewerUnsub) viewerUnsub();
      if (currentPc) currentPc.close();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Control de Streaming</h1>
        <p className="text-sm text-text-secondary mt-1">Gestione la transmisión en vivo de la plataforma</p>
      </div>

      <div className="max-w-2xl">
        <div className="p-6 rounded-xl bg-dark-surface border border-dark-border">
          <div className="flex gap-2 mb-6 p-1 bg-dark-bg rounded-lg">
            <button 
              onClick={() => !isStreaming && setStreamMode('webrtc')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${streamMode === 'webrtc' ? 'bg-brand text-white' : 'text-text-secondary hover:text-white'}`}
              disabled={isStreaming}
            >
              <Monitor className="w-4 h-4" /> Captura de Pantalla
            </button>
            <button 
              onClick={() => !isStreaming && setStreamMode('hls')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${streamMode === 'hls' ? 'bg-brand text-white' : 'text-text-secondary hover:text-white'}`}
              disabled={isStreaming}
            >
              <Globe className="w-4 h-4" /> YoloBox / OBS (Servidor Propio)
            </button>
          </div>

          {streamMode === 'webrtc' ? (
            <>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-400 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Transmite directamente desde este navegador. ⚠️ Marque <strong>"Compartir audio de la pestaña"</strong> y seleccione la pantalla completa.</span>
                </p>
              </div>
              <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-dark-bg border border-dark-border">
                <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className={`font-medium ${isStreaming ? 'text-red-400' : 'text-text-secondary'}`}>{status}</span>
              </div>
              <div className="flex gap-3">
                {!isStreaming ? (
                  <button onClick={startWebRTC} className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors flex items-center justify-center gap-2">
                    <Tv className="w-5 h-5" /> Iniciar Captura
                  </button>
                ) : (
                  <button onClick={stopStream} className="flex-1 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold transition-colors flex items-center justify-center gap-2">
                    <X className="w-5 h-5" /> Detener Transmisión
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-400 flex items-start gap-2">
                  <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    Configure su YoloBox u OBS con estos datos y luego active la señal:<br/>
                    <strong>URL:</strong> rtmp://104.156.247.202/live<br/>
                    <strong>Clave:</strong> lapoderosa
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-dark-bg border border-dark-border">
                <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className={`font-medium ${isStreaming ? 'text-red-400' : 'text-text-secondary'}`}>{status}</span>
              </div>
              <div className="flex gap-3">
                {!isStreaming ? (
                  <button onClick={activateHLS} className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5" /> Activar Señal Externa
                  </button>
                ) : (
                  <button onClick={stopStream} className="flex-1 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold transition-colors flex items-center justify-center gap-2">
                    <X className="w-5 h-5" /> Detener Transmisión
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};