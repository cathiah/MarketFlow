import { Outlet, Link, useLocation, href, useRouteError } from "react-router";
import type { Route } from "./+types/_layout";
import { RouteErrorBoundary } from "~/components/error/RouteErrorBoundary";

export default function AuthLayout(_: Route.ComponentProps) {
  const location = useLocation();
  const isLogin = location.pathname.includes("login");

  return (
    <div className="min-h-screen bg-[#1d1e2a] flex flex-col font-sans" data-theme="dracula">
      <main className="grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-125 bg-[#282a36]/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl p-6 sm:p-10 z-10 my-8">
          <div className="flex gap-6 sm:gap-8 mb-8 border-b border-white/10 pb-0 flex-nowrap overflow-x-auto no-scrollbar">
            <Link 
              to={href("/auth/login")}
              className={`pb-3 text-sm sm:text-base transition-all relative whitespace-nowrap ${
                isLogin ? "text-primary font-bold" : "text-base-content/40 hover:text-base-content"
              }`}
            >
              Connexion
              {isLogin && (
                <div className="absolute -bottom-px left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#ff79c6]" />
              )}
            </Link>
            
            <Link 
              to={href("/auth/register")}
              className={`pb-3 text-sm sm:text-base transition-all relative whitespace-nowrap ${
                !isLogin ? "text-primary font-bold" : "text-base-content/40 hover:text-base-content"
              }`}
            >
              Inscription
              {!isLogin && (
                <div className="absolute -bottom-px left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#ff79c6]" />
              )}
            </Link>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <RouteErrorBoundary error={error} />;
}
