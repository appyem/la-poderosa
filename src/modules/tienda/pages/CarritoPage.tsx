import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, 
  Package, CreditCard, Truck
} from 'lucide-react';

// Clave en localStorage (debe ser la misma que en ProductoDetallePage)
const CART_STORAGE_KEY = 'lapoderosa_cart';

// Costo de envío fijo para Caldas (puede venir de configuración en el futuro)
const COSTO_ENVIO = 15000;
const ENVIO_GRATIS_DESDE = 150000; // Envío gratis desde $150.000

interface CartItem {
  productoId: string;
  titulo: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
}

export const CarritoPage = () => {
  const navigate = useNavigate();
  
  // ✅ INICIALIZACIÓN LAZY: Lee localStorage directamente al crear el estado, sin useEffect
  const [carrito, setCarrito] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const carritoGuardado = localStorage.getItem(CART_STORAGE_KEY);
      if (carritoGuardado) {
        try {
          return JSON.parse(carritoGuardado);
        } catch (error) {
          console.error('Error al leer carrito:', error);
        }
      }
    }
    return [];
  });

  // ✅ Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const incrementarCantidad = (productoId: string) => {
    setCarrito(prev =>
      prev.map(item =>
        item.productoId === productoId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const decrementarCantidad = (productoId: string) => {
    setCarrito(prev =>
      prev.map(item =>
        item.productoId === productoId
          ? { ...item, cantidad: Math.max(1, item.cantidad - 1) }
          : item
      )
    );
  };

  const eliminarProducto = (productoId: string) => {
    setCarrito(prev => prev.filter(item => item.productoId !== productoId));
  };

  const vaciarCarrito = () => {
    if (window.confirm('¿Está seguro de vaciar el carrito?')) {
      setCarrito([]);
    }
  };

  // Calcular totales
  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const envioGratis = subtotal >= ENVIO_GRATIS_DESDE;
  const costoEnvio = envioGratis ? 0 : COSTO_ENVIO;
  const total = subtotal + costoEnvio;

  const handleIrAlCheckout = () => {
    if (carrito.length === 0) {
      alert('Su carrito está vacío.');
      return;
    }
    navigate('/tienda/checkout');
  };

  return (
    <div className="pb-8 space-y-6">
      {/* Botón volver */}
      <button
        onClick={() => navigate('/tienda')}
        className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Seguir comprando</span>
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-brand" />
          Mi Carrito
        </h1>
        {carrito.length > 0 && (
          <button
            onClick={vaciarCarrito}
            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Vaciar carrito
          </button>
        )}
      </div>

      {carrito.length === 0 ? (
        /* Carrito vacío */
        <div className="text-center py-16 bg-dark-surface rounded-2xl border border-dark-border border-dashed">
          <ShoppingCart className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Su carrito está vacío</h3>
          <p className="text-text-secondary mb-6">
            Explore nuestra tienda y agregue productos a su carrito.
          </p>
          <button
            onClick={() => navigate('/tienda')}
            className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold transition-colors inline-flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Ir a la tienda
          </button>
        </div>
      ) : (
        /* Carrito con productos */
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lista de productos (2/3 del ancho) */}
          <div className="lg:col-span-2 space-y-3">
            {carrito.map(item => (
              <div
                key={item.productoId}
                className="flex gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border hover:border-brand/30 transition-colors"
              >
                {/* Imagen */}
                <div
                  onClick={() => navigate(`/tienda/producto/${item.productoId}`)}
                  className="w-24 h-24 rounded-lg overflow-hidden bg-dark-bg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {item.imagenUrl ? (
                    <img
                      src={item.imagenUrl}
                      alt={item.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <Package className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1 min-w-0 space-y-2">
                  <h3
                    onClick={() => navigate(`/tienda/producto/${item.productoId}`)}
                    className="font-semibold text-white line-clamp-2 leading-tight cursor-pointer hover:text-brand transition-colors"
                  >
                    {item.titulo}
                  </h3>

                  <p className="text-lg font-bold text-white">
                    {formatPrecio(item.precio)}
                  </p>

                  {/* Controles de cantidad y eliminar */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center border border-dark-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => decrementarCantidad(item.productoId)}
                        disabled={item.cantidad <= 1}
                        className="p-1.5 bg-dark-elevated hover:bg-dark-bg text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-1 text-white font-bold min-w-[2.5rem] text-center bg-dark-bg text-sm">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => incrementarCantidad(item.productoId)}
                        className="p-1.5 bg-dark-elevated hover:bg-dark-bg text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => eliminarProducto(item.productoId)}
                      className="p-2 rounded-lg bg-dark-elevated hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal del item */}
                <div className="hidden sm:flex flex-col items-end justify-between flex-shrink-0">
                  <p className="text-xs text-text-muted">Subtotal</p>
                  <p className="text-lg font-bold text-white">
                    {formatPrecio(item.precio * item.cantidad)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido (1/3 del ancho) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 p-6 rounded-xl bg-dark-surface border border-dark-border space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand" />
                Resumen del pedido
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal ({carrito.reduce((acc, i) => acc + i.cantidad, 0)} productos)</span>
                  <span className="text-white font-medium">{formatPrecio(subtotal)}</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    Envío a Caldas
                  </span>
                  {envioGratis ? (
                    <span className="text-green-400 font-medium">¡GRATIS!</span>
                  ) : (
                    <span className="text-white font-medium">{formatPrecio(costoEnvio)}</span>
                  )}
                </div>

                {!envioGratis && (
                  <p className="text-xs text-text-muted pt-1">
                    💡 Agregue {formatPrecio(ENVIO_GRATIS_DESDE - subtotal)} más para envío gratis
                  </p>
                )}
              </div>

              <div className="border-t border-dark-border pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-black text-brand">{formatPrecio(total)}</span>
                </div>
              </div>

              <button
                onClick={handleIrAlCheckout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand hover:bg-brand-light text-white font-bold transition-all active:scale-[0.98] shadow-lg shadow-brand/20"
              >
                <CreditCard className="w-5 h-5" />
                Ir al checkout
              </button>

              <p className="text-xs text-text-muted text-center">
                Pago seguro con PSE, Nequi, Daviplata y tarjetas
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};