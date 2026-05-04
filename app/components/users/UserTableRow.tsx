import { href, useFetcher } from "react-router";
import { Trash2 } from "lucide-react";
import { useRef } from "react";
import type { Profile } from "~/types/profile";
import { RoleBadge } from "./RoleBadge";

const SUPABASE_STORAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars`;

function getAvatarUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SUPABASE_STORAGE_URL}/${path}`;
}

export const UserTableRow = ({ user }: { user: Profile }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();

  const fetcher = useFetcher();

  const handleDelete = () => {
    fetcher.submit({ userId: user.id }, { method: "DELETE", action: href("/dashboard/admin/users") });
    closeModal();
  };

  return (
    <>
      <tr className="hover:bg-base-content/5 transition-colors group">
        <td>
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-14 h-14 rounded-2xl ring ring-primary/30 ring-offset-base-300 ring-offset-2 shadow-xl overflow-hidden">
                {getAvatarUrl(user.avatar_url) ? (
                  <img
                    src={getAvatarUrl(user.avatar_url)!}
                    alt={user.username ?? ""}
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-neutral text-neutral-content flex items-center justify-center text-xl font-black h-full w-full">
                    {(user.full_name?.charAt(0) || user.username?.charAt(0) || "?").toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="font-bold text-white group-hover:text-primary transition-colors">
                {user.full_name || "Utilisateur Anonyme"}
              </div>
              <div className="text-xs font-mono opacity-50 italic">@{user.username}</div>
            </div>
          </div>
        </td>

        <td>
          <span className="text-sm font-medium">{user.email}</span>
        </td>

        <td>
          <RoleBadge role={user.role} />
        </td>

        <td>
          <span className="text-sm opacity-70">
            {new Date(user.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </td>

        <td className="text-right">
          <button
            onClick={openModal}
            className="btn btn-ghost btn-sm btn-square hover:btn-error text-base-content/50 hover:text-white"
            aria-label={`Supprimer ${user.username ?? user.full_name}`}
          >
            <Trash2 size={18} />
          </button>
        </td>
      </tr>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box bg-base-200 border border-base-content/10 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-error/10 text-error p-2 rounded-xl">
              <Trash2 size={20} />
            </div>
            <h3 className="font-black text-lg text-white">Supprimer l'utilisateur</h3>
          </div>

          <p className="text-base-content/60 text-sm mt-3">
            Êtes-vous sûr de vouloir supprimer{" "}
            <span className="text-white font-semibold">
              {user.full_name || user.username || "cet utilisateur"}
            </span>{" "}
            ? Cette action est irréversible.
          </p>

          <div className="modal-action mt-6">
            <button
              onClick={closeModal}
              className="btn btn-ghost btn-sm rounded-xl"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-sm rounded-xl"
            >
              <Trash2 size={15} />
              Confirmer
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
