import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTenant } from '../../core/hooks/useTenant';
import { 
  Home, Radio, Tv, Newspaper, Calendar, Image as ImageIcon, 
  Mic2, MessageCircle, Users, Megaphone, Phone, LayoutDashboard,
  Menu, X, Search, Bell
} from 'lucide-react';
import { useState } from 'react';

export const MainLayout = () => {
  const tenant = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Items de navegación principal (aparecen en mobile bottom nav)
  const mainNavItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/emisora', icon: Radio, label: 'Emisora' },
    { to: '/television', icon: Tv, label: 'TV' },
    { to: '/noticias', icon: Newspaper, label: 'Noticias' },
  ];

  // Items completos del menú (sidebar desktop + menú móvil expandido)
  const fullNavItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/emisora', icon: Radio, label: 'Emisora' },
    { to: '/television', icon: Tv, label: 'Televisión' },
    { to: '/podcasts', icon: Mic2, label: 'Podcasts' },
    { to: '/noticias', icon: Newspaper, label: 'Noticias' },
    { to: '/programacion', icon: Calendar, label: 'Programación' },
    { to: '/eventos', icon: Calendar, label: 'Eventos' },
    { to: '/galerias', icon: ImageIcon, label: 'Galerías' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/comunidad', icon: Users, label: 'Comunidad' },
    { to: '/publicidad', icon: Megaphone, label: 'Publicidad' },
    { to: '/contacto', icon: Phone, label: 'Contacto' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex flex-col">
      {/* HEADER SUPERIOR */}
      <header className="sticky top-0 z-50 bg-dark-bg/90 backdrop-blur-lg border-b border-dark-border">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo + Menú Mobile */}
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-dark-elevated transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <NavLink to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center font-bold text-white shadow-lg shadow-brand/30">
                {tenant.name.charAt(0)}
              </div>
              <h1 className="text-lg font-bold tracking-tight hidden sm:block">
                {tenant.name}
              </h1>
            </NavLink>
          </div>

          {/* Búsqueda + Notificaciones + Perfil (Desktop) */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-surface border border-dark-border hover:bg-dark-elevated transition-colors">
              <Search className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-muted">Buscar...</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-dark-elevated transition-colors relative">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
            </button>
            <button className="p-2 rounded-lg hover:bg-dark-elevated transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand to-brand-dark" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR DESKTOP (visible en md+) */}
        <aside className="hidden md:flex flex-col w-60 border-r border-dark-border bg-dark-bg sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <nav className="p-3 space-y-1 flex-1">
            {fullNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-brand/10 text-brand border-l-2 border-brand'
                      : 'text-text-secondary hover:bg-dark-elevated hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Acceso al Dashboard (simulado, solo visible si hay sesión) */}
          <div className="p-3 border-t border-dark-border">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-dark-elevated hover:text-white transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              Panel Admin
            </NavLink>
          </div>
        </aside>

        {/* MENÚ MÓVIL EXPANDIDO (overlay) */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-lg pt-[61px] animate-fade-in">
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-61px)]">
              {fullNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-brand/10 text-brand'
                        : 'text-text-secondary hover:bg-dark-elevated hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-y-auto animate-fade-in pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <Outlet key={location.pathname} />
          </div>
        </main>
      </div>

      {/* NAVEGACIÓN INFERIOR MÓVIL */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-surface/95 backdrop-blur-lg border-t border-dark-border md:hidden">
        <div className="flex justify-around items-center h-16">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  isActive ? 'text-brand' : 'text-text-muted'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};