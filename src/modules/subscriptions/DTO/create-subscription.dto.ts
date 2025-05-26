import { Phone } from "mercadopago/dist/clients/commonTypes";

export interface CreateSubscriptionDto {
  user_id: number;
  plan_id: number;
  status?: 'active' | 'paused' | 'canceled' | 'trial'; // optional, defaults to 'active'
  start_date: string; // ISO string or 'YYYY-MM-DD HH:mm:ss'
  next_billing_date: string;
  interval: 'monthly' | 'biannualy';
  grace_period_days?: number;
  last_payment_id?: number;
}


export interface CreateUserInterface {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: Phone;
  country_code?: string;
  is_active: boolean;
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