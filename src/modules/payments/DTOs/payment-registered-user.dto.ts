import { Phone } from 'mercadopago/dist/clients/commonTypes';
import { CardInfo, UserInfoDTO } from './payment.dto';
import { findPlansInterface } from '@/modules/subscriptions/DTO/create-subscription.dto';
import { CustomerCardBody } from 'mercadopago/dist/clients/customerCard/create/types';

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




export interface PaymentUserAlreadyRegistered {
  app_id: number;
  method: string;
  platform_id: number;
  customer_id: string;
  userInfo: UserInfoDTO;
  productInfo: findPlansInterface;
  cardInfo: CardInfo;
  country_code: string;
}

