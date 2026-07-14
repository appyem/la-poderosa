interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export const AudioVisualizer = ({ isPlaying, barCount = 30 }: AudioVisualizerProps) => {
  return (
    <div className="flex items-end justify-center gap-1 h-24">
      {Array.from({ length: barCount }, (_, i) => {
        // Cálculo determinista basado en el índice: 100% puro, sin Math.random
        const delay = `${i * 0.05}s`;
        const duration = `${0.4 + (i % 3) * 0.1}s`;
        
        return (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              isPlaying ? 'bg-gradient-to-t from-brand to-brand-light' : 'bg-dark-elevated h-2'
            }`}
            style={
              isPlaying
                ? {
                    animation: `bounce 0.5s ease-in-out infinite alternate`,
                    animationDelay: delay,
                    animationDuration: duration,
                  }
                : {}
            }
          />
        );
      })}
      <style>{`
        @keyframes bounce {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
};