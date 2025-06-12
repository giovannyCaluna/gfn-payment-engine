import { Phone } from "mercadopago/dist/clients/commonTypes";

export interface UserInfoDTO {

  first_name: string;
  last_name: string;
  email: string;
  phone: Phone;
  country_code: string;
}