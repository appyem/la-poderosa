// ============================================
// MOCK DATA - LA PODEROSA MVP
// Estos datos serán reemplazados por Firestore en Fase 5
// ============================================

export const mockPrograms = [
  {
    id: 'prog-1',
    title: 'La Poderosa en VIVO',
    host: 'Carlos Martínez',
    time: '06:00 - 10:00',
    category: 'Magazine',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400',
    isLive: true,
    listeners: 1247,
  },
  {
    id: 'prog-2',
    title: 'Ritmo Tropical',
    host: 'María Fernanda López',
    time: '10:00 - 13:00',
    category: 'Música',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    isLive: false,
    listeners: 0,
  },
  {
    id: 'prog-3',
    title: 'Noticias del Mediodía',
    host: 'Equipo Periodístico',
    time: '13:00 - 14:00',
    category: 'Noticias',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400',
    isLive: false,
    listeners: 0,
  },
  {
    id: 'prog-4',
    title: 'Tarde Deportiva',
    host: 'Andrés Ruiz',
    time: '14:00 - 16:00',
    category: 'Deportes',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
    isLive: false,
    listeners: 0,
  },
  {
    id: 'prog-5',
    title: 'Noche de Rock',
    host: 'Laura Gómez',
    time: '20:00 - 23:00',
    category: 'Música',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    isLive: false,
    listeners: 0,
  },
];

export const mockPodcasts = [
  {
    id: 'pod-1',
    title: 'Historias de la Ciudad',
    author: 'Carlos Martínez',
    episodes: 24,
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400',
    category: 'Documental',
  },
  {
    id: 'pod-2',
    title: 'Mesa Política',
    author: 'Equipo Periodístico',
    episodes: 52,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
    category: 'Política',
  },
  {
    id: 'pod-3',
    title: 'Ciencia y Futuro',
    author: 'Dra. Patricia Solano',
    episodes: 18,
    duration: '35 min',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    category: 'Ciencia',
  },
  {
    id: 'pod-4',
    title: 'Cocina Poderosa',
    author: 'Chef Roberto Vargas',
    episodes: 30,
    duration: '25 min',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    category: 'Lifestyle',
  },
];

export const mockNews = [
  {
    id: 'news-1',
    title: 'Gran concierto marca el inicio del festival de verano',
    summary: 'Más de 20.000 personas asistieron al evento inaugural que contó con artistas internacionales.',
    author: 'Redacción LA PODEROSA',
    date: '2026-07-15',
    category: 'Cultura',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    isFeatured: true,
    readTime: '4 min',
  },
  {
    id: 'news-2',
    title: 'Nuevas inversiones transforman el sector tecnológico regional',
    summary: 'Empresas multinacionales anuncian la apertura de centros de desarrollo en la ciudad.',
    author: 'Andrés Ruiz',
    date: '2026-07-14',
    category: 'Economía',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    isFeatured: false,
    readTime: '3 min',
  },
  {
    id: 'news-3',
    title: 'Equipo local clasifica a la final del campeonato nacional',
    summary: 'Tras una victoria histórica, el equipo disputará el título el próximo fin de semana.',
    author: 'María Fernanda López',
    date: '2026-07-14',
    category: 'Deportes',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
    isFeatured: false,
    readTime: '2 min',
  },
];

export const mockEvents = [
  {
    id: 'evt-1',
    title: 'Festival de Verano LA PODEROSA',
    date: '2026-08-15',
    time: '18:00',
    location: 'Parque Central',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    attendees: 3420,
    price: 'Entrada libre',
  },
  {
    id: 'evt-2',
    title: 'Concierto Acústico en Vivo',
    date: '2026-07-28',
    time: '20:00',
    location: 'Teatro Municipal',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    attendees: 850,
    price: '$25.000',
  },
];

export const mockGalleries = [
  {
    id: 'gal-1',
    title: 'Cobertura Festival 2025',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600',
    photos: 48,
    category: 'Eventos',
  },
  {
    id: 'gal-2',
    title: 'Detrás de Cámaras',
    cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600',
    photos: 24,
    category: 'Estudio',
  },
  {
    id: 'gal-3',
    title: 'Conciertos del Mes',
    cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
    photos: 36,
    category: 'Música',
  },
];

export const mockSchedule = [
  { day: 'Lunes', programs: ['La Poderosa en VIVO', 'Ritmo Tropical', 'Noticias del Mediodía', 'Tarde Deportiva', 'Noche de Rock'] },
  { day: 'Martes', programs: ['La Poderosa en VIVO', 'Ritmo Tropical', 'Noticias del Mediodía', 'Tarde Deportiva', 'Noche de Rock'] },
  { day: 'Miércoles', programs: ['La Poderosa en VIVO', 'Ritmo Tropical', 'Noticias del Mediodía', 'Tarde Deportiva', 'Noche de Rock'] },
  { day: 'Jueves', programs: ['La Poderosa en VIVO', 'Ritmo Tropical', 'Noticias del Mediodía', 'Tarde Deportiva', 'Noche de Rock'] },
  { day: 'Viernes', programs: ['La Poderosa en VIVO', 'Ritmo Tropical', 'Noticias del Mediodía', 'Tarde Deportiva', 'Noche de Rock'] },
  { day: 'Sábado', programs: ['Mañana Familiar', 'Sábado Musical', 'Deportes Total', 'Fiesta Nocturna'] },
  { day: 'Domingo', programs: ['Domingo Relax', 'Clásicos Inmortales', 'Revista Dominical', 'Cierre Musical'] },
];

export const mockSponsors = [
  { id: 'sp-1', name: 'Banco Nacional', logo: '🏦' },
  { id: 'sp-2', name: 'Telecomunicaciones Plus', logo: '📡' },
  { id: 'sp-3', name: 'Aerolíneas del País', logo: '✈️' },
  { id: 'sp-4', name: 'Seguros Confianza', logo: '🛡️' },
  { id: 'sp-5', name: 'Autos Premium', logo: '🚗' },
  { id: 'sp-6', name: 'Supermercados del Pueblo', logo: '🛒' },
];