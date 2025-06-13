import { UserInfoDTO } from '@/modules/users/DTOs/user.dto';
import { productSubscriptionInfo } from '@/modules/subscriptions/DTO/product-subscription-info.dto';
import { CardInfo } from './card-info.dto';


export interface PaymentUserAlreadyRegistered {
  app_id: number;
  method: string;
  platform_id: number;
  customer_id: string;
  userInfo: UserInfoDTO;
  productInfo: productSubscriptionInfo;
  cardInfo: CardInfo;
  country_code: string;
}

