export interface Service {
  id: string;
  category: 'Audio' | 'Video' | 'Streaming' | 'Producción' | 'Radio/Podcast';
  title: string;
  description: string;
  equipment: string[];
  image: string;
}

export const servicesData: Service[] = [
  // 🎙️ AUDIO (1-6)
  {
    id: 's1', category: 'Audio', title: 'Alquiler de Consolas de Sonido',
    description: 'Consolas de mezcla profesionales analogas y digitales para eventos de cualquier escala.',
    equipment: ['Midas M32', 'Yamaha TF5', 'Allen & Heath QU-16', 'Cables y conectores XLR'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'
  },
  {
    id: 's2', category: 'Audio', title: 'Alquiler de Micrófonos Profesionales',
    description: 'Micrófonos de alta gama para voz, instrumentos y captación ambiental.',
    equipment: ['Shure SM58', 'Sennheiser EW 100 G4 (Inalámbricos)', 'Rode NTG-3 (Shotgun)', 'Soportes y bases'],
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800'
  },
  {
    id: 's3', category: 'Audio', title: 'Alquiler de Sistemas de Parlantes',
    description: 'Sistemas de sonido line array y point source para cobertura total.',
    equipment: ['JBL PRX800', 'QSC K12.2', 'Subwoofers 18"', 'Monitores de piso'],
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800'
  },
  {
    id: 's4', category: 'Audio', title: 'Grabación de Audio en Locación',
    description: 'Captación de audio profesional en exteriores o estudios temporales.',
    equipment: ['Grabadora Zoom F8n', 'Micrófonos de ambiente', 'Aislantes acústicos portátiles'],
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800'
  },
  {
    id: 's5', category: 'Audio', title: 'Producción de Cuñas y Radios Comerciales',
    description: 'Creación de spots publicitarios con voz profesional y producción musical.',
    equipment: ['Estudio de postproducción', 'Bancos de sonido licenciados', 'Voces en off profesionales'],
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'
  },
  {
    id: 's6', category: 'Audio', title: 'Edición y Masterización de Audio',
    description: 'Procesamiento final de pistas para lograr calidad de broadcast.',
    equipment: ['Pro Tools', 'Plugins Waves/UAD', 'Monitores de referencia'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'
  },

  // 📹 VIDEO (7-12)
  {
    id: 's7', category: 'Video', title: 'Alquiler de Cámaras Profesionales 4K',
    description: 'Cámaras cinema y DSLR para grabación de alta resolución.',
    equipment: ['Sony A7S III', 'Blackmagic Pocket 6K', 'Lentes G Master', 'Tarjetas CFexpress'],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
  },
  {
    id: 's8', category: 'Video', title: 'Alquiler de Drones para Tomas Aéreas',
    description: 'Captura de video y foto aérea con pilotos certificados.',
    equipment: ['DJI Mavic 3 Pro', 'DJI Inspire 2', 'Filtros ND', 'Baterías de vuelo extendidas'],
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'
  },
  {
    id: 's9', category: 'Video', title: 'Alquiler de Iluminación Profesional',
    description: 'Esquemas de iluminación para video, fotografía y escenarios.',
    equipment: ['Aputure 300d II', 'Paneles LED RGB', 'Softbox y rejillas', 'Trípodes C-Stand'],
    image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800'
  },
  {
    id: 's10', category: 'Video', title: 'Grabación de Eventos (Bodas, Conciertos)',
    description: 'Cobertura multicámara con operadores profesionales.',
    equipment: ['3 Cámaras 4K', 'Mezclador de video ATEM', 'Grabación en SSD'],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'
  },
  {
    id: 's11', category: 'Video', title: 'Edición y Postproducción de Video',
    description: 'Montaje, corrección de color y efectos visuales.',
    equipment: ['Adobe Premiere Pro', 'DaVinci Resolve Studio', 'After Effects'],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'
  },
  {
    id: 's12', category: 'Video', title: 'Producción de Contenido Audiovisual',
    description: 'Videos corporativos, testimoniales y promocionales.',
    equipment: ['Equipo completo de cine', 'Guionistas', 'Directores de arte'],
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800'
  },

  // 📡 STREAMING (13-16)
  {
    id: 's13', category: 'Streaming', title: 'Streaming Multiredes Simultáneo',
    description: 'Transmisión en vivo a YouTube, Facebook, Instagram y TikTok al mismo tiempo.',
    equipment: ['vMix o OBS Studio Pro', 'Codificador hardware', 'Bonding de internet'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800'
  },
  {
    id: 's14', category: 'Streaming', title: 'Transmisión Profesional de Eventos',
    description: 'Producción en vivo con gráficos, cámaras múltiples y audio mezclado.',
    equipment: ['Switcher ATEM Mini Extreme', 'Cámaras PTZ', 'Comms para equipo'],
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800'
  },
  {
    id: 's15', category: 'Streaming', title: 'Unidades Móviles de Transmisión',
    description: 'Estudio de TV portátil para cubrir eventos fuera de la planta.',
    equipment: ['Van equipada', 'Generador eléctrico', 'Enlace de microondas/4G'],
    image: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=800'
  },
  {
    id: 's16', category: 'Streaming', title: 'Producción de Transmisiones Deportivas',
    description: 'Cobertura de partidos con cámaras de acción, marcadores y repetición.',
    equipment: ['Cámaras de largo alcance', 'Software de gráficos deportivos', 'Slow motion'],
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800'
  },

  // 🎬 PRODUCCIÓN INTEGRAL (17-22)
  {
    id: 's17', category: 'Producción', title: 'Producción Integral de Eventos',
    description: 'Nos encargamos de todo: audio, video, iluminación y logística.',
    equipment: ['Equipo completo de las 3 áreas', 'Coordinador de producción', 'Logística'],
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'
  },
  {
    id: 's18', category: 'Producción', title: 'Cobertura Completa (Foto + Video + Audio)',
    description: 'Paquete todo en uno para no perder ningún detalle de su evento.',
    equipment: ['Fotógrafos', 'Videógrafos', 'Ingeniero de audio'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'
  },
  {
    id: 's19', category: 'Producción', title: 'Dirección Técnica de Eventos',
    description: 'Supervisión profesional de todos los aspectos técnicos del evento.',
    equipment: ['Director técnico certificado', 'Planos de planta', 'Checklists de seguridad'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  },
  {
    id: 's20', category: 'Producción', title: 'Creación de Contenido para Redes Sociales',
    description: 'Clips, reels y fotos optimizadas para Instagram, TikTok y Facebook.',
    equipment: ['Cámaras verticales', 'Luces de aro', 'Edición en móvil/PC'],
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800'
  },
  {
    id: 's21', category: 'Producción', title: 'Gestión y Community Management',
    description: 'Administración profesional de sus redes durante el evento.',
    equipment: ['Equipo de redacción', 'Herramientas de programación', 'Monitoreo en vivo'],
    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800'
  },
  {
    id: 's22', category: 'Producción', title: 'Diseño Gráfico y Branding para Eventos',
    description: 'Piezas visuales, pantallas LED y material impreso personalizado.',
    equipment: ['Diseñadores senior', 'Software Adobe Creative Cloud', 'Impresión de alta calidad'],
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800'
  },

  // 🎵 RADIO Y PODCAST (23-28)
  {
    id: 's23', category: 'Radio/Podcast', title: 'Producción de Podcasts Profesionales',
    description: 'Grabación, edición y publicación de su podcast con calidad de estudio.',
    equipment: ['Micrófonos Shure SM7B', 'Interfaz Focusrite', 'Cabina insonorizada'],
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800'
  },
  {
    id: 's24', category: 'Radio/Podcast', title: 'Alquiler de Estudio de Grabación',
    description: 'Espacio profesional equipado listo para usar por hora o día.',
    equipment: ['Consola digital', 'Monitores de estudio', 'Aire acondicionado', 'Wifi'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'
  },
  {
    id: 's25', category: 'Radio/Podcast', title: 'Locución Profesional y Voice Over',
    description: 'Voces talentosas para comerciales, documentales y narraciones.',
    equipment: ['Cabina de voz', 'Procesadores de voz', 'Catálogo de locutores'],
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800'
  },
  {
    id: 's26', category: 'Radio/Podcast', title: 'Asesoría en Creación de Emisoras Online',
    description: 'Consultoría técnica y legal para lanzar su propia estación de radio.',
    equipment: ['Servidores de streaming', 'Software de automatización', 'Plan de negocios'],
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'
  },
  {
    id: 's27', category: 'Radio/Podcast', title: 'Mantenimiento y Configuración de Equipos',
    description: 'Servicio técnico preventivo y correctivo para sus equipos de medios.',
    equipment: ['Herramientas de diagnóstico', 'Repuestos originales', 'Técnicos certificados'],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'
  },
  {
    id: 's28', category: 'Radio/Podcast', title: 'Capacitación en Operación de Equipos',
    description: 'Cursos prácticos para su personal en manejo de consolas, cámaras y streaming.',
    equipment: ['Material didáctico', 'Equipos de práctica', 'Instructores expertos'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'
  }
];