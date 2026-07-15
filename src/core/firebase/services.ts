import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './config';
import type { Program, News, Tenant } from '../types/models';

const TENANT_ID = 'la-poderosa-4b6ab'; 

export const getLivePrograms = async () => {
  const q = query(collection(db, 'programs'), where('tenantId', '==', TENANT_ID), where('isLive', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Program[];
};

export const getAllPrograms = async () => {
  const q = query(collection(db, 'programs'), where('tenantId', '==', TENANT_ID), orderBy('startTime', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Program[];
};

export const getFeaturedNews = async () => {
  const q = query(collection(db, 'news'), where('tenantId', '==', TENANT_ID), where('isFeatured', '==', true), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as News[];
};

export const getRecentNews = async () => {
  const q = query(collection(db, 'news'), where('tenantId', '==', TENANT_ID), orderBy('publishedAt', 'desc'), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as News[];
};

export const getTenantConfig = async (slug: string) => {
  const q = query(collection(db, 'tenants'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Tenant;
};
