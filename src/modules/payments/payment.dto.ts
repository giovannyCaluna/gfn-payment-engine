// payment.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsUrl,
  IsPositive,
  IsIn,
  ValidateNested,
  IsOptional,
  IsArray,
  ArrayMinSize,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';

export class AutoRecurringDTO {
  @IsNumber({}, { message: 'La frecuencia debe ser un número' }) // Corrección aquí
  @IsPositive()
  frequency: number;

  @IsString()
  @IsIn(['days', 'months', 'years'])
  frequency_type: string;

  @IsString()
  @IsNotEmpty()
  start_date: string;

  @IsString()
  @IsOptional()
  end_date?: string;

  @IsString()
  @IsIn(['USD', 'ARS', 'BRL', 'MXN', 'COP', 'CLP'])
  currency_id: string;

  @IsNumber()
  @IsPositive()
  transaction_amount: number;

  constructor(
    frequency: number,
    frequency_type: string,
    start_date: string,
    end_date: string,
    currency_id: string,
    transaction_amount: number
  ) {
    this.frequency = frequency;
    this.frequency_type = frequency_type;
    this.start_date = start_date;
    this.end_date = end_date;
    this.currency_id = currency_id;
    this.transaction_amount = transaction_amount;
  }
}

export class ProductInfoDTO {
  @IsString()
  @IsIn(['subscription', 'one_time'])
  type: string;

  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  reason: string;

  @IsString()
  external_reference: string;

  @IsEmail()
  payer_email: string;

  @ValidateNested()
  @Type(() => AutoRecurringDTO)
  auto_recurring: AutoRecurringDTO;

  @IsUrl()
  back_url: string;

  constructor(
    type: string,
    order_id: string,
    reason: string,
    external_reference: string,
    payer_email: string,
    auto_recurring: AutoRecurringDTO,
    back_url: string

  ) {
    this.type = type;
    this.order_id = order_id;
    this.reason = reason;
    this.external_reference = external_reference;
    this.payer_email = payer_email
    this.auto_recurring = auto_recurring
    this.back_url = back_url
  }
}

export class CardInfoDTO {
  @IsString()
  @IsNotEmpty()
  card_token: string;

  @IsString()
  @IsIn(['CPF', 'CNPJ', 'DNI', 'CI', 'PASSPORT'])
  identification_tipe: string;

  @IsString()
  @IsNotEmpty()
  identification_number: string;

  constructor(
    card_token: string,
    identification_tipe: string,
    identification_number: string

  ) {
    this.card_token = card_token;
    this.identification_tipe = identification_tipe;
    this.identification_number = identification_number;

  }
}

export class UserInfoDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  mail: string;

  @IsString()
  @IsNotEmpty()
  external_user_id: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  constructor(
    name: string,
    last_name: string,
    mail: string,
    external_user_id: string,
    phone: string,
    direccion: string
  ) {
    this.name = name;
    this.last_name = last_name;
    this.mail = mail;
    this.external_user_id = external_user_id;
    this.phone = phone;
    this.direccion = direccion
  }
}

export class PaymentDTO {
  @IsString()
  @IsIn(['mercadopago', 'wom'])
  method: string;

  @ValidateNested()
  @Type(() => UserInfoDTO)
  userInfo: UserInfoDTO;

  @ValidateNested()
  @Type(() => CardInfoDTO)
  cardInfo: CardInfoDTO;

  @ValidateNested()
  @Type(() => ProductInfoDTO)
  productInfo: ProductInfoDTO;

  constructor(
    method: string,
    userInfo: UserInfoDTO,
    cardInfo: CardInfoDTO,
    productInfo: ProductInfoDTO
  ) {
    this.method = method;
    this.userInfo = userInfo;
    this.cardInfo = cardInfo;
    this.productInfo = productInfo

  }
}

export class PaymentStatusDTO {
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'refunded'])
  status: string;

  @IsString()
  @IsNotEmpty()
  method: string;

  constructor(
    paymentId: string,
    status: string,
    method: string
  ) {
    this.paymentId = paymentId;
    this.status = status;
    this.method = method;

  }
}