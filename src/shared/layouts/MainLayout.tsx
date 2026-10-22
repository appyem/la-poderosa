import { AdBanner } from '../components/AdBanner';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Radio, Tv, Newspaper, Calendar, 
  Mic2, MessageCircle, Users, Megaphone, Phone, LayoutDashboard, 
  Menu, X, Search, Bell, Briefcase, Handshake, ShoppingBag,
  ShoppingCart, Heart, Minimize2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { solicitarPermisoNotificaciones } from '../../core/firebase/services';

import { InstallAppButton } from '../../components/InstallAppButton';
import { AdPopup } from '../components/AdPopup';

const WHATSAPP_URL = "https://wa.me/573227027174?text=" + encodeURIComponent("Hola La Poderosa, quiero más información");

declare global {
  interface Window {
    CasterFMEmbed?: {
      renderAll?: () => void;
    };
  }
}

export const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [showAdPopup, setShowAdPopup] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  // ✅ Estado SOLO para móvil: widget abierto por defecto
  const [mobileRadioOpen, setMobileRadioOpen] = useState(true);

  interface CartItem {
    cantidad: number;
  }

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('lapoderosa_cart') || '[]') as CartItem[];
      const count = cart.reduce((acc: number, item: CartItem) => acc + item.cantidad, 0);
      setCartCount(count);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => {
        solicitarPermisoNotificaciones();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const existingScript = document.getElementById('casterfm-embed-script');
    if (existingScript) {
      window.CasterFMEmbed?.renderAll?.();
      return;
    }

    const script = document.createElement('script');
    script.id = 'casterfm-embed-script';
    script.src = 'https://cdn.cloud.caster.fm/widgets/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ Re-renderizar widget de Caster.fm cuando se abre en móvil
  useEffect(() => {
    if (mobileRadioOpen) {
      const timer = setTimeout(() => {
        window.CasterFMEmbed?.renderAll?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mobileRadioOpen]);

  const getOverlay = () => (['/', '/emisora', '/television'].includes(location.pathname) 
    ? 'from-black/20 via-black/40 to-black/60' 
    : 'from-black/60 via-black/80 to-black/90');

  const mainNav = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/emisora', icon: Radio, label: 'Emisora' },
    { to: '/servicios', icon: Briefcase, label: 'Servicios' },
    { to: '/tienda', icon: ShoppingBag, label: 'Tienda' },
    { to: '/television', icon: Tv, label: 'TV' },
    { to: '/noticias', icon: Newspaper, label: 'Noticias' },
  ];

  const fullNav = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/emisora', icon: Radio, label: 'Emisora' },
    { to: '/television', icon: Tv, label: 'Televisión' },
    { to: '/podcasts', icon: Mic2, label: 'Podcasts' },
    { to: '/noticias', icon: Newspaper, label: 'Noticias' },
    { to: '/tienda', icon: ShoppingBag, label: 'Tienda' },
    { to: '/programacion', icon: Calendar, label: 'Programación' },
    { to: '/servicios', icon: Briefcase, label: 'Servicios' },
    { to: '/aliados', icon: Handshake, label: 'Aliados' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/comunidad', icon: Users, label: 'Comunidad' },
    { to: '/publicidad', icon: Megaphone, label: 'Publicidad' },
    { to: '/contacto', icon: Phone, label: 'Contacto' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Panel Admin', admin: true },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex flex-col relative">
      
      {/* ============================================================ */}
      {/* ✅ WIDGET DE RADIO - VERSIÓN DESKTOP (siempre visible) */}
      {/* ============================================================ */}
      <div className="hidden md:block fixed bottom-20 right-4 z-[60] w-[320px] bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="p-3 bg-gradient-to-r from-brand to-purple-600 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Radio className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-sm font-bold text-white truncate">LA PODEROSA - En Vivo</span>
          </div>
          <a 
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all flex-shrink-0 ml-2"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-white fill-current" />
          </a>
        </div>
        <div className="p-2">
          <div 
            className="cstrEmbed" 
            data-type="newStreamPlayer" 
            data-publicToken="ddcadc0f-6cbe-4c96-a09d-21867777416e" 
            data-theme="dark" 
            data-color="6C2BDD"
            data-channelId=""
          >
            <a href="https://www.caster.fm">Shoutcast Hosting</a>
            <a href="https://www.caster.fm">Stream Hosting</a>
            <a href="https://www.caster.fm">Radio Server Hosting</a>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ✅ WIDGET DE RADIO - VERSIÓN MÓVIL (con botón minimizar) */}
      {/* ============================================================ */}
      
      {/* Cuando está minimizado: solo un botón circular */}
      {!mobileRadioOpen && (
        <button
          onClick={() => setMobileRadioOpen(true)}
          className="md:hidden fixed bottom-20 right-3 z-[60] w-14 h-14 rounded-full bg-gradient-to-r from-brand to-purple-600 flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95"
          aria-label="Abrir radio"
        >
          <Radio className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Cuando está abierto: el widget completo */}
      {mobileRadioOpen && (
        <div className="md:hidden fixed bottom-20 right-3 z-[60] w-[260px] bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-2 bg-gradient-to-r from-brand to-purple-600 flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Radio className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-xs font-bold text-white truncate">LA PODEROSA</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <a 
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white fill-current" />
              </a>
              <button
                onClick={() => setMobileRadioOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                aria-label="Minimizar radio"
              >
                <Minimize2 className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
          <div className="p-1.5">
            <div 
              className="cstrEmbed" 
              data-type="newStreamPlayer" 
              data-publicToken="ddcadc0f-6cbe-4c96-a09d-21867777416e" 
              data-theme="dark" 
              data-color="6C2BDD"
              data-channelId=""
            >
              <a href="https://www.caster.fm">Shoutcast Hosting</a>
              <a href="https://www.caster.fm">Stream Hosting</a>
              <a href="https://www.caster.fm">Radio Server Hosting</a>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-0 block">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover bg-dark-bg">
          <source src="/fondo_poderosa.mov" type="video/mp4" />
        </video>
      </div>

      <div className={`fixed inset-0 z-[1] bg-gradient-to-b ${getOverlay()}`} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <NavLink to="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="LA PODEROSA" className="h-16 w-16 rounded-full object-cover shadow-lg shadow-brand/20 border-2 border-brand/30" />
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
              
              <NavLink to="/tienda/carrito" className="p-2 rounded-lg hover:bg-white/10 relative">
                <ShoppingCart className="w-5 h-5 text-white/80" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              <NavLink to="/tienda/favoritos" className="p-2 rounded-lg hover:bg-white/10 relative hidden md:block">
                <Heart className="w-5 h-5 text-white/80" />
              </NavLink>

              <button className="p-2 rounded-lg hover:bg-white/10 relative">
                <Bell className="w-5 h-5 text-white/80" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
              </button>
              <InstallAppButton />
            </div>
          </div>
        </header>

        <AdBanner />

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
                      item.admin
                        ? (isActive ? 'bg-brand text-white border-l-2 border-brand' : 'text-brand hover:bg-brand/20')
                        : (isActive ? 'bg-brand/30 backdrop-blur-sm text-white border-l-2 border-brand' : 'text-white/70 hover:bg-white/10 hover:text-white')
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
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
                        item.admin
                          ? (isActive ? 'bg-brand text-white' : 'text-brand hover:bg-brand/20')
                          : (isActive ? 'bg-brand/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white')
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
                <div className="pt-4 mt-4 border-t border-white/10 flex justify-center">
                  <InstallAppButton />
                </div>
              </nav>
            </div>
          )}

          <main className="flex-1 overflow-y-auto animate-fade-in pb-32 md:pb-6">
            <div className="max-w-7xl mx-auto px-4 md:px-0">
              <Outlet key={location.pathname} />
            </div>
          </main>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 md:hidden h-16">
          <div className="flex justify-around items-center h-full">
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

      {showAdPopup && <AdPopup onClose={() => setShowAdPopup(false)} />}
    </div>
  );
};