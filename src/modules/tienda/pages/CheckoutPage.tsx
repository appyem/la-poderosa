import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, Truck, MapPin, User, Phone, 
  FileText, CheckCircle, AlertCircle
} from 'lucide-react';
import { addPedido } from '../../../core/firebase/services';

const CART_STORAGE_KEY = 'lapoderosa_cart';
const COSTO_ENVIO = 15000;
const ENVIO_GRATIS_DESDE = 150000;

// ✅ Municipios de Caldas para el dropdown
const MUNICIPIOS_CALDAS = [
  'Manizales', 'Chinchiná', 'Palestina', 'Villamaría', 'Neira',
  'Aguadas', 'Anserma', 'Belalcázar', 'Filadelfia', 'La Dorada',
  'La Merced', 'Manzanares', 'Marmato', 'Norcasia', 'Pácora',
  'Pensilvania', 'Riosucio', 'Risaralda', 'Samaná', 'San José',
  'Supía', 'Victoria'
];

type MetodoPago = 'pse' | 'nequi' | 'daviplata' | 'tarjeta';

interface CartItem {
  productoId: string;
  titulo: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
}

interface CheckoutFormData {
  nombre: string;
  telefono: string;
  direccion: string;
  barrio: string;
  municipio: string;
  notas: string;
  metodoPago: MetodoPago;
}

export const CheckoutPage = () => {
  const navigate = useNavigate();

  // ✅ Inicialización perezosa (lazy) para evitar setState en useEffect
    const [carrito] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [formData, setFormData] = useState<CheckoutFormData>({
    nombre: '',
    telefono: '',
    direccion: '',
    barrio: '',
    municipio: 'Manizales',
    notas: '',
    metodoPago: 'pse'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Redirigir al carrito si está vacío (usando useEffect solo para efectos colaterales, no para init)
  useEffect(() => {
    if (carrito.length === 0) {
      navigate('/tienda/carrito');
    }
  }, [carrito, navigate]);

  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMetodoPagoChange = (metodo: MetodoPago) => {
    setFormData(prev => ({ ...prev, metodoPago: metodo }));
  };

  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const envioGratis = subtotal >= ENVIO_GRATIS_DESDE;
  const costoEnvio = envioGratis ? 0 : COSTO_ENVIO;
  const total = subtotal + costoEnvio;

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ✅ Validaciones estrictas
    if (!formData.nombre.trim() || !formData.telefono.trim() || !formData.direccion.trim() || !formData.municipio) {
      setError('Por favor, complete todos los campos obligatorios de envío.');
      return;
    }

    if (formData.telefono.trim().replace(/\s/g, '').length < 7) {
      setError('Por favor, ingrese un número de teléfono válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Preparar los items del pedido (snapshot de datos)
      const itemsPedido = carrito.map(item => ({
        productoId: item.productoId,
        titulo: item.titulo,
        precio: item.precio,
        cantidad: item.cantidad,
        imagenUrl: item.imagenUrl,
        subtotal: item.precio * item.cantidad
      }));

      // 2. Crear el objeto del pedido para Firebase
      const nuevoPedido = {
        clienteId: 'cliente_invitado', // Se puede actualizar cuando haya auth
        clienteNombre: formData.nombre,
        clienteEmail: 'no-providen@lapoderosa.co', // Se puede pedir en el formulario
        clienteTelefono: formData.telefono,
        items: itemsPedido,
        subtotal,
        costoEnvio,
        descuento: 0,
        total,
        estado: 'pendiente' as const,
        metodoPago: formData.metodoPago,
        direccionEnvio: {
          id: 'temp',
          etiqueta: 'Domicilio',
          direccion: formData.direccion,
          barrio: formData.barrio,
          ciudad: formData.municipio,
          departamento: 'Caldas',
          telefono: formData.telefono,
          esPrincipal: true
        },
        notas: formData.notas || undefined
      };

      // 3. Guardar en Firebase y obtener el ID del pedido
      const pedidoId = await addPedido(nuevoPedido);
      console.log('✅ Pedido guardado en Firebase con ID:', pedidoId);

      // 4. 🚀 INTEGRACIÓN CON EPAYCO
      // Aquí es donde llamarías a TU backend para generar el token de ePayco.
      // Ejemplo: const response = await fetch('/api/crear-pago', { method: 'POST', body: JSON.stringify({ pedidoId, total, ... }) });
      // const { tok } = await response.json();
      
      // ⚠️ SIMULACIÓN PARA DEMOSTRACIÓN (Reemplazar con la llamada real a tu backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Limpiar carrito inmediatamente al iniciar el proceso de pago
      localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event('cartUpdated'));

      // Redirigir a la página de éxito (en producción, ePayco redirigirá aquí después del pago)
      // window.location.href = `https://checkout.epayco.co/${tok}`; // Descomentar cuando tengas el backend
      
      // Por ahora, redirigimos a la página de confirmación simulada
      navigate(`/tienda/pago-exitoso?pedido=${pedidoId}`);
      
    } catch (err) {
      console.error('Error en checkout:', err);
      setError('Ocurrió un error al procesar su pedido. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (carrito.length === 0) {
    return null; // El useEffect se encarga de redirigir
  }

  return (
    <div className="pb-24 md:pb-8 space-y-6">
      <button
        onClick={() => navigate('/tienda/carrito')}
        className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Volver al carrito</span>
      </button>

      <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
        <CreditCard className="w-8 h-8 text-brand" />
        Finalizar Compra
      </h1>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Columna Izquierda: Formulario de Envío y Pago */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Datos de Envío */}
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand" />
              Datos de Envío
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Nombre completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none text-sm"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Teléfono / WhatsApp *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none text-sm"
                    placeholder="300 123 4567"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Dirección exacta *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none text-sm"
                    placeholder="Calle 123 # 45-67, Apto 101"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Barrio</label>
                <input
                  type="text"
                  name="barrio"
                  value={formData.barrio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none text-sm"
                  placeholder="Centro"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Municipio (Caldas) *</label>
                <select
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none text-sm appearance-none"
                  required
                >
                  {MUNICIPIOS_CALDAS.map(mun => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Notas para el domicilio (opcional)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-brand focus:outline-none text-sm resize-none"
                    placeholder="Ej: Timbre no funciona, dejar en portería"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand" />
              Método de Pago
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'pse' as MetodoPago, label: 'PSE', desc: 'Débito bancario' },
                { id: 'nequi' as MetodoPago, label: 'Nequi', desc: 'Billetera digital' },
                { id: 'daviplata' as MetodoPago, label: 'Daviplata', desc: 'Billetera digital' },
                { id: 'tarjeta' as MetodoPago, label: 'Tarjeta', desc: 'Crédito / Débito' }
              ].map((metodo) => (
                <button
                  key={metodo.id}
                  type="button"
                  onClick={() => handleMetodoPagoChange(metodo.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.metodoPago === metodo.id
                      ? 'bg-brand/10 border-brand ring-1 ring-brand'
                      : 'bg-dark-bg border-dark-border hover:border-brand/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.metodoPago === metodo.id ? 'border-brand' : 'border-text-muted'
                    }`}>
                      {formData.metodoPago === metodo.id && <div className="w-2 h-2 rounded-full bg-brand" />}
                    </div>
                    <span className="font-bold text-white text-sm">{metodo.label}</span>
                  </div>
                  <p className="text-xs text-text-muted pl-6">{metodo.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen del Pedido */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
            <h2 className="text-lg font-bold text-white">Resumen del Pedido</h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {carrito.map(item => (
                <div key={item.productoId} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-dark-bg overflow-hidden flex-shrink-0">
                    {item.imagenUrl ? (
                      <img src={item.imagenUrl} alt={item.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <MapPin className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium line-clamp-1">{item.titulo}</p>
                    <p className="text-xs text-text-muted">Cant: {item.cantidad}</p>
                  </div>
                  <p className="text-sm font-bold text-white">{formatPrecio(item.precio * item.cantidad)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-dark-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-white">{formatPrecio(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Envío a {formData.municipio}</span>
                <span className={envioGratis ? 'text-green-400 font-medium' : 'text-white'}>
                  {envioGratis ? '¡GRATIS!' : formatPrecio(costoEnvio)}
                </span>
              </div>
            </div>

            <div className="border-t border-dark-border pt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Total a pagar</span>
                <span className="text-2xl font-black text-brand">{formatPrecio(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand hover:bg-brand-light text-white font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirmar y Pagar
                </>
              )}
            </button>

            <p className="text-[10px] text-text-muted text-center leading-relaxed">
              Al confirmar, aceptas nuestros términos y condiciones. 
              Tus datos están protegidos y el pago se procesa de forma segura.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};