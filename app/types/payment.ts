export type PaymentProvider = 'stripe' | 'paypal' | 'card';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentDetails {
  card_brand?: string; // visa, mastercard, amex, etc.
  last_4?: string; // Last 4 digits of card
  cardholder_name?: string;
  email?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  provider: PaymentProvider;
  payment_details: PaymentDetails;
  external_id?: string;
  status: PaymentStatus;
  created_at: string;
}

export interface CreatePaymentInput {
  order_id: string;
  amount: number;
  provider: PaymentProvider;
  payment_details: PaymentDetails;
  external_id?: string;
}