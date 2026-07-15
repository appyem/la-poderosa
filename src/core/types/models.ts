export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  isActive: boolean;
}

export interface Program {
  id: string;
  tenantId: string;
  title: string;
  host: string;
  startTime: string;
  endTime: string;
  category: string;
  imageUrl: string;
  isLive: boolean;
  listeners: number;
}

export interface News {
  id: string;
  tenantId: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
  readTime: string;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'producer' | 'host' | 'user';
  createdAt: string;
}
