import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  addDoc, 
  deleteDoc, 
  doc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { Program, News, Tenant } from '../types/models';

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