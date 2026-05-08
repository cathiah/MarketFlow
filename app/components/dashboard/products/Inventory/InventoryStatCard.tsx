import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "primary" | "success" | "warning";
}

export const InventoryStatCard: React.FC<StatCardProps> = React.memo(function InventoryStatCard({ title, value, icon: Icon, color }) {
  const colors = {
    primary: "border-primary text-primary shadow-primary/5",
    success: "border-success text-success shadow-success/5",
    warning: "border-warning text-warning shadow-warning/5",
  } as const;

  return (
    <div className={`card bg-base-200/50 border-l-4 shadow-xl ${colors[color]}`}>
      <div className="card-body p-5 flex-row items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-black opacity-40 tracking-wider mb-1">
            {title}
          </p>
          <p className="text-3xl font-black text-white">{value}</p>
        </div>
        <div className="p-3 bg-base-300/50 rounded-xl">
          <Icon size={20} className="opacity-80" />
        </div>
      </div>
    </div>
  );
});
