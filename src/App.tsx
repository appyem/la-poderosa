import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './shared/layouts/MainLayout';
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

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand/20">
        <span className="text-4xl">📺</span>
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-text-secondary max-w-md">
        Esta pantalla será desarrollada en las siguientes sub-fases.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
          
          <Route path="estudio-virtual" element={<Placeholder title="Estudio Virtual" />} />
          <Route path="publicidad" element={<Placeholder title="Publicidad" />} />
          <Route path="contacto" element={<Placeholder title="Contacto" />} />
          <Route path="chat" element={<Placeholder title="Chat en Vivo" />} />
          <Route path="comunidad" element={<Placeholder title="Comunidad" />} />
          <Route path="comunidad/:id" element={<Placeholder title="Perfil Usuario" />} />
          <Route path="login" element={<Placeholder title="Iniciar Sesión" />} />
          <Route path="dashboard" element={<Placeholder title="Dashboard Admin" />} />
          <Route path="*" element={<Placeholder title="Página no encontrada" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;