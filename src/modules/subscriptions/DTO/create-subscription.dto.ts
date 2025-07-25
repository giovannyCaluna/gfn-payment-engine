import { Decimal } from "@prisma/client/runtime/library";

export interface CreateSubscriptionDto {
  user_id: number;
  plan_id: number;
  status?: 'active' | 'paused' | 'canceled' | 'trial' | 'expired'; // optional, defaults to 'active'
  start_date: string
  end_date: string;
  next_billing_date: string;
  amount: Decimal;
  interval: 'monthly' | 'biannualy';
  grace_period_days?: number;
  trial_end_at?: string;
  cancellation_reason?: string;
  last_payment_id?: number;
  metadata?: JSON;
  created_at: Date;
  updated_at?: Date;
}






