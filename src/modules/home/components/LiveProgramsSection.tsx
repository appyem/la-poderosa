import { useState, useEffect } from 'react';
import { Carousel } from '../../../shared/components/Carousel';
import { ProgramCard } from '../../../shared/components/ProgramCard';
import { getProgramasRadio, getDJs, type ProgramaRadio, type DJ } from '../../../core/firebase/services';

// Interfaz local estricta que coincide exactamente con lo que espera ProgramCard
interface MappedProgram {
  id: string;
  title: string;
  host: string;
  time: string;
  category: string;
  image: string;
  isLive: boolean;
  listeners: number;
}

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const LiveProgramsSection = () => {
  const [programs, setPrograms] = useState<MappedProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [programasData, djsData] = await Promise.all([
          getProgramasRadio(),
          getDJs()
        ]);

        // 1. Obtener día y hora actual
        const hoy = new Date().getDay();
        const nombreDia = DIAS_SEMANA[hoy];
        
        const ahora = new Date();
        const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;

        // 2. Filtrar programas de hoy y ordenarlos por hora
        const programasDeHoy = programasData
          .filter((prog: ProgramaRadio) => prog.dias.includes(nombreDia))
          .sort((a: ProgramaRadio, b: ProgramaRadio) => a.horaInicio.localeCompare(b.horaInicio))
          .map((prog: ProgramaRadio) => {
            const dj = djsData.find((d: DJ) => d.id === prog.djId);
            
            // 3. Calcular si está EN VIVO
            const isLive = prog.horaInicio <= horaActual && horaActual <= prog.horaFin;

            // 4. Mapear al formato exacto que espera ProgramCard (Cero 'any')
            return {
              id: prog.id,
              title: prog.nombre,
              host: dj ? dj.nombre : 'Por definir',
              time: `${prog.horaInicio} - ${prog.horaFin}`,
              category: prog.descripcion || 'Programa',
              image: dj?.fotoUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400', // Imagen por defecto si no hay foto
              isLive: isLive,
              listeners: isLive ? Math.floor(Math.random() * 2000) + 500 : 0, // Oyentes simulados para consistencia visual
            } as MappedProgram;
          });

        setPrograms(programasDeHoy);
      } catch (error) {
        console.error('Error al cargar programas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Carousel
      title="Programación de Hoy"
      subtitle="Sintoniza nuestros programas destacados"
    >
      {programs.length > 0 ? (
        programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-text-secondary">
          <p>No hay programas programados para hoy.</p>
        </div>
      )}
    </Carousel>
  );
};