import { Phone } from "mercadopago/dist/clients/commonTypes";

export interface UserInfoDTO {

  email: string;
  first_name?: string;
  last_name?: string;
  phone?: Phone;
  country_code?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}