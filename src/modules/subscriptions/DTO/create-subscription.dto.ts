export interface CreateSubscriptionDto {
  user_id: number;
  plan_id: number;
  status?: 'active' | 'paused' | 'canceled' | 'trial'; // optional, defaults to 'active'
  start_date: string; // ISO string or 'YYYY-MM-DD HH:mm:ss'
  next_billing_date: string;
  interval: 'monthly' | 'yearly';
  grace_period_days?: number;
  last_payment_id?: number;
}
