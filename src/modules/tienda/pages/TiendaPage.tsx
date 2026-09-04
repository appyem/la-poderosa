import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Search, Flame, Star, Package, 
  Filter, ChevronDown, X
} from 'lucide-react';
import { 
  getProductosActivos,
  getCategoriasActivas,
  type Producto,
  type Categoria
} from '../../../core/firebase/services';

type OrdenPor = 'recientes' | 'precio_asc' | 'precio_desc';

export const TiendaPage = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [ordenPor, setOrdenPor] = useState<OrdenPor>('recientes');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const cargar = async () => {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          getProductosActivos(),
          getCategoriasActivas()
        ]);
        console.log('🛒 Productos que trajo Firebase:', prods);
        console.log('📂 Categorías que trajo Firebase:', cats);
        if (isMounted) {
          setProductos(prods);
          setCategorias(cats);
        }
      } catch (error) {
        console.error('❌ Error al cargar tienda:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    cargar();
    return () => { isMounted = false; };
  }, []);

  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const getDescuento = (precio: number, precioAnterior: number): number => {
    if (!precioAnterior || precioAnterior <= precio) return 0;
    return Math.round(((precioAnterior - precio) / precioAnterior) * 100);
  };

  const productosFiltrados = productos
    .filter(p => {
      const coincideBusqueda = !busqueda || 
        p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcionCorta.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = !categoriaFiltro || p.categoriaId === categoriaFiltro;
      return coincideBusqueda && coincideCategoria;
    })
    .sort((a, b) => {
      if (ordenPor === 'precio_asc') return a.precio - b.precio;
      if (ordenPor === 'precio_desc') return b.precio - a.precio;
      return b.createdAt.toMillis() - a.createdAt.toMillis();
    });

  const getCategoriaNombre = (categoriaId: string): string => {
    return categorias.find(c => c.id === categoriaId)?.nombre || '';
  };

  const handleVerProducto = (productoId: string) => {
    navigate(`/tienda/producto/${productoId}`);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-brand" />
              La Poderosa Shop
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Productos oficiales y más. Envíos a todo Caldas.
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-dark-surface border border-dark-border text-white focus:border-brand focus:outline-none placeholder:text-text-muted"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-dark-elevated hover:bg-dark-border text-text-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {categorias.length > 0 && (
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 w-max">
            <button
              onClick={() => setCategoriaFiltro('')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                !categoriaFiltro
                  ? 'bg-brand border-brand text-white'
                  : 'bg-dark-surface border-dark-border text-text-secondary hover:border-brand/50'
              }`}
            >
              <Package className="w-4 h-4" />
              Todos
            </button>
            {categorias.map(c => (
              <button
                key={c.id}
                onClick={() => setCategoriaFiltro(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                  categoriaFiltro === c.id
                    ? 'bg-brand border-brand text-white'
                    : 'bg-dark-surface border-dark-border text-text-secondary hover:border-brand/50'
                }`}
              >
                <span>{c.icono || '📦'}</span>
                <span className="text-sm font-medium">{c.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-text-secondary">
          {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
          {categoriaFiltro && (
            <span> en <span className="text-brand font-medium">{getCategoriaNombre(categoriaFiltro)}</span></span>
          )}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-text-secondary hover:text-white transition-colors text-sm"
          >
            <Filter className="w-4 h-4" />
            Ordenar
          </button>

          <div className={`relative ${!mostrarFiltros ? 'hidden md:block' : 'absolute right-4 top-32 z-40 md:static'}`}>
            <select
              value={ordenPor}
              onChange={e => setOrdenPor(e.target.value as OrdenPor)}
              className="appearance-none pl-4 pr-10 py-2 rounded-lg bg-dark-surface border border-dark-border text-text-secondary hover:text-white focus:border-brand focus:outline-none text-sm cursor-pointer"
            >
              <option value="recientes">Más recientes</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl bg-dark-surface border border-dark-border overflow-hidden animate-pulse">
              <div className="aspect-square bg-dark-elevated" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-dark-elevated rounded w-3/4" />
                <div className="h-3 bg-dark-elevated rounded w-full" />
                <div className="h-4 bg-dark-elevated rounded w-1/2 mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-dark-surface rounded-2xl border border-dark-border border-dashed">
          <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No hay productos</h3>
          <p className="text-text-secondary max-w-md mx-auto">
            {busqueda || categoriaFiltro 
              ? 'No encontramos productos con esos filtros. Intente con otra búsqueda.'
              : 'Próximamente agregaremos productos a la tienda.'}
          </p>
          {(busqueda || categoriaFiltro) && (
            <button
              onClick={() => {
                setBusqueda('');
                setCategoriaFiltro('');
              }}
              className="mt-4 px-6 py-2 rounded-lg bg-brand hover:bg-brand-light text-white font-medium transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {productosFiltrados.map(producto => {
            const descuento = producto.enOferta && producto.precioAnterior 
              ? getDescuento(producto.precio, producto.precioAnterior) 
              : 0;
            const agotado = producto.stock === 0;

            return (
              <div
                key={producto.id}
                onClick={() => !agotado && handleVerProducto(producto.id)}
                className={`group rounded-xl bg-dark-surface border border-dark-border overflow-hidden transition-all hover:border-brand/50 hover:shadow-xl hover:shadow-brand/5 ${
                  agotado ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="relative aspect-square bg-dark-bg overflow-hidden">
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img
                      src={producto.imagenes[0]}
                      alt={producto.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <Package className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {producto.destacado && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500 text-white text-[10px] font-bold uppercase flex items-center gap-1 shadow-md">
                        <Star className="w-2.5 h-2.5 fill-current" /> Destacado
                      </span>
                    )}
                    {producto.enOferta && descuento > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase flex items-center gap-1 shadow-md">
                        <Flame className="w-2.5 h-2.5 fill-current" /> -{descuento}%
                      </span>
                    )}
                    {agotado && (
                      <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase">
                        Agotado
                      </span>
                    )}
                  </div>

                  {!agotado && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                      <span className="px-3 py-1.5 rounded-full bg-brand text-white text-xs font-semibold">
                        Ver detalles
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-1.5">
                  {producto.categoriaId && (
                    <p className="text-[10px] text-brand font-bold uppercase tracking-wide truncate">
                      {getCategoriaNombre(producto.categoriaId)}
                    </p>
                  )}
                  <h3 className="font-semibold text-white text-sm line-clamp-2 leading-tight min-h-[2.5rem]">
                    {producto.titulo}
                  </h3>

                  <div className="pt-1">
                    {producto.enOferta && producto.precioAnterior ? (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-base font-bold text-white">
                          {formatPrecio(producto.precio)}
                        </span>
                        <span className="text-xs text-text-muted line-through">
                          {formatPrecio(producto.precioAnterior)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-bold text-white">
                        {formatPrecio(producto.precio)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};