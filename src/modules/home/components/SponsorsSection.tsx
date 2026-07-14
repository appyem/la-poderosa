import { mockSponsors } from '../../../core/data/mockData';

export const SponsorsSection = () => {
  return (
    <section className="py-8 border-t border-b border-dark-border">
      <div className="px-4 md:px-0">
        <h3 className="text-center text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">
          Nuestros Patrocinadores
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {mockSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex items-center gap-2 text-2xl md:text-3xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              title={sponsor.name}
            >
              <span>{sponsor.logo}</span>
              <span className="text-sm font-semibold text-text-secondary hidden md:inline">
                {sponsor.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};