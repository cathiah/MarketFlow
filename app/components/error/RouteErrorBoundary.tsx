// components/Error/RouteErrorBoundary.tsx
import React from "react";
import { isRouteErrorResponse, Link, href } from "react-router";

interface RouteErrorBoundaryProps {
  error: unknown;
}

/**
 * A reusable component to display user-friendly error messages.
 * Handles both Route Error Responses (404, 500, etc.) and standard JavaScript exceptions.
 */
export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = React.memo(function RouteErrorBoundary({ error }) {
  const containerClasses = "min-h-[80vh] flex flex-col items-center justify-center p-6 text-center";

  if (isRouteErrorResponse(error)) {
    const is404 = error.status === 404;
    return (
      <div className={containerClasses}>
        <div className="card w-full max-w-lg bg-base-200 shadow-xl border border-primary/20">
          <div className="card-body items-center text-center">
            <div className="badge badge-error gap-2 mb-2">Code : {error.status}</div>
            <h1 className="card-title text-4xl font-black text-secondary mb-2">
              {is404 ? "Oups ! Page introuvable" : "Erreur système"}
            </h1>
            <p className="text-base-content/80 mb-6">
              {is404 
                ? "La page que vous recherchez a été déplacée ou n'existe pas." 
                : (error.data as { message?: string })?.message || "Une erreur serveur inattendue est survenue."}
            </p>
            <Link to={href("/")} className="btn btn-primary">Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="alert alert-error shadow-lg max-w-2xl border-2 border-red-500/50">
        <div className="text-left">
          <h3 className="font-bold text-lg">Une erreur critique est survenue</h3>
          <div className="mt-2 p-3 bg-base-300 rounded-md font-mono text-xs text-pink-400">
            {error instanceof Error ? error.message : "Erreur inconnue"}
          </div>
        </div>
        <Link to={href("/")} className="btn btn-sm btn-ghost border-white/20">Recharger</Link>
      </div>
    </div>
  );
});
