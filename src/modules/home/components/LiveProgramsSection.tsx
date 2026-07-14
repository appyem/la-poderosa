import { Carousel } from '../../../shared/components/Carousel';
import { ProgramCard } from '../../../shared/components/ProgramCard';
import { mockPrograms } from '../../../core/data/mockData';

export const LiveProgramsSection = () => {
  return (
    <Carousel
      title="Programas en Vivo y Recientes"
      subtitle="Sintoniza nuestros programas destacados"
    >
      {mockPrograms.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </Carousel>
  );
};