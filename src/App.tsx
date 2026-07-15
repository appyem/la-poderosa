import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SplashScreen } from './shared/components/SplashScreen';
import { MainLayout } from './shared/layouts/MainLayout';
import { AdminLayout } from './shared/layouts/AdminLayout';
import { AIAssistant } from './shared/components/AIAssistant';
import { HomePage } from './modules/home/pages/HomePage';
import { RadioPage } from './modules/media/pages/RadioPage';
import { TVPage } from './modules/media/pages/TVPage';
import { PodcastsPage } from './modules/media/pages/PodcastsPage';
import { PodcastDetailPage } from './modules/media/pages/PodcastDetailPage';
import { NewsPage } from './modules/news/pages/NewsPage';
import { NewsDetailPage } from './modules/news/pages/NewsDetailPage';
import { SchedulePage } from './modules/schedule/pages/SchedulePage';
import { EventsPage } from './modules/events/pages/EventsPage';
import { EventDetailPage } from './modules/events/pages/EventDetailPage';
import { GalleriesPage } from './modules/galleries/pages/GalleriesPage';
import { AdsPage } from './modules/ads/pages/AdsPage';
import { ContactPage } from './modules/contact/pages/ContactPage';
import { ChatPage } from './modules/community/pages/ChatPage';
import { CommunityPage } from './modules/community/pages/CommunityPage';
import { DashboardHome } from './modules/dashboard/pages/DashboardHome';

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
          <Route path="eventos" element={<EventsPage />} />
          <Route path="eventos/:id" element={<EventDetailPage />} />
          <Route path="galerias" element={<GalleriesPage />} />
          <Route path="publicidad" element={<AdsPage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="comunidad" element={<CommunityPage />} />
          <Route path="*" element={<Placeholder title="Página no encontrada" />} />
        </Route>

        {/* Rutas Administrativas */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="usuarios" element={<Placeholder title="Gestión de Usuarios y Roles" />} />
          <Route path="programacion" element={<Placeholder title="Gestión de Programación" />} />
          <Route path="contenido" element={<Placeholder title="Gestión de Noticias y Podcasts" />} />
          <Route path="streaming" element={<Placeholder title="Control de Streaming" />} />
          <Route path="publicidad" element={<Placeholder title="Gestión de Publicidad" />} />
          <Route path="analiticas" element={<Placeholder title="Analíticas Detalladas" />} />
          <Route path="ia" element={<Placeholder title="Herramientas de IA" />} />
          <Route path="configuracion" element={<Placeholder title="Configuración Multi-Tenant" />} />
        </Route>
      </Routes>
      <AIAssistant />
    </BrowserRouter>
  );
}

export default App;
