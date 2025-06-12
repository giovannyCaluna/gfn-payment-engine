import { Decimal } from "@prisma/client/runtime/library";
import { Phone } from "mercadopago/dist/clients/commonTypes";

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




export interface CreateUserExternalPlatformInterface {
  user_id: number,
  platform_id: number,
  external_user_id?: string,
  platform_name: string,
  created_at: Date;
  updated_at?: Date;
}

export interface findPlansInterface {
  external_id: number,
  name?: string,
  amount?: string,
  currency?: string,
  is_active:boolean
}