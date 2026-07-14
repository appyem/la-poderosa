import { Heart, MessageCircle, Share2, UserPlus } from 'lucide-react';

export const CommunityPage = () => {
  const posts = [
    { id: 1, user: 'Laura Gómez', handle: '@laurag', avatar: 'L', content: '¡Increíble el concierto de anoche! Gracias LA PODEROSA por la cobertura en vivo. 🎸🔥', likes: 124, comments: 18, time: '2h' },
    { id: 2, user: 'Andrés Ruiz', handle: '@andresr', avatar: 'A', content: 'Alguien sabe a qué hora es el programa de deportes mañana? No quiero perderme el análisis.', likes: 45, comments: 5, time: '5h' },
  ];

  return (
    <div className="space-y-6 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comunidad</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-light text-white text-sm font-semibold transition-colors">
          <UserPlus className="w-4 h-4" /> Seguir
        </button>
      </div>
      <div className="p-4 rounded-xl bg-dark-surface border border-dark-border flex gap-3">
        <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold flex-shrink-0">Tú</div>
        <input type="text" placeholder="¿Qué estás pensando?" className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 focus:border-brand focus:outline-none" />
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 rounded-xl bg-dark-surface border border-dark-border space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-dark-elevated flex items-center justify-center font-bold">{post.avatar}</div>
              <div>
                <p className="font-semibold text-sm">{post.user} <span className="text-text-muted font-normal">{post.handle}</span></p>
                <p className="text-xs text-text-muted">Hace {post.time}</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-6 pt-2 border-t border-dark-border">
              <button className="flex items-center gap-2 text-sm text-text-muted hover:text-brand transition-colors"><Heart className="w-4 h-4" /> {post.likes}</button>
              <button className="flex items-center gap-2 text-sm text-text-muted hover:text-brand transition-colors"><MessageCircle className="w-4 h-4" /> {post.comments}</button>
              <button className="flex items-center gap-2 text-sm text-text-muted hover:text-brand transition-colors"><Share2 className="w-4 h-4" /> Compartir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
