import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  addDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  updateDoc 
} from 'firebase/firestore';
import { getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import type { Program, News, Tenant } from '../types/models';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
   
} from 'firebase/auth';
import type { User } from 'firebase/auth';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const TENANT_ID = 'la-poderosa-4b6ab'; 

// ==========================================
// TIPOS PARA LA PARRILLA DE RADIO
// ==========================================
export interface DJ {
  id: string;
  nombre: string;
  fotoUrl?: string;
  bio?: string;
  tenantId: string;
  createdAt: Timestamp;
}

export interface ProgramaRadio {
  id: string;
  nombre: string;
  descripcion: string;
  djId: string;
  dias: string[];
  horaInicio: string;
  horaFin: string;
  tenantId: string;
  createdAt: Timestamp;
}

// ==========================================
// FUNCIONES PARA DJs
// ==========================================
export const addDJ = async (djData: Omit<DJ, 'id' | 'createdAt' | 'tenantId'>) => {
  const docRef = await addDoc(collection(db, 'djs'), {
    ...djData,
    tenantId: TENANT_ID,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getDJs = async (): Promise<DJ[]> => {
  const q = query(collection(db, 'djs'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const djs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DJ));
  return djs.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const deleteDJ = async (djId: string) => {
  await deleteDoc(doc(db, 'djs', djId));
};

// ==========================================
// FUNCIONES PARA PROGRAMAS DE RADIO
// ==========================================
export const addProgramaRadio = async (programaData: Omit<ProgramaRadio, 'id' | 'createdAt' | 'tenantId'>) => {
  const docRef = await addDoc(collection(db, 'programas_radio'), {
    ...programaData,
    tenantId: TENANT_ID,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getProgramasRadio = async (): Promise<ProgramaRadio[]> => {
  const q = query(collection(db, 'programas_radio'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const programas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProgramaRadio));
  return programas.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
};

export const deleteProgramaRadio = async (programaId: string) => {
  await deleteDoc(doc(db, 'programas_radio', programaId));
};

// ==========================================
// FUNCIONES ORIGINALES
// ==========================================
export const getLivePrograms = async () => {
  const q = query(collection(db, 'programs'), where('tenantId', '==', TENANT_ID), where('isLive', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Program[];
};

export const getAllPrograms = async () => {
  const q = query(collection(db, 'programs'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const programs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Program[];
  return programs.sort((a, b) => {
    const valA = a.startTime ? String(a.startTime) : '';
    const valB = b.startTime ? String(b.startTime) : '';
    return valA.localeCompare(valB);
  });
};

export const getFeaturedNews = async () => {
  const q = query(collection(db, 'news'), where('tenantId', '==', TENANT_ID), where('isFeatured', '==', true), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as News[];
};

export const getRecentNews = async () => {
  const q = query(collection(db, 'news'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as News[];
  return news.sort((a, b) => {
    const valA = a.publishedAt ? String(a.publishedAt) : '';
    const valB = b.publishedAt ? String(b.publishedAt) : '';
    return valB.localeCompare(valA);
  }).slice(0, 10);
};

export const getTenantConfig = async (slug: string) => {
  const q = query(collection(db, 'tenants'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Tenant;
};

// ==========================================
// FUNCIONES PARA CHAT EN VIVO
// ==========================================
export interface ChatMessage {
  id: string;
  usuario: string;
  mensaje: string;
  timestamp: Timestamp;
  tenantId: string;
}

export const addChatMessage = async (usuario: string, mensaje: string) => {
  const docRef = await addDoc(collection(db, 'chat'), {
    usuario,
    mensaje,
    timestamp: Timestamp.now(),
    tenantId: TENANT_ID
  });
  return docRef.id;
};

export const getChatMessages = async (maxMessages: number = 50): Promise<ChatMessage[]> => {
  const q = query(
    collection(db, 'chat'), 
    where('tenantId', '==', TENANT_ID)
  );
  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
  
  // Calcular la marca de tiempo de hace exactamente 24 horas
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
  
  // 1. Filtrar: Solo conservar mensajes de las últimas 24 horas (se reinicia a medianoche automáticamente)
  // 2. Ordenar: Cronológicamente (del más antiguo al más reciente de ese periodo)
  // 3. Limitar: Mostrar solo los últimos 'maxMessages' para no saturar la vista
  return messages
    .filter(msg => msg.timestamp.toMillis() >= twentyFourHoursAgo)
    .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())
    .slice(-maxMessages);
};
// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================
const auth = getAuth();

export const login = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  await signOut(auth);
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};


// ==========================================
// TIPOS Y FUNCIONES PARA NOTICIAS Y PODCASTS
// ==========================================
export interface Noticia {
  id: string;
  titulo: string;
  resumen: string;
  autor: string;
  categoria: string;
  imagenUrl: string; // URL de la imagen subida a Firebase Storage
  fecha: Timestamp;  // Fecha de publicación (se usa para filtrar las 24h)
  tenantId: string;
}

export interface Podcast {
  id: string;
  titulo: string;
  youtubeUrl: string;
  youtubeVideoId: string; // ID extraído para obtener la imagen de previsualización
  categoria: string;
  tenantId: string;
  createdAt: Timestamp;
}

// Función auxiliar: Extrae el ID del video de YouTube desde la URL
// Ejemplo: "https://www.youtube.com/watch?v=ABC123" → "ABC123"
export const extraerVideoIdDeYoutube = (url: string): string => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

// Función auxiliar: Obtiene la URL de la imagen de previsualización de YouTube
// Ejemplo: "ABC123" → "https://img.youtube.com/vi/ABC123/maxresdefault.jpg"
export const obtenerImagenPrevisualizacionYoutube = (videoId: string): string => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// ==========================================
// FUNCIONES PARA NOTICIAS (Se filtran por día)
// ==========================================
export const addNoticia = async (noticiaData: Omit<Noticia, 'id' | 'tenantId' | 'fecha'>) => {
  const docRef = await addDoc(collection(db, 'noticias'), {
    ...noticiaData,
    tenantId: TENANT_ID,
    fecha: Timestamp.now()
  });
  return docRef.id;
};

export const getNoticiasDelDia = async (): Promise<Noticia[]> => {
  // 1. Traemos todas las noticias del tenant
  const q = query(collection(db, 'noticias'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const noticias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Noticia));
  
  // 2. Filtramos en el cliente: solo noticias de hoy (desde las 00:00:00 de hoy)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Inicio del día actual
  
  return noticias
    .filter(n => n.fecha.toMillis() >= hoy.getTime())
    .sort((a, b) => b.fecha.toMillis() - a.fecha.toMillis()); // Más recientes primero
};

export const deleteNoticia = async (noticiaId: string) => {
  await deleteDoc(doc(db, 'noticias', noticiaId));
};

// ==========================================
// FUNCIONES PARA PODCASTS (Permanentes)
// ==========================================
export const addPodcast = async (podcastData: { titulo: string; youtubeUrl: string; categoria: string }) => {
  // Extraemos el ID del video automáticamente antes de guardar
  const youtubeVideoId = extraerVideoIdDeYoutube(podcastData.youtubeUrl);
  
  const docRef = await addDoc(collection(db, 'podcasts'), {
    titulo: podcastData.titulo,
    youtubeUrl: podcastData.youtubeUrl,
    youtubeVideoId: youtubeVideoId,
    categoria: podcastData.categoria,
    tenantId: TENANT_ID,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getPodcasts = async (): Promise<Podcast[]> => {
  const q = query(collection(db, 'podcasts'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const podcasts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Podcast));
  
  // Ordenamos en el cliente por fecha de creación (más recientes primero)
  return podcasts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const deletePodcast = async (podcastId: string) => {
  await deleteDoc(doc(db, 'podcasts', podcastId));
};


// ==========================================
// FUNCIONES PARA FIREBASE STORAGE (Imágenes)
// ==========================================
const storage = getStorage();

export const uploadImagenNoticia = async (archivo: File): Promise<string> => {
  // Creamos un nombre único para el archivo usando la fecha actual
  const nombreArchivo = `noticias/${Date.now()}_${archivo.name}`;
  const storageRef = ref(storage, nombreArchivo);
  
  // Subimos el archivo
  const snapshot = await uploadBytes(storageRef, archivo);
  
  // Obtenemos y retornamos la URL pública de descarga
  const urlDescarga = await getDownloadURL(snapshot.ref);
  return urlDescarga;
};

// ==========================================
// FUNCIONES PARA CONFIGURACIÓN DE TV (YOUTUBE)
// ==========================================
export const getTvConfig = async (): Promise<string> => {
  try {
    const docRef = doc(db, 'configuracion', 'tv_en_vivo');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().youtubeUrl || '';
    }
    return '';
  } catch (error) {
    console.error('Error al obtener config de TV:', error);
    return '';
  }
};

export const updateTvUrl = async (youtubeUrl: string) => {
  const docRef = doc(db, 'configuracion', 'tv_en_vivo');
  await setDoc(docRef, { 
    youtubeUrl, 
    updatedAt: Timestamp.now() 
  }, { merge: true });
};

// ==========================================
// FUNCIONES PARA PUBLICIDAD
// ==========================================
export interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  empresa: string;
  imagenUrl: string;
  enlaceUrl: string;
  activo: boolean;
  tenantId: string;
  createdAt: Timestamp;
}

export const addAnuncio = async (anuncioData: Omit<Anuncio, 'id' | 'tenantId' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'anuncios'), {
    ...anuncioData,
    tenantId: TENANT_ID,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getAnuncios = async (): Promise<Anuncio[]> => {
  const q = query(collection(db, 'anuncios'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const anuncios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Anuncio));
  
  // Filtrar solo los activos y ordenar por fecha de creación (más recientes primero)
  return anuncios
    .filter(a => a.activo)
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const updateAnuncio = async (anuncioId: string, data: Partial<Anuncio>) => {
  await updateDoc(doc(db, 'anuncios', anuncioId), data);
};

export const deleteAnuncio = async (anuncioId: string) => {
  await deleteDoc(doc(db, 'anuncios', anuncioId));
};

export const uploadImagenAnuncio = async (archivo: File): Promise<string> => {
  const nombreArchivo = `anuncios/${Date.now()}_${archivo.name}`;
  const storageRef = ref(storage, nombreArchivo);
  const snapshot = await uploadBytes(storageRef, archivo);
  const urlDescarga = await getDownloadURL(snapshot.ref);
  return urlDescarga;
};