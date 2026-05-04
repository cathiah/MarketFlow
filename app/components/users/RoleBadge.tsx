import type { Profile } from "~/types/profile";

export const RoleBadge = ({ role }: { role: Profile["role"] }) => {
  const styles: Record<string, string> = {
    admin: "badge-error border-error/20 bg-error/10 text-error",
    seller: "badge-warning border-warning/20 bg-warning/10 text-warning",
    buyer: "badge-ghost bg-base-content/5 opacity-70",
  };

  return (
    <span
      className={`badge badge-sm font-bold uppercase tracking-wider py-3 border ${
        styles[role] ?? styles.buyer
      }`}
    >
      {role}
    </span>
  );
};
