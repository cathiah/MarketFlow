export type PaymentPayload = {
  payment_method: string;
  card_number: string;
  expiry_date: string;
  cardholder_name: string;
  shipping_address?: string;
};
