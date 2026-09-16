import { useState, useEffect, useRef } from 'react';
import { Tv, AlertCircle, Monitor, X } from 'lucide-react';
import { db } from '../../../core/firebase/config'; 
import { doc, setDoc, deleteDoc, onSnapshot, collection, addDoc, serverTimestamp, getDocs, deleteDoc as deleteDocAlias } from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';

export const StreamingPage = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState('Sistema listo para transmitir');
  const [viewerCount, setViewerCount] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const pcMapRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ],
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  };

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      console.log('⚠️ Wake Lock no soportado');
    }
  };

  const startStream = async () => {
    try {
      // Limpiar sesiones viejas
      const sessionsRef = collection(db, 'live_streams', 'sessions', 'viewers');
      const oldSessions = await getDocs(sessionsRef);
      oldSessions.forEach(async (docSnap) => {
        await deleteDocAlias(doc(db, 'live_streams', 'sessions', 'viewers', docSnap.id));
      });

      setStatus('Solicitando permiso de captura...');
      
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { frameRate: { ideal: 30, max: 30 } }, 
        audio: true 
      });

      streamRef.current = stream;
      
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.contentHint = "motion";
      }

      videoTrack.onended = () => stopStream();

      setStatus('🔴 TRANSMITIENDO - Esperando espectadores...');
      setIsStreaming(true);
      requestWakeLock();

      // Publicar la oferta activa
      const offerDocRef = doc(db, 'live_streams', 'active_offer');
      await setDoc(offerDocRef, {
        active: true,
        timestamp: serverTimestamp()
      });

      // Escuchar nuevas solicitudes de espectadores
      const viewersRef = collection(db, 'live_streams', 'sessions', 'viewers');
      
      unsubscribeRef.current = onSnapshot(viewersRef, async (snapshot) => {
        const currentViewers = new Set<string>();
        
        for (const change of snapshot.docChanges()) {
          const viewerId = change.doc.id;
          const viewerData = change.doc.data();
          currentViewers.add(viewerId);

          if (change.type === 'added' && !pcMapRef.current.has(viewerId)) {
            console.log(`🎬 Nuevo espectador conectado: ${viewerId}`);
            await handleNewViewer(viewerId, stream);
          }

          // Si el espectador envió su respuesta (answer)
          if (change.type === 'modified' && viewerData.answer && !pcMapRef.current.get(viewerId)?.currentRemoteDescription) {
            const pc = pcMapRef.current.get(viewerId);
            if (pc && pc.signalingState === 'have-local-offer') {
              try {
                await pc.setRemoteDescription(new RTCSessionDescription({ 
                  type: 'answer', 
                  sdp: viewerData.answer.sdp 
                }));
                console.log(`✅ Conexión establecida con: ${viewerId}`);
              } catch (err) {
                console.error('Error al establecer respuesta:', err);
              }
            }
          }
        }

        // Limpiar PCs de espectadores que se desconectaron
        pcMapRef.current.forEach((pc, id) => {
          if (!currentViewers.has(id)) {
            console.log(`👋 Espectador desconectado: ${id}`);
            pc.close();
            pcMapRef.current.delete(id);
          }
        });

        setViewerCount(currentViewers.size);
      });

    } catch (error) {
      console.error('❌ Error al iniciar stream:', error);
      setStatus('Error: ' + (error as Error).message);
    }
  };

  const handleNewViewer = async (viewerId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection(rtcConfig);
    pcMapRef.current.set(viewerId, pc);

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    // Enviar ICE candidates al espectador específico
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(
          collection(db, 'live_streams', 'sessions', 'viewers', viewerId, 'ice_candidates_admin'),
          {
            candidate: event.candidate.toJSON(),
            timestamp: serverTimestamp()
          }
        );
      }
    };

    // Escuchar ICE candidates del espectador
    onSnapshot(
      collection(db, 'live_streams', 'sessions', 'viewers', viewerId, 'ice_candidates_viewer'),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' && pc.signalingState !== 'closed') {
            const data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error);
          }
        });
      }
    );

    // Crear oferta y enviarla al espectador
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await setDoc(
      doc(db, 'live_streams', 'sessions', 'viewers', viewerId),
      {
        offer: {
          sdp: offer.sdp,
          type: 'offer'
        },
        timestamp: serverTimestamp()
      },
      { merge: true }
    );
  };

  const stopStream = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Cerrar todas las conexiones
    pcMapRef.current.forEach(pc => pc.close());
    pcMapRef.current.clear();

    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
    
    // Limpiar Firestore
    await deleteDoc(doc(db, 'live_streams', 'active_offer'));
    
    setIsStreaming(false);
    setViewerCount(0);
    setStatus('Sistema listo para transmitir');
  };

    /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    return () => {
      const currentUnsubscribe = unsubscribeRef.current;
      const currentPcMap = pcMapRef.current;
      const currentWakeLock = wakeLockRef.current;

      if (currentUnsubscribe) currentUnsubscribe();
      currentPcMap.forEach((pc) => pc.close());
      if (currentWakeLock) currentWakeLock.release();
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

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
            Transmisión Multi-Espectador
          </h2>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-400 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Nueva arquitectura:</strong> Permite que espectadores se conecten en cualquier momento durante la transmisión. Cada espectador tiene su propia sesión independiente.
                <br/>⚠️ <strong>IMPORTANTE:</strong> Marque <strong>"Compartir audio de la pestaña"</strong>.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-dark-bg border border-dark-border">
            <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className={`font-medium ${isStreaming ? 'text-red-400' : 'text-text-secondary'}`}>
              {status}
            </span>
            {isStreaming && viewerCount > 0 && (
              <span className="ml-auto text-xs bg-brand/20 text-brand px-2 py-1 rounded-full">
                {viewerCount} espectador{viewerCount !== 1 ? 'es' : ''}
              </span>
            )}
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