// components/shared/StatusMessage.tsx
import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface StatusMessageProps {
  message: string;
  type?: "success" | "error";
}

export const StatusMessage: React.FC<StatusMessageProps> = React.memo(function StatusMessage({ message, type = "error" }) {
  const isError = type === "error";

  return (
    <div className="p-4">
      <div className={`alert ${isError ? "alert-error" : "alert-success"} shadow-lg flex items-center gap-3`}>
        {isError ? (
          <AlertCircle size={24} className="shrink-0" />
        ) : (
          <CheckCircle2 size={24} className="shrink-0" />
        )}
        
        <div className="flex flex-col text-left">
          <h3 className="font-bold text-sm">
            {isError ? "Erreur" : "Succès"}
          </h3>
          <p className="text-xs opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
});
