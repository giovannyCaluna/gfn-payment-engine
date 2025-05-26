import { Phone } from 'mercadopago/dist/clients/commonTypes';

export interface AutoRecurring {
  frequency: number;
  frequency_type: 'days' | 'months' | 'years';
  start_date: string;
  end_date?: string;
  currency_id: 'USD' | 'ARS' | 'BRL' | 'MXN' | 'COP' | 'CLP';
  transaction_amount: number;
}

export interface ProductInfo {
  type: 'subscription' | 'one_time';
  order_id: string;
  reason: string;
  external_reference: string;
  payer_email: string;
  auto_recurring: AutoRecurring;
  back_url: string;
}

export interface CardInfo {
  card_id: string;
  customer_id: string;
  payment_method_id: string;
}

export interface UserInfo {
  name: string;
  last_name: string;
  email: string;
  external_user_id: string;
  phone: Phone;
  direccion: string;
}

export interface PaymentAlreadyRegistered {
  appId: string;
  method: string;
  customer_id: string;
  userInfo: UserInfo;
  productInfo: ProductInfo;
  cardInfo: CardInfo;
}

