import { PaymentUserAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { CardTokenRequestDTO } from '../platforms/mercado-pago/DTOs/card-token-request.dto';
import { CardsRequestDTO } from '../platforms/mercado-pago/DTOs/cards -request';
import { PaymentDTO, PaymentStatusDTO } from './DTOs/payment.dto';
import PaymentIntegrationService from './payment.integration';
import { CreatePaymentDTO } from '../platforms/mercado-pago/DTOs/mp-create-payment.dto';
import { CreateTransactionPaymentDTO, payments_payment_method } from './DTOs/create-payment-transaction.dto';
import prisma from 'lib/prisma';
import { Prisma } from '@prisma/client';

type PaymentMethod = 'mercadopago' | 'wom' | 'stripe';
class PaymentService {

  private paymentIntegrationService: PaymentIntegrationService;

  constructor() {
    this.paymentIntegrationService = new PaymentIntegrationService();
  }

  // Crear un pago
  async registerCardAndFirstPayment(paymentData: PaymentDTO): Promise<any> {
    const { method } = paymentData;
    return await this.paymentIntegrationService.registerCardAndFirstPayment(paymentData, method as PaymentMethod);
  }

  // Consultar el estado de un pago
  async getPaymentStatus(paymentStatusData: PaymentStatusDTO): Promise<string> {
    const { paymentId, method } = paymentStatusData;
    return await this.paymentIntegrationService.getPaymentStatus(paymentId, method as PaymentMethod);
  }

  // Manejar una notificación de pago
  async handlePaymentNotification(notificationData: any, method: string): Promise<any> {
    return await this.paymentIntegrationService.handlePaymentNotification(notificationData, method as PaymentMethod);
  }

  async generateCardToken(cardData: CardTokenRequestDTO, method: string): Promise<any> {
    return await this.paymentIntegrationService.generateCardToken(cardData, method as PaymentMethod);
  }


  async getCards(data: CardsRequestDTO): Promise<any> {
    return await this.paymentIntegrationService.getCards(data);
  }
  async executePayment(data: PaymentUserAlreadyRegistered): Promise<any> {
    return await this.paymentIntegrationService.executePayment(data);
  }

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

export default PaymentService;
