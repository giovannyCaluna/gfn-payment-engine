export interface CreatePaymentDTO {
  transaction_amount: number;
  payment_method_id: string;
  payer: {
    type: 'customer';
    id: string;
  };
  token: string;
  callback_url?: string;
  description: string;
  external_reference: string;
  installments: number;
  notification_url: string;
}
