import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './shared/layouts/MainLayout';
import { HeroSection } from './modules/home/components/HeroSection';
import { LiveProgramsSection } from './modules/home/components/LiveProgramsSection';
import { PodcastsSection } from './modules/home/components/PodcastsSection';
import { NewsSection } from './modules/home/components/NewsSection';
import { EventsSection } from './modules/home/components/EventsSection';
import { SponsorsSection } from './modules/home/components/SponsorsSection';

// Placeholder temporal para las demás rutas
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

// Página de inicio completa
const HomePage = () => {
  return (
    <div className="space-y-12 py-6">
      <HeroSection />
      <LiveProgramsSection />
      <PodcastsSection />
      <NewsSection />
      <EventsSection />
      <SponsorsSection />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="emisora" element={<Placeholder title="Emisora en Vivo" />} />
          <Route path="television" element={<Placeholder title="Televisión Digital" />} />
          <Route path="estudio-virtual" element={<Placeholder title="Estudio Virtual" />} />
          <Route path="podcasts" element={<Placeholder title="Podcasts" />} />
          <Route path="podcasts/:id" element={<Placeholder title="Detalle Podcast" />} />
          <Route path="noticias" element={<Placeholder title="Noticias" />} />
          <Route path="noticias/:id" element={<Placeholder title="Detalle Noticia" />} />
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