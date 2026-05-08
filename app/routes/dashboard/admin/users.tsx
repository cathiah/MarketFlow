import type { Route } from "./+types/users";
import { performGetUsers, performDeleteUser } from "./users.server";
import { UserList } from "~/components/dashboard/admin/UserList";

export async function loader({ request }: Route.LoaderArgs) {
  return await performGetUsers(request);
}

export async function action({ request }: Route.ActionArgs) {
  return await performDeleteUser(request);
}

export const meta: Route.MetaFunction = ({ data }) => {
  const userCount = data && 'users' in data ? data.users?.length : 0;

  return [
    { title: `Gestion Utilisateurs (${userCount}) | Dashboard` },
    {
      name: "description",
      content: "Administrez les comptes utilisateurs, gérez les rôles et consultez les profils.",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

export default function Users({ loaderData: { users } }: Route.ComponentProps) {
  return <UserList users={users} />;
}
