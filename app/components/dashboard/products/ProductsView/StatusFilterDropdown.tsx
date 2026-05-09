import React, { useCallback } from "react";
import { Filter } from "lucide-react";

export type StatusFilter = "all" | "published" | "draft";

const LABELS: Record<StatusFilter, string> = {
  all: "Tous les statuts",
  published: "En ligne",
  draft: "Brouillons",
};

interface StatusFilterDropdownProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export const StatusFilterDropdown: React.FC<StatusFilterDropdownProps> = React.memo(
  function StatusFilterDropdown({ value, onChange }) {
    const setAll = useCallback(() => onChange("all"), [onChange]);
    const setPublished = useCallback(() => onChange("published"), [onChange]);
    const setDraft = useCallback(() => onChange("draft"), [onChange]);

    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost bg-base-200/50 gap-2">
          <Filter size={18} />
          <span className="hidden sm:inline">{LABELS[value]}</span>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-1 menu p-2 shadow-xl bg-base-300 rounded-xl w-52 border border-white/10 mt-2"
        >
          <li>
            <button onClick={setAll}>Tous les produits</button>
          </li>
          <li>
            <button onClick={setPublished}>En ligne</button>
          </li>
          <li>
            <button onClick={setDraft}>Brouillons</button>
          </li>
        </ul>
      </div>
    );
  }
);
