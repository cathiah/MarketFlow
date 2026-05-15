interface AcceptanceCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AcceptanceCheckbox({ checked, onChange }: AcceptanceCheckboxProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          name="accepted"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="checkbox checkbox-sm checkbox-primary"
          required
        />
        <span className="text-xs text-base-content/70">
          J'accepte les conditions d'utilisation.
        </span>
      </label>
    </div>
  );
}
