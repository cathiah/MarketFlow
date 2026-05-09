import React from "react";
import { ArrowLeft } from "lucide-react";
import { href, Link } from "react-router";

export const ArticleNavBar: React.FC = React.memo(function ArticleNavBar() {
  return (
    <nav>
      <Link
        to={href("/")}
        className="btn btn-ghost btn-sm gap-2 px-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <ArrowLeft size={18} /> Retour
      </Link>
    </nav>
  );
});
