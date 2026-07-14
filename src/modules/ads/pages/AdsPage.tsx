import { Megaphone, Mail, CheckCircle } from 'lucide-react';

export const AdsPage = () => {
  const plans = [
    { name: 'Básico', price: '$500.000', features: ['2 menciones diarias', '1 banner web', 'Reporte mensual'], popular: false },
    { name: 'Profesional', price: '$1.200.000', features: ['5 menciones diarias', 'Banners web y app', '2 posts en redes', 'Reporte semanal', 'Soporte prioritario'], popular: true },
    { name: 'Premium', price: '$2.500.000', features: ['Menciones ilimitadas', 'Espacio en TV/Radio', 'Cobertura de eventos', 'Estrategia digital completa', 'Gerente dedicado'], popular: false },
  ];

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Publicidad y Patrocinios</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">Conecta tu marca con nuestra audiencia. Ofrecemos soluciones integrales de marketing en radio, televisión, digital y eventos.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-6 rounded-2xl border ${plan.popular ? 'bg-brand/10 border-brand' : 'bg-dark-surface border-dark-border'}`}>
            {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand text-white text-xs font-bold">Más Popular</span>}
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-brand mb-6">{plan.price}<span className="text-sm text-text-secondary font-normal">/mes</span></p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-brand flex-shrink-0" />{feature}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.popular ? 'bg-brand hover:bg-brand-light text-white' : 'bg-dark-elevated hover:bg-dark-bg text-white border border-dark-border'}`}>
              Solicitar Cotización
            </button>
          </div>
        ))}
      </div>
      <div className="mt-12 p-8 rounded-2xl bg-dark-surface border border-dark-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold flex items-center gap-2"><Mail className="w-5 h-5 text-brand" />¿Necesitas un plan a medida?</h3>
          <p className="text-text-secondary">Nuestro equipo comercial está listo para diseñar la estrategia perfecta para tu marca.</p>
        </div>
        <button className="px-6 py-3 rounded-lg bg-white text-dark-bg font-bold hover:bg-gray-200 transition-colors">Contactar Ventas</button>
      </div>
    </div>
  );
};
