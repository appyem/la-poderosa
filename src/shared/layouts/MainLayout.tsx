import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Radio, Tv, Newspaper, Calendar, ImageIcon, 
  Mic2, MessageCircle, Users, Megaphone, Phone, LayoutDashboard, 
  Menu, X, Search, Bell 
} from 'lucide-react';
import { useState } from 'react';

export const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // OVERLAY AJUSTADO: Opacidades mucho más bajas para que el video sea visible
  const getOverlay = () => (['/', '/emisora', '/television'].includes(location.pathname) 
    ? 'from-black/20 via-black/40 to-black/60' 
    : 'from-black/60 via-black/80 to-black/90');

  const mainNav = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/emisora', icon: Radio, label: 'Emisora' },
    { to: '/television', icon: Tv, label: 'TV' },
    { to: '/noticias', icon: Newspaper, label: 'Noticias' },
  ];

  const fullNav = [
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
    <div className="min-h-screen bg-dark-bg text-text-primary flex flex-col relative">
      {/* VIDEO DE FONDO GLOBAL */}
      <div className="fixed inset-0 z-0 block">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover" 
          poster="https://images.pexels.com/photos/5765711/pexels-photo-5765711.jpeg"
        >
          {/* Usamos video/mp4 para máxima compatibilidad, incluso si la extensión es .mov */}
          <source src="/fondo_poderosa.mov" type="video/mp4" />
        </video>
      </div>

      {/* OVERLAY OSCURO GLOBAL (Ahora con opacidad baja para ver el video) */}
      <div className={`fixed inset-0 z-[1] bg-gradient-to-b ${getOverlay()}`} />

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 rounded-lg hover:bg-white/10" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <NavLink to="/" className="flex items-center gap-3">
                <img 
                  src="/logo.jpg" 
                  alt="LA PODEROSA" 
                  className="h-16 w-16 rounded-full object-cover shadow-lg shadow-brand/20 border-2 border-brand/30" 
                />
                <div className="flex flex-col">
                  <h1 className="text-xl font-black tracking-tight leading-none text-white">LA PODEROSA</h1>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest">Medios Digitales</p>
                </div>
              </NavLink>
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-white/10">
                <Search className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">Buscar...</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 relative">
                <Bell className="w-5 h-5 text-white/80" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand to-brand-dark" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          <aside className="hidden md:flex flex-col w-60 border-r border-white/10 bg-black/40 backdrop-blur-xl sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
            <nav className="p-3 space-y-1 flex-1">
              {fullNav.map((item) => (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  end={item.to === '/'} 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive 
                        ? 'bg-brand/30 backdrop-blur-sm text-white border-l-2 border-brand' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-white/10">
              <NavLink to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white">
                <LayoutDashboard className="w-5 h-5" /> Panel Admin
              </NavLink>
            </div>
          </aside>

          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-lg pt-[61px] animate-fade-in">
              <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-61px)]">
                {fullNav.map((item) => (
                  <NavLink 
                    key={item.to} 
                    to={item.to} 
                    end={item.to === '/'} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive ? 'bg-brand/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
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

          <main className="flex-1 overflow-y-auto animate-fade-in pb-24 md:pb-6">
            <div className="max-w-7xl mx-auto">
              <Outlet key={location.pathname} />
            </div>
          </main>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 md:hidden">
          <div className="flex justify-around items-center h-16">
            {mainNav.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                end={item.to === '/'} 
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                    isActive ? 'text-brand' : 'text-white/60'
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
    </div>
  );
};