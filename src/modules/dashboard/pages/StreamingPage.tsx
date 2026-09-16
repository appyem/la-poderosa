import { useState, useEffect, useRef } from 'react';
import { Tv, AlertCircle, Monitor, X } from 'lucide-react';
import { db } from '../../../core/firebase/config'; 
import { doc, setDoc, deleteDoc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';

export const StreamingPage = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState('Sistema listo para transmitir');
  const streamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const unsubscribeAnswerRef = useRef<Unsubscribe | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const rtcConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  };

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.log('🔒 Wake Lock activado');
      }
    } catch {
      console.log('⚠️ Wake Lock no soportado o denegado (normal en algunos navegadores)');
    }
  };

  const startStream = async () => {
    try {
      // ✅ CORRECCIÓN 1: Limpiar cualquier documento viejo para evitar que la TV lea un 'answer' obsoleto
      await deleteDoc(doc(db, 'live_streams', 'main'));
      
      setStatus('Solicitando permiso de captura...');
      
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { frameRate: { ideal: 30, max: 30 } }, 
        audio: true 
      });

      streamRef.current = stream;
      
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.contentHint = "motion"; // ✅ Optimización de fluidez
      }

      videoTrack.onended = () => stopStream();

      setStatus('Conectando señal en vivo...');
      const pc = new RTCPeerConnection(rtcConfig);
      pcRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await addDoc(collection(db, 'live_streams', 'main', 'ice_candidates_admin'), {
            candidate: event.candidate.toJSON(),
            timestamp: serverTimestamp()
          });
        }
      };

      // ✅ CORRECCIÓN 2: Verificar que la conexión no esté cerrada antes de agregar ICE
      onSnapshot(collection(db, 'live_streams', 'main', 'ice_candidates_viewer'), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' && pcRef.current && pcRef.current.signalingState !== 'closed') {
            const data = change.doc.data();
            pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error);
          }
        });
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await setDoc(doc(db, 'live_streams', 'main'), {
        type: 'offer',
        sdp: offer.sdp,
        active: true,
        timestamp: serverTimestamp()
      });

      const unsubscribe = onSnapshot(doc(db, 'live_streams', 'main'), async (snapshot) => {
        const data = snapshot.data();
        if (data && data.type === 'answer' && pc.signalingState === 'have-local-offer') {
          await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }));
          setStatus('🔴 TRANSMITIENDO EN VIVO');
          setIsStreaming(true);
          requestWakeLock();
        }
      });
      
      unsubscribeAnswerRef.current = unsubscribe;

    } catch (error) {
      console.error('❌ Error al iniciar stream:', error);
      setStatus('Error: ' + (error as Error).message);
    }
  };

  const stopStream = async () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (unsubscribeAnswerRef.current) {
      unsubscribeAnswerRef.current();
      unsubscribeAnswerRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
    
    await deleteDoc(doc(db, 'live_streams', 'main'));
    setIsStreaming(false);
    setStatus('Sistema listo para transmitir');
  };

  useEffect(() => {
    return () => {
      if (unsubscribeAnswerRef.current) unsubscribeAnswerRef.current();
      if (pcRef.current) pcRef.current.close();
      if (wakeLockRef.current) wakeLockRef.current.release();
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
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <Monitor className="w-5 h-5 text-brand" />
            Transmisión Directa desde el Navegador
          </h2>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-400 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Optimizaciones activas:</strong> Fluidez a 30 FPS y modo "Motion".
                <br/>⚠️ <strong>IMPORTANTE:</strong> Marque <strong>"Compartir audio de la pestaña"</strong> en la ventana emergente.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-dark-bg border border-dark-border">
            <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className={`font-medium ${isStreaming ? 'text-red-400' : 'text-text-secondary'}`}>{status}</span>
          </div>

          <div className="flex gap-3">
            {!isStreaming ? (
              <button onClick={startStream} className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors flex items-center justify-center gap-2">
                <Tv className="w-5 h-5" /> Iniciar Transmisión
              </button>
            ) : (
              <button onClick={stopStream} className="flex-1 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold transition-colors flex items-center justify-center gap-2">
                <X className="w-5 h-5" /> Detener Transmisión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};