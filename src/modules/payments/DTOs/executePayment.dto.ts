export interface ExecutePaymentDto {
  subscription_id: number;
  platformCode: string;
  platform_id: number;
  external_payment_id?: string; // Optional: ID from Mercado Pago or other
  amount: number;
  currency: string; // e.g., 'USD', 'EUR', 'ARS'
  attempted_at?: string; // Optional override, ISO date string
  confirmed_at?: string; // Optional, when payment was confirmed
  status?: 'pending' | 'paid' | 'failed' | 'refunded'; // Optional, default to 'pending'
  response_data?: string; // Optional: JSON payload from payment provider
}
