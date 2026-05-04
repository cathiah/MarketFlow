interface ProductsHeaderProps {
  title: string;
}

export function ProductsHeader({ title }: ProductsHeaderProps) {
  return (
    <header className="mb-10 text-center md:text-left">
      <h1 className="text-4xl font-extrabold mb-3 text-primary">{ title }</h1>
      <p className="text-lg opacity-80">
        Gestion de votre contenu : consultez, modifiez ou supprimez vos publications.
      </p>
    </header>
  );
}