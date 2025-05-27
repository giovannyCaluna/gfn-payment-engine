
import { findPlansInterface } from '@/modules/subscriptions/DTO/create-subscription.dto';
import { Phone } from 'mercadopago/dist/clients/commonTypes';
import { CustomerCardBody } from 'mercadopago/dist/clients/customerCard/create/types';

export interface AutoRecurringDTO {
  frequency: number;
  frequency_type: string;
  start_date: string;
  end_date?: string;
  currency_id: string;
  transaction_amount: number;

}

export interface ProductInfoDTO {

  type: string;
  order_id: string;
  reason: string;
  external_reference: string;
  payer_email: string;
  auto_recurring: AutoRecurringDTO;
  back_url: string;
}

export interface UserInfoDTO {

  first_name: string;
  last_name: string;
  email: string;
  phone: Phone;
}

export interface CardInfo {
  token: string;
  payment_method_id: string;
  customer_id: string;
  card_id:string
}

export interface PaymentDTO {

  accessToken: string;
  method: string;
  userInfo: UserInfoDTO;
  cardInfo: CardInfo;
  productInfo: findPlansInterface;
}

export interface PaymentStatusDTO {
  paymentId: string;
  status: string;
  method: string;
}