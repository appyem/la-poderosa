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
  updateDoc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db, storage } from './config';
import type { Program, News, Tenant } from '../types/models';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getMessaging, getToken } from 'firebase/messaging';
import app from './config';

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
  imagenUrl?: string;
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

export const updateProgramaRadio = async (programaId: string, data: Partial<ProgramaRadio>) => {
  await updateDoc(doc(db, 'programas_radio', programaId), data);
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
  const q = query(collection(db, 'chat'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
  
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
  
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
  imagenUrl: string;
  fecha: Timestamp;
  fechaExpiracion?: Timestamp;
  tenantId: string;
}

export interface Podcast {
  id: string;
  titulo: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  categoria: string;
  imagenUrl: string;
  tenantId: string;
  createdAt: Timestamp;
}

export const extraerVideoIdDeYoutube = (url: string): string => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

export const obtenerImagenPrevisualizacionYoutube = (videoId: string): string => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// ==========================================
// FUNCIONES PARA NOTICIAS
// ==========================================
export const addNoticia = async (noticiaData: Omit<Noticia, 'id' | 'tenantId' | 'fecha'>) => {
  const docRef = await addDoc(collection(db, 'noticias'), {
    ...noticiaData,
    tenantId: TENANT_ID,
    fecha: Timestamp.now()
  });
  return docRef.id;
};

export const getNoticiasActivas = async (): Promise<Noticia[]> => {
  const q = query(collection(db, 'noticias'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const noticias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Noticia));
  
  const ahora = Date.now();
  
  return noticias
    .filter(n => {
      if (!n.fechaExpiracion) return true;
      return n.fechaExpiracion.toMillis() > ahora;
    })
    .sort((a, b) => b.fecha.toMillis() - a.fecha.toMillis());
};

export const getAllNoticias = async (): Promise<Noticia[]> => {
  const q = query(collection(db, 'noticias'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const noticias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Noticia));
  
  return noticias.sort((a, b) => b.fecha.toMillis() - a.fecha.toMillis());
};

export const deleteNoticia = async (noticiaId: string) => {
  await deleteDoc(doc(db, 'noticias', noticiaId));
};

// ==========================================
// FUNCIONES PARA PODCASTS
// ==========================================
export const addPodcast = async (podcastData: { titulo: string; youtubeUrl: string; categoria: string; imagenUrl: string }) => {
  const youtubeVideoId = extraerVideoIdDeYoutube(podcastData.youtubeUrl);
  
  const docRef = await addDoc(collection(db, 'podcasts'), {
    titulo: podcastData.titulo,
    youtubeUrl: podcastData.youtubeUrl,
    youtubeVideoId: youtubeVideoId,
    categoria: podcastData.categoria,
    imagenUrl: podcastData.imagenUrl,
    tenantId: TENANT_ID,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getPodcasts = async (): Promise<Podcast[]> => {
  const q = query(collection(db, 'podcasts'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const podcasts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Podcast));
  return podcasts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const deletePodcast = async (podcastId: string) => {
  await deleteDoc(doc(db, 'podcasts', podcastId));
};

// ==========================================
// FUNCIONES PARA FIREBASE STORAGE (Imágenes)
// ==========================================
export const uploadImagenNoticia = async (archivo: File): Promise<string> => {
  const nombreArchivo = `noticias/${Date.now()}_${archivo.name}`;
  const storageRef = ref(storage, nombreArchivo);
  const snapshot = await uploadBytes(storageRef, archivo);
  const urlDescarga = await getDownloadURL(snapshot.ref);
  return urlDescarga;
};

export const uploadImagenPodcast = async (archivo: File): Promise<string> => {
  const nombreArchivo = `podcasts/${Date.now()}_${archivo.name}`;
  const storageRef = ref(storage, nombreArchivo);
  const snapshot = await uploadBytes(storageRef, archivo);
  const urlDescarga = await getDownloadURL(snapshot.ref);
  return urlDescarga;
};

export const uploadImagenPrograma = async (archivo: File): Promise<string> => {
  const nombreArchivo = `programas/${Date.now()}_${archivo.name}`;
  const storageRef = ref(storage, nombreArchivo);
  const snapshot = await uploadBytes(storageRef, archivo);
  const urlDescarga = await getDownloadURL(snapshot.ref);
  return urlDescarga;
};

// ==========================================
// FUNCIONES PARA CONFIGURACIÓN DE TV
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
// FUNCIONES PARA PUBLICIDAD / ANUNCIOS
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

// ==========================================
// FUNCIONES PARA ANALÍTICAS DE INSTALACIONES PWA
// ==========================================
export interface Instalacion {
  id: string;
  fecha: Timestamp;
  dispositivo: string;
  navegador: string;
  tenantId: string;
}

export const addInstalacion = async (dispositivo: string, navegador: string) => {
  await addDoc(collection(db, 'instalaciones'), {
    fecha: Timestamp.now(),
    dispositivo,
    navegador,
    tenantId: TENANT_ID
  });
};

export const getEstadisticasInstalaciones = async (): Promise<Instalacion[]> => {
  const q = query(collection(db, 'instalaciones'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Instalacion))
    .sort((a, b) => b.fecha.toMillis() - a.fecha.toMillis());
};

// ==========================================
// FUNCIONES PARA ALIADOS
// ==========================================
export interface Aliado {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  enlaceUrl: string;
  tenantId: string;
  createdAt: Timestamp;
}

export const addAliado = async (aliadoData: Omit<Aliado, 'id' | 'tenantId' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'aliados'), {
    ...aliadoData,
    tenantId: TENANT_ID,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getAliados = async (): Promise<Aliado[]> => {
  const q = query(collection(db, 'aliados'), where('tenantId', '==', TENANT_ID));
  const snapshot = await getDocs(q);
  const aliados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Aliado));
  return aliados.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const updateAliado = async (aliadoId: string, data: Partial<Aliado>) => {
  await updateDoc(doc(db, 'aliados', aliadoId), data);
};

export const deleteAliado = async (aliadoId: string) => {
  await deleteDoc(doc(db, 'aliados', aliadoId));
};

export const uploadImagenAliado = async (archivo: File): Promise<string> => {
  const nombreArchivo = `aliados/${Date.now()}_${archivo.name}`;
  const storageRef = ref(storage, nombreArchivo);
  const snapshot = await uploadBytes(storageRef, archivo);
  const urlDescarga = await getDownloadURL(snapshot.ref);
  return urlDescarga;
};

// ==========================================
// FUNCIONES PARA NOTIFICACIONES PUSH (FCM)
// ==========================================
const messaging = getMessaging(app);
const VAPID_KEY = 'BC4NfyTTMfvZtsShIsbXgkVXvaurDHopulWwD9uv7yzQ9WrNEYNlhxrMr89YniUrrUSdacHJWxpjPVz-PZqZdhM';

export const solicitarPermisoNotificaciones = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (currentToken) {
        await addDoc(collection(db, 'tokens_notificaciones'), {
          token: currentToken,
          fecha: Timestamp.now(),
          tenantId: TENANT_ID
        });
        console.log('✅ Token de notificación guardado exitosamente.');
        return true;
      } else {
        console.log('No se pudo generar el token de registro.');
        return false;
      }
    } else {
      console.log('El usuario denegó el permiso de notificaciones.');
      return false;
    }
  } catch (error) {
    console.error('Error al obtener permiso de notificación:', error);
    return false;
  }
};

// ==========================================
// ✅ FUNCIONES PARA EL CARRUSEL DE PUBLICIDAD
// ==========================================
export interface Publicidad {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  link: string;
  activa: boolean;
  tenantId: string;
}

export const getPublicidadesActivas = async (): Promise<Publicidad[]> => {
  const q = query(
    collection(db, 'anuncios'), 
    where('tenantId', '==', TENANT_ID),
    where('activo', '==', true)
  );
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log('⚠️ No hay publicidad activa en la base de datos.');
    return [];
  }
  
  // ✅ CORREGIDO: Sin 'any'. Usamos la interfaz 'Anuncio' que ya está definida en este archivo.
  return snapshot.docs.map(doc => {
    const data = doc.data() as Anuncio; 
    
    return { 
      id: doc.id, 
      titulo: data.titulo || 'Publicidad',
      descripcion: data.descripcion || data.empresa || '',
      imagenUrl: data.imagenUrl,
      link: data.enlaceUrl || '',
      activa: data.activo,
      tenantId: data.tenantId
    };
  });
};

// ==========================================
// 🛒 TIENDA VIRTUAL "LA PODEROSA SHOP"
// FASE 1: Definición de tipos de datos
// ==========================================

// ------------------------------------------
// CATEGORÍAS DE PRODUCTOS
// ------------------------------------------
export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string; // Emoji o nombre de icono (ej: "☕" o "coffee")
  imagenUrl?: string; // Imagen de la categoría (opcional)
  padreId?: string; // Para subcategorías. Si es undefined, es categoría principal
  orden: number; // Para ordenar las categorías en el menú
  activo: boolean;
  tenantId: string;
  createdAt: Timestamp;
}

// ------------------------------------------
// PRODUCTOS
// ------------------------------------------
export interface Producto {
  id: string;
  titulo: string;
  descripcion: string;
  descripcionCorta: string; // Máximo 150 caracteres para tarjetas
  precio: number; // Precio actual en COP
  precioAnterior?: number; // Para mostrar ofertas (precio tachado)
  stock: number; // Cantidad disponible
  sku?: string; // Código interno del producto (opcional)
  categoriaId: string;
  imagenes: string[]; // Array de URLs de imágenes (mínimo 1, máximo 5)
  destacado: boolean; // Aparece en la sección "Destacados"
  enOferta: boolean; // Aparece en la sección "Ofertas"
  activo: boolean; // Disponible para comprar
  fechaOfertaFin?: Timestamp; // Si tiene oferta, cuándo termina
  pesoKg?: number; // Para calcular envíos futuros
  tenantId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ------------------------------------------
// CLIENTES (Registro obligatorio tipo Rappi)
// ------------------------------------------
export interface DireccionCliente {
  id: string;
  etiqueta: string; // "Casa", "Trabajo", "Finca", etc.
  direccion: string;
  barrio?: string;
  ciudad: string; // Por ahora solo ciudades de Caldas
  departamento: string;
  telefono: string;
  esPrincipal: boolean;
}

export interface Cliente {
  id: string; // Coincide con el UID de Firebase Auth
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documentoTipo: 'cc' | 'ce' | 'nit'; // Cédula, Cédula Extranjería, NIT
  documentoNumero: string;
  direcciones: DireccionCliente[];
  fechaNacimiento?: string; // Formato YYYY-MM-DD (opcional)
  aceptaTerminos: boolean;
  tenantId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ------------------------------------------
// PEDIDOS
// ------------------------------------------
export type EstadoPedido = 
  | 'pendiente'      // Creado pero no pagado
  | 'pagado'         // Pago confirmado por ePayco
  | 'en_preparacion' // Admin está preparando el pedido
  | 'enviado'        // En camino al cliente
  | 'entregado'      // Entregado al cliente
  | 'cancelado';     // Cancelado por cliente o admin

export type MetodoPago = 'pse' | 'tarjeta' | 'nequi' | 'daviplata';

export interface ItemPedido {
  productoId: string;
  titulo: string; // Snapshot del título al momento de comprar
  precio: number; // Snapshot del precio al momento de comprar
  cantidad: number;
  imagenUrl: string; // Primera imagen del producto
  subtotal: number; // precio * cantidad
}

export interface Pedido {
  id: string;
  clienteId: string;
  clienteNombre: string; // Snapshot para evitar joins
  clienteEmail: string;
  clienteTelefono: string;
  items: ItemPedido[];
  subtotal: number; // Suma de items
  costoEnvio: number; // Envío local Caldas
  descuento: number; // Si aplicó cupón
  total: number; // subtotal + envio - descuento
  cuponCodigo?: string; // Código usado (si aplica)
  estado: EstadoPedido;
  metodoPago: MetodoPago;
  transaccionId?: string; // ID de la transacción en ePayco
  fechaPago?: Timestamp; // Cuándo se confirmó el pago
  direccionEnvio: DireccionCliente; // Snapshot de la dirección
  notas?: string; // Notas del cliente para el envío
  numeroGuia?: string; // Número de guía del transportador
  tenantId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ------------------------------------------
// CUPONES DE DESCUENTO
// ------------------------------------------
export type TipoCupon = 'porcentaje' | 'valor_fijo';

export interface CuponDescuento {
  id: string;
  codigo: string; // Ej: "PODEROSA10" (siempre en mayúsculas)
  tipo: TipoCupon;
  valor: number; // Si es porcentaje: 10 (equivale a 10%). Si es valor: 10000 (COP)
  valorMinimoCompra: number; // Compra mínima para aplicar el cupón
  usosMaximos: number; // Cuántas veces se puede usar en total
  usosActuales: number; // Cuántas veces se ha usado
  usosPorCliente: number; // Cuántas veces puede usarlo un mismo cliente
  fechaInicio: Timestamp;
  fechaExpiracion: Timestamp;
  activo: boolean;
  tenantId: string;
  createdAt: Timestamp;
}

// ------------------------------------------
// CONFIGURACIÓN DE LA TIENDA (Documento único)
// ------------------------------------------
export interface ConfiguracionTienda {
  id: string; // Siempre será 'config_tienda'
  nombreTienda: string;
  costoEnvioLocal: number; // Envío dentro de Caldas
  envioGratisDesde: number; // Compra mínima para envío gratis
  ciudadesDisponibles: string[]; // Ciudades de Caldas donde se entrega
  whatsappPedidos: string; // WhatsApp para confirmar pedidos
  emailPedidos: string; // Email para notificaciones
  epaycoPublicKey?: string; // Llave pública de ePayco
  tenantId: string;
  updatedAt: Timestamp;
}

// ==========================================
// FUNCIONES PARA CATEGORÍAS DE LA TIENDA
// ==========================================

/**
 * Crea una nueva categoría o subcategoría
 * @param categoriaData Datos de la categoría (sin id, tenantId ni createdAt)
 * @returns El ID del documento creado
 */
export const addCategoria = async (
  categoriaData: Omit<Categoria, 'id' | 'tenantId' | 'createdAt'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, 'categorias'), {
    ...categoriaData,
    tenantId: TENANT_ID,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

/**
 * Obtiene TODAS las categorías (para el panel administrativo)
 * Incluye activas e inactivas, ordenadas por el campo 'orden'
 */
export const getCategorias = async (): Promise<Categoria[]> => {
  const q = query(
    collection(db, 'categorias'), 
    where('tenantId', '==', TENANT_ID)
  );
  const snapshot = await getDocs(q);
  const categorias = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Categoria)
  );
  
  // Ordenar por campo 'orden' ascendente, luego por fecha de creación
  return categorias.sort((a, b) => 
    a.orden - b.orden || a.createdAt.toMillis() - b.createdAt.toMillis()
  );
};

/**
 * Obtiene solo las categorías ACTIVAS (para la tienda pública)
 * Ordenadas por el campo 'orden'
 */
export const getCategoriasActivas = async (): Promise<Categoria[]> => {
  const q = query(
    collection(db, 'categorias'), 
    where('tenantId', '==', TENANT_ID),
    where('activo', '==', true)
  );
  const snapshot = await getDocs(q);
  const categorias = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Categoria)
  );
  
  return categorias.sort((a, b) => a.orden - b.orden);
};

/**
 * Obtiene las subcategorías de una categoría padre específica
 * @param padreId ID de la categoría padre
 */
export const getSubcategorias = async (padreId: string): Promise<Categoria[]> => {
  const q = query(
    collection(db, 'categorias'), 
    where('tenantId', '==', TENANT_ID),
    where('padreId', '==', padreId),
    where('activo', '==', true)
  );
  const snapshot = await getDocs(q);
  const categorias = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Categoria)
  );
  
  return categorias.sort((a, b) => a.orden - b.orden);
};

/**
 * Actualiza una categoría existente
 * @param categoriaId ID de la categoría a actualizar
 * @param data Campos a actualizar (puede ser uno o varios)
 */
export const updateCategoria = async (
  categoriaId: string, 
  data: Partial<Categoria>
): Promise<void> => {
  await updateDoc(doc(db, 'categorias', categoriaId), data);
};

/**
 * Elimina una categoría permanentemente
 * ⚠️ PRECAUCIÓN: También debería verificar si hay productos asociados antes de eliminar
 * @param categoriaId ID de la categoría a eliminar
 */
export const deleteCategoria = async (categoriaId: string): Promise<void> => {
  await deleteDoc(doc(db, 'categorias', categoriaId));
};

/**
 * Sube una imagen de categoría a Firebase Storage
 * @param archivo Archivo de imagen seleccionado
 * @returns URL pública de descarga de la imagen
 */
export const uploadImagenCategoria = async (archivo: File): Promise<string> => {
  const nombreArchivo = `categorias/${Date.now()}_${archivo.name}`;
  const storageRef = ref(storage, nombreArchivo);
  const snapshot = await uploadBytes(storageRef, archivo);
  const urlDescarga = await getDownloadURL(snapshot.ref);
  return urlDescarga;
};

// ==========================================
// FUNCIONES PARA PRODUCTOS DE LA TIENDA
// ==========================================

/**
 * Crea un nuevo producto en la tienda
 */
export const addProducto = async (
  productoData: Omit<Producto, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'productos'), {
    ...productoData,
    tenantId: TENANT_ID,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

/**
 * Obtiene TODOS los productos (para el panel administrativo)
 * Incluye activos e inactivos, ordenados por fecha de creación (más recientes primero)
 */
export const getProductos = async (): Promise<Producto[]> => {
  const q = query(
    collection(db, 'productos'),
    where('tenantId', '==', TENANT_ID)
  );
  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Producto)
  );
  return productos.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

/**
 * Obtiene solo los productos ACTIVOS (para la tienda pública)
 * Filtra también los que tienen stock > 0 o permite agotados
 */
export const getProductosActivos = async (): Promise<Producto[]> => {
  const q = query(
    collection(db, 'productos'),
    where('tenantId', '==', TENANT_ID),
    where('activo', '==', true)
  );
  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Producto)
  );
  return productos.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

/**
 * Obtiene los productos destacados (para la sección "Destacados")
 */
export const getProductosDestacados = async (): Promise<Producto[]> => {
  const q = query(
    collection(db, 'productos'),
    where('tenantId', '==', TENANT_ID),
    where('activo', '==', true),
    where('destacado', '==', true)
  );
  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Producto)
  );
  return productos.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()).slice(0, 8);
};

/**
 * Obtiene productos de una categoría específica
 */
export const getProductosPorCategoria = async (categoriaId: string): Promise<Producto[]> => {
  const q = query(
    collection(db, 'productos'),
    where('tenantId', '==', TENANT_ID),
    where('activo', '==', true),
    where('categoriaId', '==', categoriaId)
  );
  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Producto)
  );
  return productos.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

/**
 * Obtiene un producto por su ID (para la página de detalle)
 */
export const getProductoPorId = async (productoId: string): Promise<Producto | null> => {
  const docSnap = await getDoc(doc(db, 'productos', productoId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Producto;
};

/**
 * Actualiza un producto existente
 */
export const updateProducto = async (
  productoId: string,
  data: Partial<Producto>
): Promise<void> => {
  await updateDoc(doc(db, 'productos', productoId), {
    ...data,
    updatedAt: Timestamp.now()
  });
};

/**
 * Elimina un producto permanentemente
 */
export const deleteProducto = async (productoId: string): Promise<void> => {
  await deleteDoc(doc(db, 'productos', productoId));
};

/**
 * Sube una imagen de producto a Firebase Storage
 * Cada producto puede tener hasta 5 imágenes
 */
export const uploadImagenProducto = async (archivo: File): Promise<string> => {
  const nombreArchivo = `productos/${Date.now()}_${archivo.name}`;
  const storageRef = ref(storage, nombreArchivo);
  const snapshot = await uploadBytes(storageRef, archivo);
  const urlDescarga = await getDownloadURL(snapshot.ref);
  return urlDescarga;
};

// ==========================================
// FUNCIONES PARA PEDIDOS DE LA TIENDA
// ==========================================

/**
 * Crea un nuevo pedido en Firebase (estado inicial: 'pendiente')
 */
export const addPedido = async (
  pedidoData: Omit<Pedido, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'pedidos'), {
    ...pedidoData,
    tenantId: TENANT_ID,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};