import { AlertTriangle, Mail } from 'lucide-react';

export const ServerLimitPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-dark-surface border border-dark-border rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-2xl">
        
        {/* Icono de advertencia */}
        <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-yellow-500" />
        </div>

        {/* Título */}
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Actualización de Infraestructura y Recursos del Servidor
        </h1>

        {/* Mensaje sugestivo */}
        <p className="text-text-secondary text-lg leading-relaxed">
          Debido al crecimiento de la plataforma, hemos alcanzado el límite de capacidad de nuestro plan de alojamiento y base de datos actual. Para garantizar el rendimiento, el almacenamiento de medios y la estabilidad del sistema, es necesario actualizar la configuración del servidor.
        </p>
        
        <p className="text-brand font-semibold">
          El servicio se restablecerá en cuanto se complete la reconfiguración del plan de hosting.
        </p>

        {/* Botón de contacto (SOLO CORREO ELECTRÓNICO) */}
        <div className="flex justify-center pt-4">
          <a 
            href="mailto:seviteceje1@icloud.com?subject=Actualización%20de%20Servidor%20-%20La%20Poderosa"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-bold transition-all hover:scale-105 shadow-lg shadow-brand/20"
          >
            <Mail className="w-5 h-5" />
            Contactar Soporte por Correo
          </a>
        </div>

        {/* Pie de página con firma oficial de Vercel */}
        <p className="text-xs text-text-muted pt-6 border-t border-dark-border">
          Vercel Infrastructure Team • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};