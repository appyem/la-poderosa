import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './shared/layouts/MainLayout';
import { Button } from './shared/components/Button';
import { Skeleton } from './shared/components/Skeleton';
import { Play, Headphones } from 'lucide-react';

// Página de prueba temporal para validar el diseño
const HomePage = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-dark to-dark-surface p-6 border border-dark-border">
        <div className="relative z-10 space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-brand/20 text-brand-light text-xs font-bold uppercase tracking-wider">
            En Vivo Ahora
          </span>
          <h2 className="text-3xl font-bold leading-tight">La Mañana Poderosa</h2>
          <p className="text-text-secondary max-w-md">
            La mejor información y música para empezar tu día con toda la energía.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="md">
              <Play className="w-4 h-4 mr-2 fill-current" /> Escuchar Ahora
            </Button>
            <Button variant="secondary" size="md">
              <Headphones className="w-4 h-4 mr-2" /> Programación
            </Button>
          </div>
        </div>
        {/* Efecto de fondo decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Sección de Contenido Reciente (Demo de Skeletons) */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Destacados para ti</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          {/* Aquí se añadirán las rutas de las siguientes fases */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;