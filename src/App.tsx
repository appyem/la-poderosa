import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './shared/layouts/MainLayout';
import { HomePage } from './modules/home/pages/HomePage';
import { RadioPage } from './modules/media/pages/RadioPage';
import { TVPage } from './modules/media/pages/TVPage';
import { PodcastsPage } from './modules/media/pages/PodcastsPage';
import { PodcastDetailPage } from './modules/media/pages/PodcastDetailPage';
import { NewsPage } from './modules/news/pages/NewsPage';
import { NewsDetailPage } from './modules/news/pages/NewsDetailPage';

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
          
          {/* Media */}
          <Route path="emisora" element={<RadioPage />} />
          <Route path="television" element={<TVPage />} />
          <Route path="podcasts" element={<PodcastsPage />} />
          <Route path="podcasts/:id" element={<PodcastDetailPage />} />
          
          {/* News */}
          <Route path="noticias" element={<NewsPage />} />
          <Route path="noticias/:id" element={<NewsDetailPage />} />
          
          {/* Placeholders */}
          <Route path="estudio-virtual" element={<Placeholder title="Estudio Virtual" />} />
          <Route path="eventos" element={<Placeholder title="Eventos" />} />
          <Route path="eventos/:id" element={<Placeholder title="Detalle Evento" />} />
          <Route path="galerias" element={<Placeholder title="Galerías" />} />
          <Route path="programacion" element={<Placeholder title="Programación" />} />
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