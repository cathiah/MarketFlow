import { getPublicUrl } from "~/utils/supabase-url";

interface AvatarProps {
  avatarPath: string | null | undefined;
  username: string | null | undefined;
  size?: number; // px
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ avatarPath, username, size = 28, className = "" }) => {
  const url = getPublicUrl("avatars", avatarPath);
  const initials = (username ?? "?")[0].toUpperCase();

  return url ? (
    <img
      src={url}
      alt={username ?? ""}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-base-300 flex items-center justify-center text-[11px] font-black opacity-50 shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
};