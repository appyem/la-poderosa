import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Radio, Calendar, Newspaper, 
  Megaphone, BarChart3, Settings, LogOut, ChevronDown, Building2, Bot 
} from 'lucide-react';

export const AdminLayout = () => {
  const [tenantOpen, setTenantOpen] = useState(false);
  const location = useLocation();
  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Resumen' },
    { to: '/dashboard/usuarios', icon: Users, label: 'Usuarios y Roles' },
    { to: '/dashboard/programacion', icon: Calendar, label: 'Programación' },
    { to: '/dashboard/contenido', icon: Newspaper, label: 'Noticias y Podcasts' },
    { to: '/dashboard/streaming', icon: Radio, label: 'Control de Streaming' },
    { to: '/dashboard/publicidad', icon: Megaphone, label: 'Publicidad' },
    { to: '/dashboard/analiticas', icon: BarChart3, label: 'Analíticas' },
    { to: '/dashboard/ia', icon: Bot, label: 'Herramientas IA' },
    { to: '/dashboard/configuracion', icon: Settings, label: 'Configuración' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex">
      <aside className="w-64 bg-dark-surface border-r border-dark-border flex flex-col fixed h-full z-20 hidden md:flex">
        <div className="p-5 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center font-bold text-white">P</div>
            <div>
              <h1 className="font-bold text-sm">Panel Admin</h1>
              <p className="text-xs text-text-muted">LA PODEROSA</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
        <div className="p-4 border-t border-dark-border">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold md:hidden">Panel Admin</h2>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold">
              {menuItems.find(i => i.to === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setTenantOpen(!tenantOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-surface border border-dark-border hover:bg-dark-elevated transition-colors text-sm"
              >
                <Building2 className="w-4 h-4 text-brand" />
                <span>LA PODEROSA</span>
                <ChevronDown className="w-4 h-4 text-text-muted" />
              </button>
              {tenantOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-dark-surface border border-dark-border rounded-xl shadow-xl overflow-hidden z-50 p-2">
                  <div className="px-3 py-2 rounded-lg bg-brand/10 text-brand text-sm font-medium cursor-pointer">LA PODEROSA (Principal)</div>
                </div>
              )}
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-sm font-bold text-white">A</div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
