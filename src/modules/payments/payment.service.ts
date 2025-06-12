import { PaymentUserAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { CardsRequestDTO } from '../platforms/mercado-pago/DTOs/cards -request';
import { PaymentDTO } from './DTOs/payment.dto';
import PaymentIntegrationService from './payment.integration';

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

  // Manejar una notificación de pago
  async handlePaymentNotification(notificationData: any, method: string): Promise<any> {
    return await this.paymentIntegrationService.handlePaymentNotification(notificationData, method as PaymentMethod);
  }

  async getCards(data: CardsRequestDTO): Promise<any> {
    return await this.paymentIntegrationService.getCards(data);
  }
  async executePayment(data: PaymentUserAlreadyRegistered): Promise<any> {
    return await this.paymentIntegrationService.executePayment(data);
  }



}

export default PaymentService;
