import type { Profile } from "~/types/profile";
import { UserTableRow } from "./UserTableRow";

export const UserList = ({ users }: { users: Profile[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Équipe</h1>
          <p className="text-base-content/60 mt-1">
            Gérez les accès et les rôles de la plateforme.
          </p>
        </div>
        <div className="badge badge-primary badge-outline gap-2 p-4">
          <span className="font-bold">{users.length}</span> membres
        </div>
      </div>

      <div className="bg-base-200/50 rounded-2xl border border-base-content/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-md w-full">
            <thead className="bg-base-content/5 text-base-content/70">
              <tr>
                <th className="font-semibold">Membre</th>
                <th className="font-semibold">Contact</th>
                <th className="font-semibold">Statut / Rôle</th>
                <th className="font-semibold">Arrivée</th>
                <th className="text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              {users.length > 0 ? (
                users.map((user) => <UserTableRow key={user.id} user={user} />)
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-base-content/40">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



