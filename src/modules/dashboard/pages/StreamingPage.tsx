import { useState, useEffect, useRef } from 'react';
import { Tv, AlertCircle, Monitor, X, Globe } from 'lucide-react';
import { db } from '../../../core/firebase/config'; 
import { doc, setDoc, deleteDoc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';

export const StreamingPage = () => {
  const [streamMode, setStreamMode] = useState<'webrtc' | 'hls'>('webrtc');
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState('Sistema listo para transmitir');
  
  const streamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const unsubscribeAnswerRef = useRef<Unsubscribe | null>(null);
  const unsubscribeIceRef = useRef<Unsubscribe | null>(null);

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
      console.log("🔍 PASO 1: Actualizando Firebase settings a webrtc...");
      await setDoc(doc(db, 'live_streams', 'settings'), { mode: 'webrtc', active: true });
      setStatus('Solicitando permiso de captura...');
      
      console.log("🔍 PASO 2: Solicitando permiso de pantalla al navegador...");
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { frameRate: { ideal: 30, max: 30 } }, 
        audio: true 
      });
      console.log("✅ PASO 2 COMPLETADO: Permiso de pantalla obtenido.");

      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.contentHint = "motion";
      videoTrack.onended = () => stopStream();

      setStatus('Conectando señal en vivo...');
      console.log("🔍 PASO 3: Creando RTCPeerConnection...");
      const pc = new RTCPeerConnection(rtcConfig);
      pcRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          console.log("🔍 PASO 4: Enviando ICE candidate a Firebase...");
          await addDoc(collection(db, 'live_streams', 'main', 'ice_candidates_admin'), {
            candidate: event.candidate.toJSON(),
            timestamp: serverTimestamp()
          });
        }
      };

      console.log("🔍 PASO 5: Configurando listener para ICE candidates del viewer...");
      unsubscribeIceRef.current = onSnapshot(collection(db, 'live_streams', 'main', 'ice_candidates_viewer'), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' && pcRef.current && pcRef.current.signalingState !== 'closed') {
            const data = change.doc.data();
            pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error);
          }
        });
      });

      console.log("🔍 PASO 6: Creando oferta SDP...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("🔍 PASO 7: Guardando oferta en Firebase (live_streams/main)...");
      await setDoc(doc(db, 'live_streams', 'main'), {
        type: 'offer',
        sdp: offer.sdp,
        active: true,
        timestamp: serverTimestamp()
      });
      console.log("✅ PASO 7 COMPLETADO: Oferta guardada en Firebase. Esperando respuesta del viewer...");

      unsubscribeAnswerRef.current = onSnapshot(doc(db, 'live_streams', 'main'), async (snapshot) => {
        const data = snapshot.data();
        if (data && data.type === 'answer' && pcRef.current && pcRef.current.signalingState === 'have-local-offer') {
          console.log("✅ PASO 8: Respuesta del viewer recibida. Estableciendo conexión...");
          await pcRef.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }));
          setStatus('🔴 TRANSMITIENDO (Captura de Pantalla)');
          setIsStreaming(true);
        }
      });

    } catch (error) {
      console.error('❌ ERROR FATAL al iniciar stream:', error);
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
    if (unsubscribeAnswerRef.current) {
      unsubscribeAnswerRef.current();
      unsubscribeAnswerRef.current = null;
    }
    if (unsubscribeIceRef.current) {
      unsubscribeIceRef.current();
      unsubscribeIceRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    await deleteDoc(doc(db, 'live_streams', 'main'));
    await setDoc(doc(db, 'live_streams', 'settings'), { mode: 'webrtc', active: false });
    
    setIsStreaming(false);
    setStatus('Sistema listo para transmitir');
  };

  useEffect(() => {
    return () => {
      if (unsubscribeAnswerRef.current) unsubscribeAnswerRef.current();
      if (unsubscribeIceRef.current) unsubscribeIceRef.current();
      if (pcRef.current) pcRef.current.close();
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
                  <span>Transmite directamente desde este navegador. ⚠️ Marque <strong>"Compartir audio de la pestaña"</strong>.</span>
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