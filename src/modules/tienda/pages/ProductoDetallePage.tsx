import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, Minus, Plus, Share2, 
  Star, Flame, Package, Check, Heart
} from 'lucide-react';
import { 
  getProductoPorId,
  getProductosPorCategoria,
  type Producto
} from '../../../core/firebase/services';

const CART_STORAGE_KEY = 'lapoderosa_cart';
// ✅ NUEVO: Clave para favoritos
const FAV_STORAGE_KEY = 'lapoderosa_favorites';

interface CartItem {
  productoId: string;
  titulo: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
}

export const ProductoDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagenActual, setImagenActual] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [mostrarToast, setMostrarToast] = useState(false);
  // ✅ NUEVO: Estado para favoritos
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const cargar = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const prod = await getProductoPorId(id);
        if (isMounted) {
          setProducto(prod);
          setImagenActual(0);
          setCantidad(1);
          
          // ✅ NUEVO: Verificar si está en favoritos
          const favorites = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) || '[]');
          setIsFavorite(favorites.includes(id));
          
          if (prod) {
            const rels = await getProductosPorCategoria(prod.categoriaId);
            if (isMounted) {
              setRelacionados(rels.filter(r => r.id !== prod.id).slice(0, 4));
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    cargar();
    return () => { isMounted = false; };
  }, [id]);

  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const getDescuento = (): number => {
    if (!producto || !producto.enOferta || !producto.precioAnterior) return 0;
    return Math.round(((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100);
  };

  const incrementarCantidad = () => {
    if (producto && cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleAgregarAlCarrito = () => {
    if (!producto || producto.stock === 0) return;

    const carritoActual: CartItem[] = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    const itemExistente = carritoActual.find(item => item.productoId === producto.id);
    
    let nuevoCarrito: CartItem[];
    if (itemExistente) {
      nuevoCarrito = carritoActual.map(item =>
        item.productoId === producto.id
          ? { ...item, cantidad: Math.min(item.cantidad + cantidad, producto.stock) }
          : item
      );
    } else {
      nuevoCarrito = [
        ...carritoActual,
        {
          productoId: producto.id,
          titulo: producto.titulo,
          precio: producto.precio,
          cantidad,
          imagenUrl: producto.imagenes[0] || ''
        }
      ];
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nuevoCarrito));
    // ✅ NUEVO: Notificar al header para que actualice el contador inmediatamente
    window.dispatchEvent(new Event('cartUpdated'));

    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 2500);
  };

  // ✅ NUEVO: Función para alternar favoritos
  const toggleFavorite = () => {
    if (!id) return;
    let favorites = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) || '[]');
    if (isFavorite) {
      favorites = favorites.filter((favId: string) => favId !== id);
    } else {
      favorites.push(id);
    }
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const handleCompartirWhatsApp = () => {
    if (!producto) return;
    const url = window.location.href;
    const texto = `¡Mira este producto de LA PODEROSA DEL CAFÉ!\n\n🛍️ *${producto.titulo}*\n💰 ${formatPrecio(producto.precio)}\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-dark-surface rounded" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-dark-surface rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-dark-surface rounded" />
            <div className="h-10 w-2/3 bg-dark-surface rounded" />
            <div className="h-8 w-40 bg-dark-surface rounded mt-6" />
            <div className="h-32 w-full bg-dark-surface rounded mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="py-16 text-center">
        <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h2>
        <p className="text-text-secondary mb-6">
          El producto que buscas no existe o ha sido eliminado.
        </p>
        <button
          onClick={() => navigate('/tienda')}
          className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </button>
      </div>
    );
  }

  const descuento = getDescuento();
  const agotado = producto.stock === 0;
  const sinStockSuficiente = producto.stock < cantidad;

  return (
    // ✅ CORREGIDO: pb-24 md:pb-32 para que el reproductor no tape el contenido
    <div className="pb-24 md:pb-32 space-y-8">
      <button
        onClick={() => navigate('/tienda')}
        className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Volver a la tienda</span>
      </button>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-surface border border-dark-border">
            {producto.imagenes && producto.imagenes.length > 0 ? (
              <img
                src={producto.imagenes[imagenActual]}
                alt={producto.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <Package className="w-20 h-20" />
              </div>
            )}

            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {producto.destacado && (
                <span className="px-2.5 py-1 rounded-full bg-yellow-500 text-white text-xs font-bold uppercase flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" /> Destacado
                </span>
              )}
              {producto.enOferta && descuento > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase flex items-center gap-1 shadow-md">
                  <Flame className="w-3 h-3 fill-current" /> -{descuento}%
                </span>
              )}
              {agotado && (
                <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm text-white text-xs font-bold uppercase">
                  Agotado
                </span>
              )}
            </div>

            <button
              onClick={handleCompartirWhatsApp}
              className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white transition-colors"
              aria-label="Compartir por WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {producto.imagenes && producto.imagenes.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {producto.imagenes.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImagenActual(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    idx === imagenActual 
                      ? 'border-brand ring-2 ring-brand/30' 
                      : 'border-dark-border hover:border-brand/50'
                  }`}
                >
                  <img src={img} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            {producto.categoriaId && (
              <p className="text-xs text-brand font-bold uppercase tracking-wider mb-2">
                Categoría
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {producto.titulo}
            </h1>
            {producto.sku && (
              <p className="text-xs text-text-muted mt-2">SKU: {producto.sku}</p>
            )}
          </div>

          {producto.descripcionCorta && (
            <p className="text-text-secondary leading-relaxed">
              {producto.descripcionCorta}
            </p>
          )}

          <div className="py-4 border-y border-dark-border">
            {producto.enOferta && producto.precioAnterior ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {formatPrecio(producto.precio)}
                  </span>
                  <span className="text-lg text-text-muted line-through">
                    {formatPrecio(producto.precioAnterior)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                    Ahorras {formatPrecio(producto.precioAnterior - producto.precio)}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-3xl md:text-4xl font-bold text-white">
                {formatPrecio(producto.precio)}
              </span>
            )}
          </div>

          <div>
            {agotado ? (
              <div className="flex items-center gap-2 text-red-400">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-sm font-medium">Agotado</span>
              </div>
            ) : producto.stock <= 5 ? (
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-sm font-medium">¡Solo quedan {producto.stock}!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm font-medium">En stock ({producto.stock} disponibles)</span>
              </div>
            )}
          </div>

          {!agotado && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary font-medium">Cantidad:</span>
                <div className="flex items-center border border-dark-border rounded-lg overflow-hidden">
                  <button
                    onClick={decrementarCantidad}
                    disabled={cantidad <= 1}
                    className="p-2.5 bg-dark-elevated hover:bg-dark-bg text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 py-2 text-white font-bold min-w-[3rem] text-center bg-dark-bg">
                    {cantidad}
                  </span>
                  <button
                    onClick={incrementarCantidad}
                    disabled={cantidad >= producto.stock}
                    className="p-2.5 bg-dark-elevated hover:bg-dark-bg text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAgregarAlCarrito}
                disabled={sinStockSuficiente}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand hover:bg-brand-light text-white font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
              >
                <ShoppingCart className="w-5 h-5" />
                Agregar al carrito
              </button>

              {/* ✅ CORREGIDO: Botón de favoritos funcional */}
              <button
                onClick={toggleFavorite}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
                  isFavorite 
                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                    : 'bg-dark-elevated hover:bg-dark-bg border-dark-border text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              </button>
            </div>
          )}

          {producto.descripcion && (
            <div className="pt-4 space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Descripción
              </h3>
              <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {producto.descripcion}
              </div>
            </div>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="pt-8 border-t border-dark-border">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {relacionados.map(rel => (
              <div
                key={rel.id}
                onClick={() => {
                  navigate(`/tienda/producto/${rel.id}`);
                  window.scrollTo(0, 0);
                }}
                className="group rounded-xl bg-dark-surface border border-dark-border overflow-hidden hover:border-brand/50 transition-all cursor-pointer"
              >
                <div className="relative aspect-square bg-dark-bg overflow-hidden">
                  {rel.imagenes && rel.imagenes.length > 0 ? (
                    <img
                      src={rel.imagenes[0]}
                      alt={rel.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <Package className="w-10 h-10" />
                    </div>
                  )}
                  {rel.enOferta && rel.precioAnterior && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase shadow-md">
                      -{Math.round(((rel.precioAnterior - rel.precio) / rel.precioAnterior) * 100)}%
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-semibold text-white text-sm line-clamp-2 leading-tight min-h-[2.5rem]">
                    {rel.titulo}
                  </h3>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-white">
                      {formatPrecio(rel.precio)}
                    </span>
                    {rel.enOferta && rel.precioAnterior && (
                      <span className="text-xs text-text-muted line-through">
                        {formatPrecio(rel.precioAnterior)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mostrarToast && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white shadow-2xl shadow-green-900/50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Check className="w-5 h-5" />
          <span className="font-medium text-sm">Agregado al carrito</span>
          <button
            onClick={() => navigate('/tienda/carrito')}
            className="ml-2 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
          >
            Ver carrito
          </button>
        </div>
      )}
    </div>
  );
};