import { Outlet } from 'react-router-dom';
import { useTenant } from '../../core/hooks/useTenant';
import { Home, Radio, Tv, Newspaper, User } from 'lucide-react';

export const MainLayout = () => {
  const tenant = useTenant();

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex flex-col">
      {/* Header Superior (Logo y Perfil) */}
      <header className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Aquí irá tu logo real. Usamos un placeholder con el nombre por ahora */}
          <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center font-bold text-white">
            {tenant.name.charAt(0)}
          </div>
          <h1 className="text-lg font-bold tracking-tight">{tenant.name}</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-dark-elevated transition-colors">
          <User className="w-5 h-5 text-text-secondary" />
        </button>
      </header>

      {/* Contenido Principal con animación de entrada */}
      <main className="flex-1 overflow-y-auto p-4 animate-fade-in pb-24 md:pb-4">
        <Outlet />
      </main>

      {/* Navegación Inferior (Mobile First) / Lateral en Desktop (se mejorará en Fase 5) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-surface/95 backdrop-blur-lg border-t border-dark-border md:hidden">
        <div className="flex justify-around items-center h-16">
          <NavItem icon={<Home className="w-6 h-6" />} label="Inicio" active />
          <NavItem icon={<Radio className="w-6 h-6" />} label="Emisora" />
          <NavItem icon={<Tv className="w-6 h-6" />} label="TV" />
          <NavItem icon={<Newspaper className="w-6 h-6" />} label="Noticias" />
        </div>
      </nav>
    </div>
  );
};

// Componente auxiliar para items de navegación
const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? 'text-brand' : 'text-text-muted hover:text-text-secondary'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);