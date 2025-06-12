import { Prisma } from '@prisma/client';
import prisma from 'lib/prisma';
import { CreateTransactionPaymentDTO } from "./DTOs/create-payment-transaction.dto";

export class PaymentFunctions {
  
  constructor() { }

    async savePayment (data:CreateTransactionPaymentDTO){
    
      const result = await prisma.payments.create({
      data: {
        subscription_id: data.subscription_id,
        user_id: data.user_id,
        platform_id: data.platform_id,
        external_payment_id: data.external_payment_id,
        amount: new Prisma.Decimal(data.amount),
        currency: data.currency,
        status: data.status, 
        payment_method: data.payment_method,
        description: data.description,
        attempted_at: data.attempted_at,
        confirmed_at:data.confirmed_at,
        refunded_at: data.refunded_at,
        failure_reason: data.failure_reason,
        response_data: "{\"payment_id\": \"1234567890\", \"details\": \"Successful transaction\"}"
      }
    });

    return result
    

  }
}
