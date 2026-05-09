export function UserAvatar({ user }: { user: any }) {
  const initial = user.full_name.charAt(0).toUpperCase();

  return (
    <div className="avatar placeholder">
      <div className="w-10 h-10 rounded-xl bg-neutral ring-2 ring-primary/20 hover:ring-primary transition-all duration-300 shadow-xl flex items-center justify-center overflow-hidden">
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.full_name} 
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `<span class="text-primary font-black text-sm">${initial}</span>`;
            }}
          />
        ) : (
          <span className="text-primary font-black text-sm">{initial}</span>
        )}
      </div>
    </div>
  );
}
