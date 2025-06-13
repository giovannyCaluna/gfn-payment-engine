
import { productSubscriptionInfo } from '@/modules/subscriptions/DTO/product-subscription-info.dto';
import { UserInfoDTO } from '@/modules/users/DTOs/user.dto';
import { CardInfo } from './card-info.dto';



export interface PaymentDTO {

  app_id: number;
  country_code: string;
  platform_id: number;
  method: string;
  userInfo: UserInfoDTO;
  customer_id?: string;
  cardInfo: CardInfo;
  productInfo: productSubscriptionInfo;
}
