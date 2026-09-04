import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Package, ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';

const FAV_STORAGE_KEY = 'lapoderosa_favorites';
const CART_STORAGE_KEY = 'lapoderosa_cart';

interface FavoriteItem {
  productoId: string;
  titulo: string;
  precio: number;
  imagenUrl: string;
}

interface CartItem {
  productoId: string;
  titulo: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
}

export const FavoritosPage = () => {
  const navigate = useNavigate();
  
  // ✅ INICIALIZACIÓN LAZY: Lee localStorage directamente al crear el estado, sin useEffect
  const [favoritos, setFavoritos] = useState<FavoriteItem[]>(() => {
    if (typeof window !== 'undefined') {
      const guardados = localStorage.getItem(FAV_STORAGE_KEY);
      if (guardados) {
        try {
          const parsed = JSON.parse(guardados);
          return Array.isArray(parsed) 
            ? parsed.filter((item): item is FavoriteItem => 
                typeof item === 'object' && item !== null && 'productoId' in item
              )
            : [];
        } catch (error) {
          console.error('Error al leer favoritos:', error);
        }
      }
    }
    return [];
  });

  const eliminarFavorito = (productoId: string) => {
    const nuevos = favoritos.filter(f => f.productoId !== productoId);
    setFavoritos(nuevos);
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(nuevos));
  };

  const agregarAlCarrito = (fav: FavoriteItem) => {
    const carritoActual: CartItem[] = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    const existe = carritoActual.find(item => item.productoId === fav.productoId);
    
    let nuevoCarrito: CartItem[];
    if (existe) {
      nuevoCarrito = carritoActual.map(item =>
        item.productoId === fav.productoId ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      nuevoCarrito = [...carritoActual, { ...fav, cantidad: 1 }];
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  return (
    <div className="pb-24 md:pb-8 space-y-6">
      <button onClick={() => navigate('/tienda')} className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Volver a la tienda</span>
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
          <Heart className="w-8 h-8 text-brand fill-current" />
          Mis Favoritos
        </h1>
        {favoritos.length > 0 && (
          <button onClick={() => { setFavoritos([]); localStorage.removeItem(FAV_STORAGE_KEY); }} className="text-sm text-red-400 hover:text-red-300 font-medium">
            Limpiar favoritos
          </button>
        )}
      </div>

      {favoritos.length === 0 ? (
        <div className="text-center py-16 bg-dark-surface rounded-2xl border border-dark-border border-dashed">
          <Heart className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No tienes favoritos aún</h3>
          <p className="text-text-secondary mb-6">Guarda los productos que más te gusten para verlos aquí.</p>
          <button onClick={() => navigate('/tienda')} className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold transition-colors inline-flex items-center gap-2">
            <Package className="w-4 h-4" /> Ir a la tienda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {favoritos.map(fav => (
            <div key={fav.productoId} className="group rounded-xl bg-dark-surface border border-dark-border overflow-hidden hover:border-brand/50 transition-all">
              <div 
                onClick={() => navigate(`/tienda/producto/${fav.productoId}`)}
                className="relative aspect-square bg-dark-bg overflow-hidden cursor-pointer"
              >
                {fav.imagenUrl ? (
                  <img src={fav.imagenUrl} alt={fav.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted"><Package className="w-12 h-12" /></div>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); eliminarFavorito(fav.productoId); }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-red-500 text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 space-y-2">
                <h3 
                  onClick={() => navigate(`/tienda/producto/${fav.productoId}`)}
                  className="font-semibold text-white text-sm line-clamp-2 leading-tight min-h-[2.5rem] cursor-pointer hover:text-brand"
                >
                  {fav.titulo}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">{formatPrecio(fav.precio)}</span>
                  <button 
                    onClick={() => agregarAlCarrito(fav)}
                    className="p-2 rounded-lg bg-brand hover:bg-brand-light text-white transition-colors"
                    title="Agregar al carrito"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};