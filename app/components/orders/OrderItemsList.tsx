interface OrderItem {
  product?: { title: string };
  quantity: number;
  unit_price: number;
}

interface OrderItemsListProps {
  items: OrderItem[];
  totalAmount: number;
}

export const OrderItemsList = ({ items, totalAmount }: OrderItemsListProps) => {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
        Détails des articles
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between items-center text-sm">
            <div>
              <span className="opacity-80">{item.product?.title}</span>
              <span className="text-xs opacity-60 ml-2">x{item.quantity}</span>
            </div>
            <span className="font-medium">
              {item.unit_price} € × {item.quantity}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-dashed border-base-300 flex justify-between items-center">
        <span className="text-sm font-semibold">Montant total</span>
        <span className="text-lg font-bold text-primary">{totalAmount} €</span>
      </div>
    </div>
  );
};
