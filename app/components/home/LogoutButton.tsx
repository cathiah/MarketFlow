import { useState } from "react";
import { Form, href } from "react-router";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  onClose?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Form
      method="post"
      action={href("/auth/logout")}
      onSubmit={() => { setLoading(true); onClose?.(); }}
    >
      <button
        type="submit"
        name="intent"
        value="logout"
        disabled={loading}
        className="btn btn-circle btn-ghost btn-sm text-error hover:bg-error/10 transition-all duration-200"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
      </button>
    </Form>
  );
};