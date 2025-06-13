
import { findPlansInterface } from '@/modules/subscriptions/DTO/create-subscription.dto';
import { UserInfoDTO } from '@/modules/users/DTOs/user.dto';


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


export interface CardInfo {
  token?: string;
  payment_method_id: string;
  customer_id: string;
  card_id: string
}

export interface PaymentDTO {

  app_id: number;
  country_code: string;
  platform_id: number;
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