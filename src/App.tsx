import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SplashScreen } from './shared/components/SplashScreen';
import { MainLayout } from './shared/layouts/MainLayout';
import { AdminLayout } from './shared/layouts/AdminLayout';

// ✅ IMPORTAR LA PANTALLA DE BLOQUEO
import { ServerLimitPage } from './shared/components/ServerLimitPage';

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
import { DashboardHome } from './modules/dashboard/pages/DashboardHome';
import { DJsPage } from './modules/dashboard/pages/DJsPage';
import { ProgramasPage } from './modules/dashboard/pages/ProgramasPage';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { NoticiasPodcastsPage } from './modules/dashboard/pages/NoticiasPodcastsPage';
import { StreamingPage } from './modules/dashboard/pages/StreamingPage';
import { PublicidadPage } from './modules/dashboard/pages/PublicidadPage';
import { AnaliticasPage } from './modules/dashboard/pages/AnaliticasPage';

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
  // ========================================================================
  // ⚠️ ¡ATENCIÓN! AQUÍ SE CONTROLA EL BLOQUEO DEL SITIO ⚠️
  // 
  // PARA RESTAURAR EL SITIO CUANDO LE PAGUEN:
  // 1. Cambie la palabra "true" por "false" en la siguiente línea.
  // 2. Guarde el archivo (Cmd + S).
  // 3. Haga git add, git commit y git push.
  // ========================================================================
  const SHOW_LIMIT_MESSAGE = true; 

  // Si está en true, muestra el mensaje de límite de servidor y detiene la carga del resto de la app
  if (SHOW_LIMIT_MESSAGE) {
    return <ServerLimitPage />;
  }

  return (
    <BrowserRouter>
      <SplashScreen />
      <Routes>
        {/* Rutas Públicas */}
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
          <Route path="galerias" element={<GalleriesPage />} />
          <Route path="publicidad" element={<AdsPage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="comunidad" element={<CommunityPage />} />
          <Route path="*" element={<Placeholder title="Página no encontrada" />} />
        </Route>

        {/* Ruta pública de Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas del Panel de Administrador */}
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
          <Route path="ia" element={<Placeholder title="Herramientas IA" />} />
          <Route path="configuracion" element={<Placeholder title="Configuración" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;