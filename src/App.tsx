import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SplashScreen } from './shared/components/SplashScreen';
import { MainLayout } from './shared/layouts/MainLayout';
import { AdminLayout } from './shared/layouts/AdminLayout';
import { ServerLimitPage } from './shared/components/ServerLimitPage';

// Módulos Públicos
import { HomePage } from './modules/home/pages/HomePage';
import { RadioPage } from './modules/media/pages/RadioPage';
import { TVPage } from './modules/media/pages/TVPage';
import { PodcastsPage } from './modules/media/pages/PodcastsPage';
import { PodcastDetailPage } from './modules/media/pages/PodcastDetailPage';
import { NewsPage } from './modules/news/pages/NewsPage';
import { NewsDetailPage } from './modules/news/pages/NewsDetailPage';
import { SchedulePage } from './modules/schedule/pages/SchedulePage';
import { ServicesPage } from './modules/events/pages/ServicesPage';
import { GalleriesPage } from './modules/galleries/pages/GalleriesPage';
import { AdsPage } from './modules/ads/pages/AdsPage';
import { ContactPage } from './modules/contact/pages/ContactPage';
import { ChatPage } from './modules/community/pages/ChatPage';
import { CommunityPage } from './modules/community/pages/CommunityPage';
import { TarjetaPage } from './modules/contact/pages/TarjetaPage';
import { CarritoPage } from './modules/tienda/pages/CarritoPage';

// Módulos del Dashboard (Admin)
import { DashboardHome } from './modules/dashboard/pages/DashboardHome';
import { DJsPage } from './modules/dashboard/pages/DJsPage';
import { ProgramasPage } from './modules/dashboard/pages/ProgramasPage';
import { NoticiasPodcastsPage } from './modules/dashboard/pages/NoticiasPodcastsPage';
import { StreamingPage } from './modules/dashboard/pages/StreamingPage';
import { PublicidadPage } from './modules/dashboard/pages/PublicidadPage';
import { AnaliticasPage } from './modules/dashboard/pages/AnaliticasPage';
import { AliadosPage } from './modules/dashboard/pages/AliadosPage';
import { NotificacionesPage } from './modules/dashboard/pages/NotificacionesPage';
import { CategoriasPage } from './modules/dashboard/pages/CategoriasPage';
import { ProductosPage } from './modules/dashboard/pages/ProductosPage';

// Módulos de Autenticación y Tienda Virtual
import { LoginPage } from './modules/auth/pages/LoginPage';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { TiendaPage } from './modules/tienda/pages/TiendaPage';
import { ProductoDetallePage } from './modules/tienda/pages/ProductoDetallePage';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand/20">
        <span className="text-4xl">⚙️</span>
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-text-secondary max-w-md">Módulo administrativo en desarrollo para la demostración.</p>
    </div>
  </div>
);

function App() {
  const SHOW_LIMIT_MESSAGE = false; 

  if (SHOW_LIMIT_MESSAGE) {
    return <ServerLimitPage />;
  }

  return (
    <BrowserRouter>
      <SplashScreen />
      <Routes>
        {/* ========================================== */}
        {/* 1. RUTAS INDEPENDIENTES (Sin layout principal) */}
        {/* ========================================== */}
        <Route path="/tarjeta" element={<TarjetaPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ========================================== */}
        {/* 2. RUTAS PÚBLICAS (Con MainLayout) */}
        {/* ========================================== */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="emisora" element={<RadioPage />} />
          <Route path="television" element={<TVPage />} />
          <Route path="podcasts" element={<PodcastsPage />} />
          <Route path="podcasts/:id" element={<PodcastDetailPage />} />
          <Route path="noticias" element={<NewsPage />} />
          <Route path="noticias/:id" element={<NewsDetailPage />} />
          <Route path="programacion" element={<SchedulePage />} />
          <Route path="servicios" element={<ServicesPage />} />
          <Route path="aliados" element={<GalleriesPage />} />
          <Route path="publicidad" element={<AdsPage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="comunidad" element={<CommunityPage />} />
          
          {/* 🛒 RUTAS DE LA TIENDA VIRTUAL PÚBLICA */}
          <Route path="tienda" element={<TiendaPage />} />
          <Route path="tienda/carrito" element={<CarritoPage />} />
          <Route path="tienda/producto/:id" element={<ProductoDetallePage />} />
          
          {/* Ruta comodín (404) */}
          <Route path="*" element={<Placeholder title="Página no encontrada" />} />
        </Route>

        {/* ========================================== */}
        {/* 3. RUTAS PROTEGIDAS DEL PANEL ADMIN */}
        {/* ========================================== */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="usuarios" element={<Placeholder title="Usuarios y Roles" />} />
          <Route path="djs" element={<DJsPage />} />
          <Route path="programacion" element={<ProgramasPage />} />
          <Route path="contenido" element={<NoticiasPodcastsPage />} />
          <Route path="streaming" element={<StreamingPage />} />
          <Route path="publicidad" element={<PublicidadPage />} />
          <Route path="analiticas" element={<AnaliticasPage />} />
          <Route path="notificaciones" element={<NotificacionesPage />} />
          <Route path="aliados" element={<AliadosPage />} />
          
          {/* 🛒 RUTAS DE ADMINISTRACIÓN DE LA TIENDA */}
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="productos" element={<ProductosPage />} />
          
          <Route path="ia" element={<Placeholder title="Herramientas IA" />} />
          <Route path="configuracion" element={<Placeholder title="Configuración" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;