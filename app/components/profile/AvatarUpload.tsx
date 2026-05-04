// components/Profil/AvatarUpload.tsx
import React, { useState, useCallback, useEffect } from "react";
import { Camera, User } from "lucide-react";

interface AvatarProps {
  avatarUrl?: string | null;
  username?: string | null;
}

export const AvatarUpload: React.FC<AvatarProps> = React.memo(function AvatarUpload({ avatarUrl, username }) {
  const [preview, setPreview] = useState<string | null>(avatarUrl || null);

  useEffect(() => {
    setPreview(avatarUrl || null);
  }, [avatarUrl]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
        <div className="relative w-48 h-48 rounded-[2.3rem] overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-500 group-hover:border-white/30">
          
          {preview ? (
            <img 
              src={preview} 
              alt="Avatar" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-20 group-hover:opacity-40 transition-opacity">
               <User size={48} strokeWidth={1} />
               <span className="text-[10px] font-medium tracking-[0.3em] uppercase">{username || 'User'}</span>
            </div>
          )}

          <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]">
            <div className="p-3 rounded-full bg-white text-black shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Camera size={20} />
            </div>
            <input 
              type="file" 
              name="avatar" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange} 
            />
          </label>
        </div>

        <div className="absolute -bottom-0 -right-0 w-6 h-6 bg-emerald-500 border-4 border-[#121212] rounded-full shadow-lg shadow-emerald-500/20"></div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/50">Avatar</h3>
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-2"></div>
      </div>
    </div>
  );
});
