import { 
  User, Mail, MapPin, BadgeCheck, Shield, 
  Calendar, Fingerprint, Clock, CreditCard, 
  Settings2
} from "lucide-react";
import { Link, href } from "react-router";
import type { Profile } from "~/types/profile";

interface ProfilViewProps {
  profile: Profile;
}

export function ProfilView({ profile }: ProfilViewProps) {
  const formatDate = (dateStr: string) => 
    new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    }).format(new Date(dateStr));

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 animate-in fade-in duration-500">
      {/* HEADER : Identité visuelle */}
      <div className="relative overflow-hidden bg-base-200 rounded-3xl p-8 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="avatar">
          <div className="w-32 h-32 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username ?? ''} />
            ) : (
              <div className="bg-neutral text-neutral-content flex items-center justify-center text-5xl font-black h-full w-full">
                {profile.full_name?.charAt(0) || profile.username?.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="z-10 text-center md:text-left space-y-2 flex-1">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight">{profile.full_name}</h1>
            <span className={`badge border-none font-bold uppercase text-[10px] px-3 py-3 ${
              profile.role === 'admin' ? 'badge-error' : profile.role === 'seller' ? 'badge-secondary' : 'badge-primary'
            }`}>
              {profile.role}
            </span>
          </div>
          <p className="text-xl opacity-60 font-medium flex items-center justify-center md:justify-start gap-2">
            <Fingerprint size={18} className="text-primary" /> @{profile.username}
          </p>
        </div>

        <div className="z-10 flex-none">
          <Link 
            to={href("/dashboard/profile/edit")} 
            className="btn btn-primary rounded-2xl gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Settings2 size={18} />
            <span>Modifier le profil</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLONNE GAUCHE : Infos de contact */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-200 shadow-xl border border-white/5">
            <div className="card-body">
              <h3 className="card-title text-xs uppercase tracking-[0.3em] opacity-40 mb-4">Informations Générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoBlock label="Nom Complet" value={profile.full_name} icon={<User size={16}/>} />
                <InfoBlock label="Email de contact" value={profile.email} icon={<Mail size={16}/>} />
                <InfoBlock label="ID Unique (UUID)" value={profile.id} icon={<Shield size={16}/>} isCode />
                <InfoBlock label="Dernière mise à jour" value={formatDate(profile.updated_at)} icon={<Clock size={16}/>} />
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl border border-white/5">
            <div className="card-body">
              <h3 className="card-title text-xs uppercase tracking-[0.3em] opacity-40 mb-4">Adresses et Logistique</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-base-300/50 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-secondary font-bold text-[10px] uppercase tracking-wider">
                    <MapPin size={14}/> Adresse de livraison
                  </div>
                  <p className="text-sm italic">{profile.shipping_address || "Non renseignée"}</p>
                </div>
                <div className="p-5 bg-base-300/50 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-wider">
                    <CreditCard size={14}/> Adresse de facturation
                  </div>
                  <p className="text-sm italic">{profile.billing_address || (profile.shipping_address ? "Identique à la livraison" : "Non renseignée")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : Stats / Badges */}
        <div className="space-y-6">
          <div className="card bg-primary text-primary-content shadow-xl">
            <div className="card-body items-center text-center">
              <BadgeCheck size={48} className="mb-2 opacity-80" />
              <h2 className="card-title font-black text-2xl uppercase">Compte Vérifié</h2>
              <p className="text-xs opacity-80 font-bold uppercase tracking-widest">Membre depuis {new Date(profile.created_at).getFullYear()}</p>
            </div>
          </div>

          <div className="card bg-base-200 border border-white/5">
            <div className="card-body text-sm space-y-4">
              <div className="flex justify-between items-center opacity-60">
                <span className="flex items-center gap-2"><Calendar size={14}/> Création</span>
                <span className="font-mono text-[10px]">{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="flex justify-between items-center opacity-60">
                <span className="flex items-center gap-2"><Shield size={14}/> Statut</span>
                <span className="badge badge-outline badge-xs uppercase font-bold text-[9px]">{profile.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, icon, isCode = false }: { label: string, value: string | null, icon: React.ReactNode, isCode?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-black opacity-30 flex items-center gap-2">
        {icon} {label}
      </label>
      <p className={`text-sm font-semibold truncate ${isCode ? 'font-mono text-xs opacity-70' : 'text-base-content'}`}>
        {value || "—"}
      </p>
    </div>
  );
}
