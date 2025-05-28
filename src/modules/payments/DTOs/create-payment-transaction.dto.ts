// src/modules/payments/dto/create-payment.dto.ts

import { payments_status, payments_payment_method } from '@prisma/client';

export interface CreateTransactionPaymentDTO {
  subscription_id: number;
  user_id: number;
  platform_id: number;
  external_payment_id?: string;
  amount: string;
  currency: string;
  status: payments_status;
  payment_method: payments_payment_method;
  description?: string;
  invoice_url?: string;
  attempted_at: string;
  confirmed_at?: string | null;
  refunded_at?: string | null;
  failure_reason?: string | null;
  response_data?: string | null;
}
